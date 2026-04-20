"""
MT-KT: Multimodal Transformer Knowledge Tracing Model
Architecture as specified in the IEEE paper:
  - 2-layer Transformer encoder
  - 4 attention heads
  - Hidden size 128
  - Dropout 0.1
  - Inputs: skill_id, correctness, response_time, affective_state
  - Output: probability of correct response (AUC 0.7641 on ASSISTments+EdNet)
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import math
import os
import json
import logging
from typing import Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)


class AffectiveEmbedding(nn.Module):
    """Encodes affective states: focus, frustration, confusion, boredom."""
    def __init__(self, hidden_size: int = 128):
        super().__init__()
        # 4 affective dimensions -> hidden_size
        self.fc = nn.Sequential(
            nn.Linear(4, hidden_size // 2),
            nn.ReLU(),
            nn.Linear(hidden_size // 2, hidden_size),
        )
        self.norm = nn.LayerNorm(hidden_size)

    def forward(self, affective: torch.Tensor) -> torch.Tensor:
        # affective: (batch, seq_len, 4)
        return self.norm(self.fc(affective))


class TemporalEmbedding(nn.Module):
    """Log-normalized response time encoding."""
    def __init__(self, hidden_size: int = 128):
        super().__init__()
        self.fc = nn.Sequential(
            nn.Linear(1, hidden_size // 2),
            nn.ReLU(),
            nn.Linear(hidden_size // 2, hidden_size),
        )
        self.norm = nn.LayerNorm(hidden_size)

    def forward(self, time_features: torch.Tensor) -> torch.Tensor:
        # time_features: (batch, seq_len, 1) - log-normalized
        return self.norm(self.fc(time_features))


class CausalMultimodalEmbedding(nn.Module):
    """
    Unified causal embedding space combining:
      - Skill embeddings
      - Correctness embeddings
      - Temporal features
      - Affective states
    """
    def __init__(self, num_skills: int, hidden_size: int = 128):
        super().__init__()
        self.hidden_size = hidden_size

        # Skill + correctness interaction: (skill_id, correct) -> 2*num_skills options
        self.interaction_emb = nn.Embedding(2 * num_skills + 10, hidden_size, padding_idx=0)

        # Skill embedding alone (for prediction time)
        self.skill_emb = nn.Embedding(num_skills + 10, hidden_size, padding_idx=0)

        # Affective encoder
        self.affective_enc = AffectiveEmbedding(hidden_size)

        # Temporal encoder
        self.temporal_enc = TemporalEmbedding(hidden_size)

        # Fusion layer: combine all 3 modalities
        self.fusion = nn.Sequential(
            nn.Linear(hidden_size * 3, hidden_size),
            nn.LayerNorm(hidden_size),
            nn.GELU(),
        )

        # Positional encoding
        self.pos_emb = nn.Embedding(512, hidden_size)

    def forward(
        self,
        skill_ids: torch.Tensor,
        correctness: torch.Tensor,
        response_times: torch.Tensor,
        affective_states: torch.Tensor,
        mode: str = "train",
    ) -> torch.Tensor:
        batch_size, seq_len = skill_ids.shape
        device = skill_ids.device

        # Interaction embedding: encode (skill, correct) pairs
        if mode == "train":
            interaction_idx = skill_ids + correctness * (skill_ids.max() + 1)
            interaction_idx = interaction_idx.clamp(0, self.interaction_emb.num_embeddings - 1)
            x_interaction = self.interaction_emb(interaction_idx)
        else:
            x_interaction = self.skill_emb(skill_ids)

        # Temporal features: log-normalize
        log_times = torch.log1p(response_times.float()).unsqueeze(-1)
        x_temporal = self.temporal_enc(log_times)

        # Affective features
        x_affective = self.affective_enc(affective_states.float())

        # Fuse all modalities
        x = self.fusion(torch.cat([x_interaction, x_temporal, x_affective], dim=-1))

        # Add positional encoding
        positions = torch.arange(seq_len, device=device).unsqueeze(0).expand(batch_size, -1)
        positions = positions.clamp(0, 511)
        x = x + self.pos_emb(positions)

        return x


class TransformerKTLayer(nn.Module):
    """Single Transformer encoder layer with causal (masked) attention."""
    def __init__(self, hidden_size: int = 128, num_heads: int = 4, dropout: float = 0.1):
        super().__init__()
        self.self_attn = nn.MultiheadAttention(
            embed_dim=hidden_size,
            num_heads=num_heads,
            dropout=dropout,
            batch_first=True,
        )
        self.ff = nn.Sequential(
            nn.Linear(hidden_size, hidden_size * 4),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_size * 4, hidden_size),
        )
        self.norm1 = nn.LayerNorm(hidden_size)
        self.norm2 = nn.LayerNorm(hidden_size)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x: torch.Tensor, causal_mask: Optional[torch.Tensor] = None) -> torch.Tensor:
        # Self-attention with residual
        attn_out, _ = self.self_attn(x, x, x, attn_mask=causal_mask)
        x = self.norm1(x + self.dropout(attn_out))
        # FFN with residual
        x = self.norm2(x + self.dropout(self.ff(x)))
        return x


class MTKTModel(nn.Module):
    """
    Multimodal Transformer Knowledge Tracing (MT-KT)

    Architecture:
      - Causal multimodal embedding (skill + correctness + time + affect)
      - 2x Transformer encoder layers (4 heads, hidden=128, dropout=0.1)
      - Sigmoid output -> P(correct response at next timestep)

    Achieves AUC 0.7641 on ASSISTments 2012-2013 + EdNet-KT1.
    """

    def __init__(
        self,
        num_skills: int = 265,
        hidden_size: int = 128,
        num_heads: int = 4,
        num_layers: int = 2,
        dropout: float = 0.1,
        max_seq_len: int = 200,
    ):
        super().__init__()
        self.num_skills = num_skills
        self.hidden_size = hidden_size
        self.max_seq_len = max_seq_len

        # Multimodal embedding
        self.embedding = CausalMultimodalEmbedding(num_skills, hidden_size)

        # Transformer encoder (2 layers, 4 heads)
        self.layers = nn.ModuleList([
            TransformerKTLayer(hidden_size, num_heads, dropout)
            for _ in range(num_layers)
        ])

        # Output head: predict P(correct)
        self.output_head = nn.Sequential(
            nn.Linear(hidden_size, hidden_size // 2),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_size // 2, 1),
            nn.Sigmoid(),
        )

        self._init_weights()

    def _init_weights(self):
        for module in self.modules():
            if isinstance(module, nn.Linear):
                nn.init.xavier_uniform_(module.weight)
                if module.bias is not None:
                    nn.init.zeros_(module.bias)
            elif isinstance(module, nn.Embedding):
                nn.init.normal_(module.weight, std=0.02)

    def _make_causal_mask(self, seq_len: int, device: torch.device) -> torch.Tensor:
        """Upper triangular mask to prevent attending to future positions."""
        mask = torch.triu(torch.ones(seq_len, seq_len, device=device), diagonal=1).bool()
        mask = mask.float().masked_fill(mask, float('-inf'))
        return mask

    def forward(
        self,
        skill_ids: torch.Tensor,
        correctness: torch.Tensor,
        response_times: torch.Tensor,
        affective_states: torch.Tensor,
        mode: str = "train",
    ) -> torch.Tensor:
        seq_len = skill_ids.shape[1]
        device = skill_ids.device

        # Embed all modalities
        x = self.embedding(skill_ids, correctness, response_times, affective_states, mode)

        # Causal mask
        causal_mask = self._make_causal_mask(seq_len, device)

        # Pass through transformer layers
        for layer in self.layers:
            x = layer(x, causal_mask)

        # Predict P(correct) at each timestep
        logits = self.output_head(x).squeeze(-1)  # (batch, seq_len)
        return logits

    def predict_mastery(
        self,
        skill_ids: List[int],
        correctness: List[int],
        response_times: List[float],
        affective_states: List[List[float]],
    ) -> Dict[str, float]:
        """
        Predict mastery probability for a student's interaction history.
        Returns dict with mastery probability per skill.
        """
        self.eval()
        with torch.no_grad():
            # Pad/truncate to max_seq_len
            seq_len = min(len(skill_ids), self.max_seq_len)
            skill_ids = skill_ids[-seq_len:]
            correctness = correctness[-seq_len:]
            response_times = response_times[-seq_len:]
            affective_states = affective_states[-seq_len:]

            # Convert to tensors
            s = torch.tensor([skill_ids], dtype=torch.long)
            c = torch.tensor([correctness], dtype=torch.long)
            t = torch.tensor([response_times], dtype=torch.float)
            a = torch.tensor([affective_states], dtype=torch.float)

            # Forward pass
            probs = self(s, c, t, a, mode="predict")

            # Last prediction = current mastery estimate
            mastery_prob = probs[0, -1].item()

            # Per-skill mastery (aggregate by skill)
            skill_mastery = {}
            for i, skill_id in enumerate(skill_ids):
                if skill_id not in skill_mastery:
                    skill_mastery[skill_id] = []
                skill_mastery[skill_id].append(probs[0, i].item())

            return {
                "overall_mastery": mastery_prob,
                "per_skill": {
                    sid: float(np.mean(probs_list))
                    for sid, probs_list in skill_mastery.items()
                },
            }


def train_mt_kt(
    data_path: str,
    model_save_path: str,
    num_skills: int = 265,
    epochs: int = 30,
    batch_size: int = 64,
    lr: float = 0.0005,
    device: str = "cpu",
):
    """
    Train MT-KT on ASSISTments or EdNet dataset.
    Expected CSV columns: user_id, skill_id, correct, response_time,
                          affect_focus, affect_frustration, affect_confusion, affect_boredom
    """
    import pandas as pd
    from torch.utils.data import Dataset, DataLoader
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import roc_auc_score

    logger.info(f"Loading dataset from {data_path}")
    df = pd.read_csv(data_path)

    # Normalize columns to expected names
    col_map = {
        "skill_name": "skill_id",
        "skill": "skill_id",
        "problem_id": "skill_id",
        "elapsed_time": "response_time",
        "ms_first_response": "response_time",
    }
    df = df.rename(columns={k: v for k, v in col_map.items() if k in df.columns})

    required = ["user_id", "skill_id", "correct"]
    for col in required:
        if col not in df.columns:
            raise ValueError(f"Missing required column: {col}")

    # Encode skills to integer indices
    skill_enc = {s: i + 1 for i, s in enumerate(df["skill_id"].unique())}
    df["skill_idx"] = df["skill_id"].map(skill_enc)
    num_skills = len(skill_enc) + 1

    # Fill missing affective/temporal cols with defaults
    if "response_time" not in df.columns:
        df["response_time"] = 30.0
    if "affect_focus" not in df.columns:
        df["affect_focus"] = 0.7
    if "affect_frustration" not in df.columns:
        df["affect_frustration"] = 0.1
    if "affect_confusion" not in df.columns:
        df["affect_confusion"] = 0.1
    if "affect_boredom" not in df.columns:
        df["affect_boredom"] = 0.1

    df["correct"] = df["correct"].clip(0, 1).fillna(0).astype(int)
    df["response_time"] = df["response_time"].fillna(30.0).clip(0, 3600)

    class KTDataset(Dataset):
        def __init__(self, sequences, max_len=200):
            self.sequences = sequences
            self.max_len = max_len

        def __len__(self):
            return len(self.sequences)

        def __getitem__(self, idx):
            seq = self.sequences[idx]
            length = min(len(seq), self.max_len)
            seq = seq[-length:]

            skills = torch.zeros(self.max_len, dtype=torch.long)
            corrects = torch.zeros(self.max_len, dtype=torch.long)
            times = torch.zeros(self.max_len)
            affects = torch.zeros(self.max_len, 4)
            mask = torch.zeros(self.max_len, dtype=torch.bool)

            for i, row in enumerate(seq):
                skills[i] = row["skill_idx"]
                corrects[i] = row["correct"]
                times[i] = row["response_time"]
                affects[i] = torch.tensor([
                    row["affect_focus"],
                    row["affect_frustration"],
                    row["affect_confusion"],
                    row["affect_boredom"],
                ])
                mask[i] = True

            return skills, corrects, times, affects, mask

    # Group by user and build sequences
    logger.info("Building user sequences...")
    sequences = []
    for _, group in df.groupby("user_id"):
        seq = group[["skill_idx", "correct", "response_time",
                      "affect_focus", "affect_frustration",
                      "affect_confusion", "affect_boredom"]].to_dict("records")
        if len(seq) >= 3:
            sequences.append(seq)

    logger.info(f"Total sequences: {len(sequences)}, skills: {num_skills}")

    train_seqs, val_seqs = train_test_split(sequences, test_size=0.1, random_state=42)
    train_ds = KTDataset(train_seqs)
    val_ds = KTDataset(val_seqs)

    train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_ds, batch_size=batch_size, shuffle=False, num_workers=0)

    model = MTKTModel(num_skills=num_skills).to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=lr)
    criterion = nn.BCELoss()
    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, patience=3, factor=0.5)

    best_auc = 0.0
    patience_count = 0
    os.makedirs(model_save_path, exist_ok=True)

    for epoch in range(epochs):
        # Train
        model.train()
        train_loss = 0.0
        for batch in train_loader:
            skills, corrects, times, affects, mask = [b.to(device) for b in batch]
            optimizer.zero_grad()

            # Predict next step using all but last
            preds = model(skills[:, :-1], corrects[:, :-1], times[:, :-1], affects[:, :-1])
            targets = corrects[:, 1:].float()
            valid_mask = mask[:, 1:]

            loss = criterion(preds[valid_mask], targets[valid_mask])
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            optimizer.step()
            train_loss += loss.item()

        # Validate
        model.eval()
        all_preds, all_targets = [], []
        with torch.no_grad():
            for batch in val_loader:
                skills, corrects, times, affects, mask = [b.to(device) for b in batch]
                preds = model(skills[:, :-1], corrects[:, :-1], times[:, :-1], affects[:, :-1])
                targets = corrects[:, 1:].float()
                valid_mask = mask[:, 1:]
                all_preds.extend(preds[valid_mask].cpu().numpy())
                all_targets.extend(targets[valid_mask].cpu().numpy())

        auc = roc_auc_score(all_targets, all_preds) if len(set(all_targets)) > 1 else 0.5
        avg_loss = train_loss / len(train_loader)
        scheduler.step(1 - auc)

        logger.info(f"Epoch {epoch+1}/{epochs} | Loss: {avg_loss:.4f} | AUC: {auc:.4f}")

        if auc > best_auc:
            best_auc = auc
            patience_count = 0
            torch.save({
                "model_state": model.state_dict(),
                "num_skills": num_skills,
                "skill_encoder": skill_enc,
                "best_auc": best_auc,
                "epoch": epoch + 1,
            }, os.path.join(model_save_path, "mt_kt_best.pt"))
            logger.info(f"  ✓ Saved best model (AUC={best_auc:.4f})")
        else:
            patience_count += 1
            if patience_count >= 7:
                logger.info("Early stopping triggered.")
                break

    # Save final skill encoder
    with open(os.path.join(model_save_path, "skill_encoder.json"), "w") as f:
        json.dump({str(k): v for k, v in skill_enc.items()}, f)

    logger.info(f"Training complete. Best AUC: {best_auc:.4f}")
    return best_auc


def load_mt_kt(model_path: str, device: str = "cpu") -> Tuple[MTKTModel, Dict]:
    """Load a trained MT-KT model from checkpoint."""
    checkpoint = torch.load(model_path, map_location=device)
    model = MTKTModel(num_skills=checkpoint["num_skills"])
    model.load_state_dict(checkpoint["model_state"])
    model.eval()
    return model, checkpoint.get("skill_encoder", {})
