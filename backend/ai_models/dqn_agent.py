"""
DQN Policy Engine for Adaptive Educational Interventions
As specified in the IEEE paper:

State vector: s_t = [C_avg, T_penalty, E_focused, E_fru, E_con, E_bor]  (6-dim)
Reward:       r_t = +1.0*C_{t+1} + 0.5*E_focused - 0.5*(E_fru+E_con+E_bor) - T_pen
Actions:      Discrete set of course/intervention recommendations
Policy value: 0.6908 (DR-estimated), +38% over uniform baseline (0.501)
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import random
import os
import json
import logging
from collections import deque
from typing import List, Dict, Tuple, Optional

logger = logging.getLogger(__name__)

# ── Hyperparameters (from paper Table II) ──
STATE_DIM = 6          # [C_avg, T_penalty, E_focused, E_fru, E_con, E_bor]
HIDDEN_DIM = 128
GAMMA = 0.99
LR = 0.001
BATCH_SIZE = 64
MEMORY_SIZE = 10000
TARGET_UPDATE_FREQ = 100
EPSILON_START = 1.0
EPSILON_END = 0.05
EPSILON_DECAY = 0.995


class DQNNetwork(nn.Module):
    """
    Deep Q-Network approximating Q(s,a).
    Maps 6-dim state to Q-values for each action (course recommendation).
    """
    def __init__(self, state_dim: int = STATE_DIM, action_dim: int = 20, hidden_dim: int = HIDDEN_DIM):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(state_dim, hidden_dim),
            nn.LayerNorm(hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.LayerNorm(hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim // 2),
            nn.ReLU(),
            nn.Linear(hidden_dim // 2, action_dim),
        )
        self._init_weights()

    def _init_weights(self):
        for m in self.modules():
            if isinstance(m, nn.Linear):
                nn.init.xavier_uniform_(m.weight)
                nn.init.zeros_(m.bias)

    def forward(self, state: torch.Tensor) -> torch.Tensor:
        return self.net(state)


class ReplayMemory:
    """Experience replay buffer."""
    def __init__(self, capacity: int = MEMORY_SIZE):
        self.memory = deque(maxlen=capacity)

    def push(self, state, action, reward, next_state, done):
        self.memory.append((state, action, reward, next_state, done))

    def sample(self, batch_size: int) -> List[Tuple]:
        return random.sample(self.memory, batch_size)

    def __len__(self):
        return len(self.memory)


class DQNAgent:
    """
    DQN agent that selects course/intervention recommendations.
    Implements Bellman update:
      Q(s,a) <- Q(s,a) + alpha * [r + gamma * max_a' Q(s',a') - Q(s,a)]
    """

    def __init__(
        self,
        state_dim: int = STATE_DIM,
        action_dim: int = 20,
        hidden_dim: int = HIDDEN_DIM,
        device: str = "cpu",
    ):
        self.state_dim = state_dim
        self.action_dim = action_dim
        self.device = device
        self.epsilon = EPSILON_START
        self.steps = 0

        # Online and target networks
        self.q_network = DQNNetwork(state_dim, action_dim, hidden_dim).to(device)
        self.target_network = DQNNetwork(state_dim, action_dim, hidden_dim).to(device)
        self.target_network.load_state_dict(self.q_network.state_dict())
        self.target_network.eval()

        self.optimizer = torch.optim.Adam(self.q_network.parameters(), lr=LR)
        self.memory = ReplayMemory(MEMORY_SIZE)
        self.loss_history = []

    def build_state(
        self,
        avg_correctness: float,
        response_time_penalty: float,
        affect_focus: float,
        affect_frustration: float,
        affect_confusion: float,
        affect_boredom: float,
    ) -> np.ndarray:
        """Build 6-dim state vector from student metrics."""
        return np.array([
            float(avg_correctness),
            float(response_time_penalty),
            float(affect_focus),
            float(affect_frustration),
            float(affect_confusion),
            float(affect_boredom),
        ], dtype=np.float32)

    def compute_reward(
        self,
        next_correctness: float,
        affect_focus: float,
        affect_frustration: float,
        affect_confusion: float,
        affect_boredom: float,
        time_penalty: float,
    ) -> float:
        """
        Reward function from paper (Eq. 3):
        r_t = +1.0*C_{t+1} + 0.5*E_focused - 0.5*(E_fru + E_con + E_bor) - T_pen
        """
        reward = (
            1.0 * float(next_correctness)
            + 0.5 * float(affect_focus)
            - 0.5 * (float(affect_frustration) + float(affect_confusion) + float(affect_boredom))
            - float(time_penalty)
        )
        return float(reward)

    def select_action(self, state: np.ndarray, epsilon: Optional[float] = None) -> int:
        """Epsilon-greedy action selection."""
        eps = epsilon if epsilon is not None else self.epsilon
        if random.random() < eps:
            return random.randint(0, self.action_dim - 1)

        with torch.no_grad():
            state_tensor = torch.FloatTensor(state).unsqueeze(0).to(self.device)
            q_values = self.q_network(state_tensor)
            return q_values.argmax().item()

    def get_top_k_actions(self, state: np.ndarray, k: int = 5) -> List[Tuple[int, float]]:
        """Return top-k actions with their Q-values (for recommendation ranking)."""
        self.q_network.eval()
        with torch.no_grad():
            state_tensor = torch.FloatTensor(state).unsqueeze(0).to(self.device)
            q_values = self.q_network(state_tensor).squeeze(0)
            top_k = torch.topk(q_values, min(k, self.action_dim))
            return [(idx.item(), val.item()) for idx, val in zip(top_k.indices, top_k.values)]

    def store_transition(self, state, action, reward, next_state, done):
        self.memory.push(state, action, reward, next_state, done)

    def update(self) -> Optional[float]:
        """Single Bellman update step."""
        if len(self.memory) < BATCH_SIZE:
            return None

        batch = self.memory.sample(BATCH_SIZE)
        states, actions, rewards, next_states, dones = zip(*batch)

        states = torch.FloatTensor(np.array(states)).to(self.device)
        actions = torch.LongTensor(actions).to(self.device)
        rewards = torch.FloatTensor(rewards).to(self.device)
        next_states = torch.FloatTensor(np.array(next_states)).to(self.device)
        dones = torch.FloatTensor(dones).to(self.device)

        # Q(s, a)
        current_q = self.q_network(states).gather(1, actions.unsqueeze(1)).squeeze(1)

        # max_a' Q_target(s', a')
        with torch.no_grad():
            next_q = self.target_network(next_states).max(1)[0]
            target_q = rewards + GAMMA * next_q * (1 - dones)

        loss = F.smooth_l1_loss(current_q, target_q)
        self.optimizer.zero_grad()
        loss.backward()
        torch.nn.utils.clip_grad_norm_(self.q_network.parameters(), 1.0)
        self.optimizer.step()

        self.steps += 1
        if self.steps % TARGET_UPDATE_FREQ == 0:
            self.target_network.load_state_dict(self.q_network.state_dict())

        # Decay epsilon
        self.epsilon = max(EPSILON_END, self.epsilon * EPSILON_DECAY)
        self.loss_history.append(loss.item())
        return loss.item()

    def save(self, path: str):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        torch.save({
            "q_network": self.q_network.state_dict(),
            "target_network": self.target_network.state_dict(),
            "epsilon": self.epsilon,
            "steps": self.steps,
            "action_dim": self.action_dim,
            "state_dim": self.state_dim,
        }, path)
        logger.info(f"DQN agent saved to {path}")

    def load(self, path: str):
        checkpoint = torch.load(path, map_location=self.device)
        self.q_network.load_state_dict(checkpoint["q_network"])
        self.target_network.load_state_dict(checkpoint["target_network"])
        self.epsilon = checkpoint.get("epsilon", EPSILON_END)
        self.steps = checkpoint.get("steps", 0)
        self.q_network.eval()
        logger.info(f"DQN agent loaded from {path} (steps={self.steps}, ε={self.epsilon:.3f})")


class DoublyRobustEvaluator:
    """
    Doubly Robust (DR) off-policy evaluation.
    Estimates policy value without direct intervention.
    Paper result: DR value = 0.6908 (+38% over uniform baseline 0.501)
    """

    def __init__(self, agent: DQNAgent):
        self.agent = agent

    def evaluate(
        self,
        logged_data: List[Dict],
        logging_policy_probs: Optional[List[float]] = None,
    ) -> Dict[str, float]:
        """
        Compute DR estimate of policy value.
        logged_data: list of {state, action, reward, next_state}
        """
        if not logged_data:
            return {"dr_value": 0.0, "ips_value": 0.0, "dm_value": 0.0}

        n = len(logged_data)
        default_log_prob = 1.0 / self.agent.action_dim  # uniform baseline

        dm_values = []
        ips_values = []
        dr_values = []

        for i, record in enumerate(logged_data):
            state = np.array(record["state"], dtype=np.float32)
            action = record["action"]
            reward = record["reward"]

            # Direct Method (DM): predicted Q value
            with torch.no_grad():
                s_tensor = torch.FloatTensor(state).unsqueeze(0).to(self.agent.device)
                q_vals = self.agent.q_network(s_tensor).squeeze(0)
                pi_action = q_vals.argmax().item()
                dm_val = q_vals[pi_action].item()
                dm_values.append(dm_val)

            # IPS: importance weight
            log_prob = logging_policy_probs[i] if logging_policy_probs else default_log_prob
            policy_prob = 1.0 if pi_action == action else 0.0
            ips_weight = policy_prob / max(log_prob, 1e-6)
            ips_values.append(ips_weight * reward)

            # DR: combine IPS and DM
            dr_val = dm_val + ips_weight * (reward - dm_val)
            dr_values.append(dr_val)

        return {
            "dr_value": float(np.mean(dr_values)),
            "ips_value": float(np.mean(ips_values)),
            "dm_value": float(np.mean(dm_values)),
            "n_samples": n,
        }


def train_dqn_on_logged_data(
    logged_data_path: str,
    action_index_path: str,
    model_save_path: str,
    episodes: int = 500,
    device: str = "cpu",
) -> Dict:
    """
    Train DQN agent on logged interaction data (offline RL).
    logged_data: CSV with columns:
      user_id, avg_correctness, time_penalty, affect_focus,
      affect_frustration, affect_confusion, affect_boredom,
      action (course_id), reward, next_avg_correctness, ...
    """
    import pandas as pd

    logger.info(f"Loading logged data from {logged_data_path}")
    df = pd.read_csv(logged_data_path)

    # Load action index (course_id -> action_index mapping)
    with open(action_index_path) as f:
        action_index = json.load(f)
    action_dim = len(action_index)

    agent = DQNAgent(state_dim=STATE_DIM, action_dim=action_dim, device=device)
    evaluator = DoublyRobustEvaluator(agent)

    state_cols = ["avg_correctness", "time_penalty", "affect_focus",
                  "affect_frustration", "affect_confusion", "affect_boredom"]
    next_state_cols = ["next_avg_correctness", "next_time_penalty", "next_focus",
                       "next_frustration", "next_confusion", "next_boredom"]

    # Fill missing columns with defaults
    for col in state_cols:
        if col not in df.columns:
            defaults = {"avg_correctness": 0.5, "time_penalty": 0.1,
                        "affect_focus": 0.7, "affect_frustration": 0.1,
                        "affect_confusion": 0.1, "affect_boredom": 0.1}
            df[col] = defaults.get(col, 0.5)

    for col in next_state_cols:
        if col not in df.columns:
            base = col.replace("next_", "")
            df[col] = df.get(base, 0.5)

    if "reward" not in df.columns:
        df["reward"] = df.apply(lambda r: DQNAgent().compute_reward(
            r.get("avg_correctness", 0.5), r.get("affect_focus", 0.7),
            r.get("affect_frustration", 0.1), r.get("affect_confusion", 0.1),
            r.get("affect_boredom", 0.1), r.get("time_penalty", 0.1)
        ), axis=1)

    # Populate replay memory from logged data
    logged_records = []
    for _, row in df.iterrows():
        state = row[state_cols].values.astype(np.float32)
        next_state = row[next_state_cols].values.astype(np.float32)
        action = int(row.get("action", 0)) % action_dim
        reward = float(row.get("reward", 0.0))
        done = float(row.get("done", 0.0))

        agent.store_transition(state, action, reward, next_state, done)
        logged_records.append({"state": state.tolist(), "action": action, "reward": reward})

    # Train
    logger.info(f"Training DQN for {episodes} episodes on {len(logged_records)} transitions...")
    losses = []
    for episode in range(episodes):
        loss = agent.update()
        if loss is not None:
            losses.append(loss)
        if (episode + 1) % 100 == 0:
            avg_loss = np.mean(losses[-100:]) if losses else 0
            logger.info(f"Episode {episode+1}/{episodes} | Avg Loss: {avg_loss:.4f} | ε: {agent.epsilon:.3f}")

    # Evaluate with DR estimator
    dr_result = evaluator.evaluate(logged_records)
    logger.info(f"DR Policy Value: {dr_result['dr_value']:.4f} (paper target: 0.6908)")

    # Save
    os.makedirs(model_save_path, exist_ok=True)
    agent.save(os.path.join(model_save_path, "dqn_policy.pt"))
    with open(os.path.join(model_save_path, "action_index.json"), "w") as f:
        json.dump(action_index, f)
    with open(os.path.join(model_save_path, "dr_evaluation.json"), "w") as f:
        json.dump(dr_result, f, indent=2)

    return dr_result
