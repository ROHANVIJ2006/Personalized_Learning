"""
train_models.py — Train MT-KT and DQN models.

Usage:
  # 1. Preprocess datasets first:
  python datasets/preprocess.py --dataset assistments --input datasets/raw/assistments_2012_2013.csv --output datasets/assistments_processed.csv
  python datasets/preprocess.py --dataset ednet --input datasets/raw/ednet_kt1.csv --output datasets/ednet_processed.csv

  # 2. Train MT-KT (Knowledge Tracing Transformer):
  python train_models.py --model mt_kt --data datasets/assistments_processed.csv --save ai_models/trained

  # 3. Train DQN (RL Policy Engine):
  python train_models.py --model dqn --data datasets/assistments_processed.csv --save ai_models/trained

  # 4. Train both:
  python train_models.py --model both --data datasets/assistments_processed.csv --save ai_models/trained
"""

import argparse
import logging
import os
import json
import sys
import torch
import pandas as pd
import numpy as np

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


def train_mt_kt_model(data_path: str, save_path: str):
    from ai_models.mt_kt_model import train_mt_kt

    device = "cuda" if torch.cuda.is_available() else "cpu"
    logger.info(f"Training MT-KT on device: {device}")

    # Detect num_skills from data
    df = pd.read_csv(data_path, nrows=100)
    logger.info(f"Dataset columns: {list(df.columns)}")

    auc = train_mt_kt(
        data_path=data_path,
        model_save_path=save_path,
        epochs=30,
        batch_size=64,
        lr=0.0005,
        device=device,
    )
    logger.info(f"MT-KT training complete. Final AUC: {auc:.4f}")
    return auc


def build_logged_data_for_dqn(data_path: str, save_path: str):
    """Convert processed KT data into RL transition format for DQN training."""
    logger.info("Building DQN logged data from KT dataset...")
    df = pd.read_csv(data_path)

    state_cols = ["avg_correctness", "time_penalty", "affect_focus",
                  "affect_frustration", "affect_confusion", "affect_boredom"]

    # Build transitions per user
    transitions = []
    for user_id, group in df.groupby("user_id"):
        group = group.reset_index(drop=True)
        for i in range(len(group) - 1):
            row = group.iloc[i]
            next_row = group.iloc[i + 1]

            # State: rolling average of last 5 interactions
            window = group.iloc[max(0, i - 4): i + 1]

            state = [
                float(window["correct"].mean()),
                float(window["time_penalty"].mean()),
                float(window["affect_focus"].mean()),
                float(window["affect_frustration"].mean()),
                float(window["affect_confusion"].mean()),
                float(window["affect_boredom"].mean()),
            ]

            next_state = [
                float(group.iloc[max(0, i - 3): i + 2]["correct"].mean()),
                float(next_row["time_penalty"]),
                float(next_row["affect_focus"]),
                float(next_row["affect_frustration"]),
                float(next_row["affect_confusion"]),
                float(next_row["affect_boredom"]),
            ]

            action = int(row["skill_id"]) % 20  # map skill to action
            reward = (
                1.0 * float(next_row["correct"])
                + 0.5 * float(next_row["affect_focus"])
                - 0.5 * (float(next_row["affect_frustration"]) +
                         float(next_row["affect_confusion"]) +
                         float(next_row["affect_boredom"]))
                - float(next_row["time_penalty"])
            )

            transitions.append({
                **{f: v for f, v in zip(["avg_correctness", "time_penalty",
                                          "affect_focus", "affect_frustration",
                                          "affect_confusion", "affect_boredom"], state)},
                "action": action,
                "reward": reward,
                **{f: v for f, v in zip(["next_avg_correctness", "next_time_penalty",
                                          "next_focus", "next_frustration",
                                          "next_confusion", "next_boredom"], next_state)},
                "done": 1.0 if i == len(group) - 2 else 0.0,
            })

    logged_df = pd.DataFrame(transitions)
    logged_path = os.path.join(save_path, "logged_transitions.csv")
    os.makedirs(save_path, exist_ok=True)
    logged_df.to_csv(logged_path, index=False)
    logger.info(f"Logged {len(logged_df)} transitions -> {logged_path}")

    # Build action index (20 skill-based actions)
    action_index = {str(i): i for i in range(20)}
    action_path = os.path.join(save_path, "action_index.json")
    with open(action_path, "w") as f:
        json.dump(action_index, f)

    return logged_path, action_path


def train_dqn_model(data_path: str, save_path: str):
    from ai_models.dqn_agent import train_dqn_on_logged_data

    logged_path, action_path = build_logged_data_for_dqn(data_path, save_path)

    device = "cuda" if torch.cuda.is_available() else "cpu"
    logger.info(f"Training DQN on device: {device}")

    result = train_dqn_on_logged_data(
        logged_data_path=logged_path,
        action_index_path=action_path,
        model_save_path=save_path,
        episodes=500,
        device=device,
    )

    logger.info(f"DQN training complete.")
    logger.info(f"DR Policy Value: {result['dr_value']:.4f} (target: 0.6908)")
    logger.info(f"IPS Value: {result['ips_value']:.4f}")
    logger.info(f"DM Value: {result['dm_value']:.4f}")
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train SkillNova AI models")
    parser.add_argument("--model", choices=["mt_kt", "dqn", "both"], default="both")
    parser.add_argument("--data", default="datasets/assistments_processed.csv")
    parser.add_argument("--save", default="ai_models/trained")
    args = parser.parse_args()

    os.makedirs(args.save, exist_ok=True)

    if not os.path.exists(args.data):
        logger.error(f"Data file not found: {args.data}")
        logger.error("Please run preprocessing first:")
        logger.error("  python datasets/preprocess.py --dataset assistments --input <raw_csv> --output datasets/assistments_processed.csv")
        sys.exit(1)

    if args.model in ("mt_kt", "both"):
        train_mt_kt_model(args.data, args.save)

    if args.model in ("dqn", "both"):
        train_dqn_model(args.data, args.save)

    logger.info("All models trained successfully!")
    logger.info(f"Models saved to: {args.save}/")
    logger.info("  - mt_kt_best.pt  (Transformer Knowledge Tracing)")
    logger.info("  - dqn_policy.pt  (DQN Policy Engine)")
    logger.info("  - skill_encoder.json")
    logger.info("  - action_index.json")
