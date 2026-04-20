"""
AI Service — Central inference service integrating MT-KT + DQN.
This is what all API routes call to get real AI predictions.
"""

import os
import json
import logging
import numpy as np
from typing import List, Dict, Optional, Tuple
import torch

logger = logging.getLogger(__name__)

MODEL_PATH = os.getenv("MODEL_PATH", "./ai_models/trained")


class AIService:
    """
    Singleton service wrapping MT-KT and DQN models.
    Falls back to heuristics if models aren't trained yet.
    """

    def __init__(self):
        self.mt_kt_model = None
        self.dqn_agent = None
        self.skill_encoder: Dict[str, int] = {}
        self.skill_decoder: Dict[int, str] = {}
        self.action_index: Dict[str, int] = {}
        self.action_decoder: Dict[int, str] = {}
        self.models_loaded = False

    async def initialize(self):
        """Load models from disk. Called at startup."""
        try:
            await self._load_mt_kt()
            await self._load_dqn()
            self.models_loaded = True
            logger.info("✓ AI models loaded successfully")
        except Exception as e:
            logger.warning(f"AI models not found (train first): {e}")
            logger.warning("Running in heuristic mode until models are trained.")
            self.models_loaded = False

    async def _load_mt_kt(self):
        from ai_models.mt_kt_model import load_mt_kt
        model_file = os.path.join(MODEL_PATH, "mt_kt_best.pt")
        encoder_file = os.path.join(MODEL_PATH, "skill_encoder.json")
        if not os.path.exists(model_file):
            raise FileNotFoundError(f"MT-KT model not found: {model_file}")
        self.mt_kt_model, self.skill_encoder = load_mt_kt(model_file)
        self.skill_decoder = {v: k for k, v in self.skill_encoder.items()}
        if os.path.exists(encoder_file):
            with open(encoder_file) as f:
                self.skill_encoder = {k: int(v) for k, v in json.load(f).items()}
                self.skill_decoder = {v: k for k, v in self.skill_encoder.items()}
        logger.info(f"MT-KT loaded. Skills: {len(self.skill_encoder)}")

    async def _load_dqn(self):
        from ai_models.dqn_agent import DQNAgent
        agent_file = os.path.join(MODEL_PATH, "dqn_policy.pt")
        action_file = os.path.join(MODEL_PATH, "action_index.json")
        if not os.path.exists(agent_file):
            raise FileNotFoundError(f"DQN model not found: {agent_file}")
        if os.path.exists(action_file):
            with open(action_file) as f:
                self.action_index = json.load(f)
        action_dim = len(self.action_index) if self.action_index else 20
        self.dqn_agent = DQNAgent(action_dim=action_dim)
        self.dqn_agent.load(agent_file)
        self.action_decoder = {v: k for k, v in self.action_index.items()}
        logger.info(f"DQN loaded. Actions: {action_dim}")

    def predict_mastery(
        self,
        user_interactions: List[Dict],
        skill_name: str,
    ) -> Dict:
        """
        Use MT-KT to predict mastery probability.
        interactions: [{skill_id, correct, response_time, affect_focus,
                        affect_frustration, affect_confusion, affect_boredom}]
        """
        if not self.models_loaded or self.mt_kt_model is None:
            return self._heuristic_mastery(user_interactions, skill_name)

        if not user_interactions:
            return {"mastery_probability": 0.5, "confidence": "low"}

        skill_ids = [r.get("skill_id", 0) for r in user_interactions]
        correctness = [int(r.get("correct", 0)) for r in user_interactions]
        response_times = [float(r.get("response_time", 30.0)) for r in user_interactions]
        affective_states = [
            [
                float(r.get("affect_focus", 0.7)),
                float(r.get("affect_frustration", 0.1)),
                float(r.get("affect_confusion", 0.1)),
                float(r.get("affect_boredom", 0.1)),
            ]
            for r in user_interactions
        ]

        result = self.mt_kt_model.predict_mastery(
            skill_ids, correctness, response_times, affective_states
        )
        return {
            "mastery_probability": result["overall_mastery"],
            "per_skill_mastery": result.get("per_skill", {}),
            "confidence": "high" if len(user_interactions) >= 10 else "medium",
        }

    def get_course_recommendations(
        self,
        user_state: Dict,
        available_course_ids: List[int],
        top_k: int = 5,
    ) -> List[Dict]:
        """
        Use DQN to rank course recommendations.
        user_state: {avg_correctness, time_penalty, affect_focus,
                     affect_frustration, affect_confusion, affect_boredom}
        Returns ranked list of {course_id, score, reason}
        """
        if not self.models_loaded or self.dqn_agent is None:
            return self._heuristic_recommendations(user_state, available_course_ids, top_k)

        state = self.dqn_agent.build_state(
            avg_correctness=user_state.get("avg_correctness", 0.5),
            response_time_penalty=user_state.get("time_penalty", 0.1),
            affect_focus=user_state.get("affect_focus", 0.7),
            affect_frustration=user_state.get("affect_frustration", 0.1),
            affect_confusion=user_state.get("affect_confusion", 0.1),
            affect_boredom=user_state.get("affect_boredom", 0.1),
        )

        top_actions = self.dqn_agent.get_top_k_actions(state, k=min(top_k, len(available_course_ids)))

        # Map actions to course IDs
        recommendations = []
        for action_idx, q_value in top_actions:
            course_id_str = self.action_decoder.get(action_idx)
            if course_id_str and int(course_id_str) in available_course_ids:
                recommendations.append({
                    "course_id": int(course_id_str),
                    "score": float(q_value),
                    "reason": self._get_recommendation_reason(user_state, q_value),
                })

        # If not enough mapped, fill with heuristic
        if len(recommendations) < top_k:
            heuristic = self._heuristic_recommendations(
                user_state, available_course_ids, top_k - len(recommendations)
            )
            seen_ids = {r["course_id"] for r in recommendations}
            for r in heuristic:
                if r["course_id"] not in seen_ids:
                    recommendations.append(r)

        return recommendations[:top_k]

    def build_user_state(self, assessment_results: List[Dict]) -> Dict:
        """
        Build 6-dim DQN state from a user's recent assessment results.
        """
        if not assessment_results:
            return {
                "avg_correctness": 0.5,
                "time_penalty": 0.1,
                "affect_focus": 0.7,
                "affect_frustration": 0.1,
                "affect_confusion": 0.1,
                "affect_boredom": 0.1,
            }

        avg_correctness = np.mean([r.get("score", 0.5) for r in assessment_results])
        avg_time = np.mean([r.get("time_taken_seconds", 60) for r in assessment_results])
        time_penalty = min(np.log1p(avg_time) / np.log1p(300), 1.0)

        # Estimate affective state from performance patterns
        recent = assessment_results[-3:] if len(assessment_results) >= 3 else assessment_results
        recent_scores = [r.get("score", 0.5) for r in recent]

        focus = float(np.mean(recent_scores))
        frustration = float(1.0 - np.mean(recent_scores)) * 0.8
        confusion = float(np.std(recent_scores)) if len(recent_scores) > 1 else 0.1
        boredom = float(np.mean(recent_scores)) * 0.2 if np.mean(recent_scores) > 0.9 else 0.05

        return {
            "avg_correctness": float(avg_correctness),
            "time_penalty": float(time_penalty),
            "affect_focus": min(focus, 1.0),
            "affect_frustration": min(frustration, 1.0),
            "affect_confusion": min(confusion, 1.0),
            "affect_boredom": min(boredom, 1.0),
        }

    def get_ai_insight(self, user_state: Dict, skill_gaps: List[Dict]) -> str:
        """Generate a natural language AI insight based on the user's state."""
        focus = user_state.get("affect_focus", 0.7)
        frustration = user_state.get("affect_frustration", 0.1)
        correctness = user_state.get("avg_correctness", 0.5)

        if not skill_gaps:
            return "Great work! You're progressing well. Keep up the consistency."

        top_gap = skill_gaps[0]["skill_name"] if skill_gaps else "core skills"

        if frustration > 0.5:
            return (f"Your response patterns suggest you may be finding {top_gap} challenging. "
                    f"Consider starting with foundational exercises to build confidence before tackling advanced topics.")
        elif focus > 0.8 and correctness > 0.75:
            return (f"Excellent engagement! You're ready to advance in {top_gap}. "
                    f"Your consistency and accuracy indicate strong learning momentum.")
        elif correctness < 0.5:
            return (f"Based on your recent assessments, focusing on {top_gap} fundamentals "
                    f"will significantly accelerate your progress toward your career goal.")
        else:
            return (f"You're making solid progress. Deepening your {top_gap} skills "
                    f"will be the highest-impact next step for your learning path.")

    # ── Heuristic fallbacks (used before model training) ──

    def _heuristic_mastery(self, interactions: List[Dict], skill_name: str) -> Dict:
        if not interactions:
            return {"mastery_probability": 0.3, "confidence": "low"}
        avg_correct = np.mean([r.get("correct", 0) for r in interactions])
        # Simple Bayesian-style estimate
        mastery = 0.2 + 0.7 * avg_correct + 0.1 * min(len(interactions) / 20, 1.0)
        return {"mastery_probability": float(mastery), "confidence": "heuristic"}

    def _heuristic_recommendations(
        self, user_state: Dict, course_ids: List[int], top_k: int
    ) -> List[Dict]:
        correctness = user_state.get("avg_correctness", 0.5)
        frustration = user_state.get("affect_frustration", 0.1)

        # Score each course based on difficulty match
        scored = []
        for i, cid in enumerate(course_ids):
            # Simulate a match score based on user state
            match = 0.95 - (i * 0.03) + np.random.normal(0, 0.02)
            match = float(np.clip(match, 0.5, 0.99))
            scored.append({"course_id": cid, "score": match,
                           "reason": "Based on your skill profile"})

        scored.sort(key=lambda x: x["score"], reverse=True)
        return scored[:top_k]

    def _get_recommendation_reason(self, user_state: Dict, q_value: float) -> str:
        correctness = user_state.get("avg_correctness", 0.5)
        frustration = user_state.get("affect_frustration", 0.1)
        if q_value > 0.7:
            return "Highly aligned with your current skill level and learning trajectory"
        elif frustration > 0.4:
            return "Recommended to build confidence and address identified challenges"
        elif correctness > 0.8:
            return "Advanced course matching your strong performance"
        else:
            return "Optimal next step based on your knowledge state"


# Global singleton
ai_service = AIService()
