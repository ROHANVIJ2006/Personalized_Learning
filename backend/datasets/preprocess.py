"""
Dataset preprocessing for MT-KT training.

Supported datasets:
  1. ASSISTments 2012-2013
     Download: https://sites.google.com/site/assistmentsdata/home/2012-13-school-data-with-affect
     File: 2012-2013-data-with-predictions-4-final.csv

  2. EdNet-KT1
     Download: https://github.com/riiid/ednet
     File: KT1/*.csv (per-user files) or merged ednet_kt1.csv

Usage:
  python datasets/preprocess.py --dataset assistments --input raw/assistments.csv --output datasets/assistments_processed.csv
  python datasets/preprocess.py --dataset ednet --input raw/ednet_kt1.csv --output datasets/ednet_processed.csv
"""

import pandas as pd
import numpy as np
import os
import logging
import argparse
from sklearn.preprocessing import LabelEncoder

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def preprocess_assistments(input_path: str, output_path: str) -> pd.DataFrame:
    """
    Preprocess ASSISTments 2012-2013 dataset.

    Key columns in raw file:
      order_id, assignment_id, user_id, assistment_id, problem_id,
      original, correct, attempt_count, ms_first_response, tutor_mode,
      answer_type, sequence_id, student_class_id, opportunity,
      opportunity_original, overlap_time, school_id, teacher_id,
      hint_count, hint_total, first_action, bottom_hint,
      opportunity_original, overlap_time

    Affective states are estimated from:
      - correct/incorrect patterns -> frustration/confusion proxy
      - hint_count -> confusion proxy
      - ms_first_response -> temporal penalty
    """
    logger.info(f"Loading ASSISTments from {input_path}")
    df = pd.read_csv(input_path, low_memory=False)

    logger.info(f"Raw shape: {df.shape}")
    logger.info(f"Columns: {list(df.columns)}")

    # Standardize column names
    col_map = {}
    for col in df.columns:
        lower = col.lower().strip()
        if lower in ["user_id", "student_id", "studentid"]:
            col_map[col] = "user_id"
        elif lower in ["skill_id", "skill_name", "kc(default)", "kc"]:
            col_map[col] = "skill_id"
        elif lower in ["correct", "correctness", "first_action"]:
            if "correct" not in col_map.values():
                col_map[col] = "correct"
        elif lower in ["ms_first_response", "elapsed_time", "response_time"]:
            col_map[col] = "response_time"
        elif lower in ["hint_count", "hints"]:
            col_map[col] = "hint_count"
        elif lower in ["attempt_count", "attempts"]:
            col_map[col] = "attempt_count"

    df = df.rename(columns=col_map)

    # Required columns
    for col in ["user_id", "skill_id", "correct"]:
        if col not in df.columns:
            raise ValueError(f"Could not find required column: {col}. Available: {list(df.columns)}")

    # Clean
    df = df.dropna(subset=["user_id", "skill_id", "correct"])
    df["correct"] = pd.to_numeric(df["correct"], errors="coerce").fillna(0).clip(0, 1).astype(int)

    # Response time (log-normalized)
    if "response_time" not in df.columns:
        df["response_time"] = 30000.0  # 30 seconds default in ms
    df["response_time"] = pd.to_numeric(df["response_time"], errors="coerce").fillna(30000.0)
    df["response_time"] = df["response_time"] / 1000.0  # ms -> seconds
    df["response_time"] = df["response_time"].clip(1, 3600)

    # Temporal penalty: normalized response time
    df["time_penalty"] = (df["response_time"].apply(np.log1p) /
                          df["response_time"].apply(np.log1p).max()).clip(0, 1)

    # Affective state estimation from behavioral signals
    # Focus: high when correct + low hint usage + fast response
    hint_col = "hint_count" if "hint_count" in df.columns else None
    attempt_col = "attempt_count" if "attempt_count" in df.columns else None

    if hint_col:
        max_hints = df[hint_col].max() or 1
        df["hint_norm"] = (df[hint_col] / max_hints).clip(0, 1)
    else:
        df["hint_norm"] = 0.0

    if attempt_col:
        df["attempt_norm"] = ((df[attempt_col] - 1) / 5.0).clip(0, 1)
    else:
        df["attempt_norm"] = 0.0

    # Rolling window per user to estimate affective state
    df = df.sort_values(["user_id", "order_id"] if "order_id" in df.columns else ["user_id"])

    def rolling_affect(group):
        correct_roll = group["correct"].rolling(5, min_periods=1).mean()
        hint_roll = group["hint_norm"].rolling(5, min_periods=1).mean()
        time_roll = group["time_penalty"].rolling(5, min_periods=1).mean()

        # Focus: high correctness, low hints, low time penalty
        group["affect_focus"] = (correct_roll * 0.5 +
                                  (1 - hint_roll) * 0.3 +
                                  (1 - time_roll) * 0.2).clip(0, 1)
        # Frustration: low correctness + high attempts
        group["affect_frustration"] = ((1 - correct_roll) * 0.6 +
                                        group["attempt_norm"] * 0.4).clip(0, 1)
        # Confusion: hint usage + incorrect
        group["affect_confusion"] = (hint_roll * 0.5 +
                                      (1 - correct_roll) * 0.5).clip(0, 1)
        # Boredom: low time penalty + high correctness (too easy)
        group["affect_boredom"] = (correct_roll * 0.4 +
                                    (1 - time_roll) * 0.6).clip(0, 1) * 0.3
        return group

    logger.info("Computing affective states via rolling windows...")
    df = df.groupby("user_id", group_keys=False).apply(rolling_affect)

    # Normalize skill_id to integers
    le = LabelEncoder()
    df["skill_id"] = le.fit_transform(df["skill_id"].astype(str))

    # Select final columns
    output_cols = ["user_id", "skill_id", "correct", "response_time",
                   "time_penalty", "affect_focus", "affect_frustration",
                   "affect_confusion", "affect_boredom"]
    df_out = df[output_cols].reset_index(drop=True)

    # Save skill mapping
    skill_map_path = output_path.replace(".csv", "_skill_map.json")
    import json
    skill_map = {str(cls): int(i) for i, cls in enumerate(le.classes_)}
    with open(skill_map_path, "w") as f:
        json.dump(skill_map, f)

    logger.info(f"Processed: {len(df_out)} rows, {df['user_id'].nunique()} users, "
                f"{df['skill_id'].nunique()} skills")

    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
    df_out.to_csv(output_path, index=False)
    logger.info(f"Saved to {output_path}")
    return df_out


def preprocess_ednet(input_path: str, output_path: str) -> pd.DataFrame:
    """
    Preprocess EdNet-KT1 dataset.
    Expected columns: user_id, timestamp, solving_id, question_id,
                      user_answer, elapsed_time
    """
    logger.info(f"Loading EdNet from {input_path}")

    # EdNet may be split into per-user files
    if os.path.isdir(input_path):
        logger.info("Loading per-user EdNet files...")
        dfs = []
        for fname in os.listdir(input_path)[:50000]:  # limit for memory
            if fname.endswith(".csv"):
                user_id = fname.replace(".csv", "").replace("u", "")
                try:
                    tmp = pd.read_csv(os.path.join(input_path, fname))
                    tmp["user_id"] = user_id
                    dfs.append(tmp)
                except Exception:
                    pass
        df = pd.concat(dfs, ignore_index=True)
    else:
        df = pd.read_csv(input_path, low_memory=False)

    logger.info(f"Raw shape: {df.shape}")

    # Standardize columns
    col_map = {}
    for col in df.columns:
        lower = col.lower().strip()
        if lower in ["question_id", "content_id", "item_id", "problem_id"]:
            col_map[col] = "skill_id"
        elif lower in ["correct", "user_answer"]:
            if "correct" not in col_map.values():
                col_map[col] = "correct"
        elif lower in ["elapsed_time", "response_time"]:
            col_map[col] = "response_time"
        elif lower == "timestamp":
            col_map[col] = "timestamp"

    df = df.rename(columns=col_map)

    # Handle EdNet's user_answer format (A/B/C/D -> 0/1 needs correct_answer)
    if "correct" not in df.columns:
        if "answered_correctly" in df.columns:
            df["correct"] = df["answered_correctly"]
        else:
            df["correct"] = 0  # fallback

    df["correct"] = pd.to_numeric(df["correct"], errors="coerce").fillna(0).clip(0, 1).astype(int)

    if "response_time" not in df.columns:
        df["response_time"] = 30.0
    df["response_time"] = pd.to_numeric(df["response_time"], errors="coerce").fillna(30.0)
    # EdNet time is in ms
    if df["response_time"].median() > 1000:
        df["response_time"] = df["response_time"] / 1000.0
    df["response_time"] = df["response_time"].clip(1, 3600)

    df["time_penalty"] = (df["response_time"].apply(np.log1p) /
                          df["response_time"].apply(np.log1p).max()).clip(0, 1)

    # Sort by timestamp if available
    if "timestamp" in df.columns:
        df = df.sort_values(["user_id", "timestamp"])

    # Estimate affective states from correctness rolling window
    def rolling_affect_ednet(group):
        correct_roll = group["correct"].rolling(5, min_periods=1).mean()
        time_roll = group["time_penalty"].rolling(5, min_periods=1).mean()

        group["affect_focus"] = (correct_roll * 0.6 + (1 - time_roll) * 0.4).clip(0, 1)
        group["affect_frustration"] = ((1 - correct_roll) * 0.7 + time_roll * 0.3).clip(0, 1)
        group["affect_confusion"] = ((1 - correct_roll) * 0.8).clip(0, 1)
        group["affect_boredom"] = (correct_roll * 0.3 + (1 - time_roll) * 0.7).clip(0, 1) * 0.25
        return group

    logger.info("Computing affective states...")
    df = df.groupby("user_id", group_keys=False).apply(rolling_affect_ednet)

    # Encode skill IDs
    le = LabelEncoder()
    df["skill_id"] = le.fit_transform(df["skill_id"].astype(str))

    output_cols = ["user_id", "skill_id", "correct", "response_time",
                   "time_penalty", "affect_focus", "affect_frustration",
                   "affect_confusion", "affect_boredom"]
    df_out = df[output_cols].reset_index(drop=True)

    logger.info(f"Processed: {len(df_out)} rows, {df['user_id'].nunique()} users")
    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
    df_out.to_csv(output_path, index=False)
    logger.info(f"Saved to {output_path}")
    return df_out


def generate_action_index_from_courses(courses_db_path: str, output_path: str):
    """Generate action_index.json mapping course_id -> DQN action index."""
    import json
    if courses_db_path.endswith(".csv"):
        df = pd.read_csv(courses_db_path)
        course_ids = df["id"].tolist()
    else:
        course_ids = list(range(1, 51))  # fallback: 50 courses

    action_index = {str(cid): i for i, cid in enumerate(course_ids)}
    with open(output_path, "w") as f:
        json.dump(action_index, f, indent=2)
    logger.info(f"Action index saved: {len(action_index)} courses -> {output_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset", choices=["assistments", "ednet"], required=True)
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    if args.dataset == "assistments":
        preprocess_assistments(args.input, args.output)
    else:
        preprocess_ednet(args.input, args.output)
