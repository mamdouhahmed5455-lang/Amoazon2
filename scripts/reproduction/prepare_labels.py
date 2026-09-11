"""
Target label verification and scientific guard module.
Audits ground truth availability and enforces the non-negotiable rule against fabricating pseudo-labels.
"""

import pandas as pd
from typing import Dict, Any, Optional


class TargetReconstructionBlockedException(Exception):
    """Raised when authentic ground-truth training labels cannot be recovered from repository data."""
    pass


def audit_target_labels(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Audits the input DataFrame for authentic ground-truth deforestation labels.
    
    Returns audit status:
    - VERIFIED: Authentic ground-truth binary labels exist.
    - NOT_RECOVERABLE: Ground truth is absent; only model predictions exist.
    """
    potential_label_cols = ["label", "target", "deforested", "loss", "is_deforested", "class"]
    found_cols = [c for c in potential_label_cols if c in df.columns]

    if not found_cols:
        return {
            "status": "NOT_RECOVERABLE",
            "has_authentic_labels": False,
            "blocked": True,
            "reason": (
                "The repository contains only precomputed model inference outputs "
                "(risk_score, risk_norm) in data/forest_data_clean.json. Ground-truth "
                "binary clear-cut labels (y in {0, 1}) are absent."
            ),
            "remediation_required": (
                "Acquire INPE PRODES deforestation vector shapefiles for Rondônia and "
                "perform spatial intersection against coordinate centroids."
            )
        }

    return {
        "status": "VERIFIED",
        "has_authentic_labels": True,
        "blocked": False,
        "label_column": found_cols[0]
    }


def get_ground_truth_labels(df: pd.DataFrame, allow_synthetic_test_fixture: bool = False) -> Optional[pd.Series]:
    """
    Retrieves ground truth labels if present.
    Enforces the halt directive if labels are absent, unless explicitly in testing fixture mode.
    """
    audit = audit_target_labels(df)
    
    if audit["blocked"]:
        if allow_synthetic_test_fixture:
            # Strictly for unit testing downstream software logic in tests/
            # Never presented as real project results.
            print("[TEST HARNESS ONLY] Generating synthetic fixture labels for pipeline code verification...")
            return (df["lat"] > -11.0).astype(int)
        
        raise TargetReconstructionBlockedException(audit["reason"])

    return df[audit["label_column"]]
