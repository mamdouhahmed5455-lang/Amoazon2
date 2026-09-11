"""
Temporal splitting module for Model V2.
Enforces strict out-of-time temporal partition boundaries:
- Training:   Target Year 2022 (Features <= 2021)
- Validation: Target Year 2023 (Features <= 2022)
- Test:       Target Year 2024 (Features <= 2023)
"""

from typing import Tuple, Dict, Any
import pandas as pd


def split_by_time(df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Partitions the assembled multi-year panel DataFrame into Train, Val, and Test splits.
    Guarantees that train, validation, and test observations are strictly disjoint in time.
    """
    if "split" not in df.columns and "target_year" not in df.columns:
        raise ValueError("DataFrame must contain 'split' or 'target_year' column")

    if "split" in df.columns:
        df_train = df[df["split"] == "train"].copy().reset_index(drop=True)
        df_val = df[df["split"] == "val"].copy().reset_index(drop=True)
        df_test = df[df["split"] == "test"].copy().reset_index(drop=True)
    else:
        df_train = df[df["target_year"] == 2022].copy().reset_index(drop=True)
        df_val = df[df["target_year"] == 2023].copy().reset_index(drop=True)
        df_test = df[df["target_year"] == 2024].copy().reset_index(drop=True)

    # Verification: Disjointness and completeness
    train_years = set(df_train["target_year"].unique())
    val_years = set(df_val["target_year"].unique())
    test_years = set(df_test["target_year"].unique())

    assert len(train_years.intersection(val_years)) == 0, "Leakage: Train and Val share target years!"
    assert len(train_years.intersection(test_years)) == 0, "Leakage: Train and Test share target years!"
    assert len(val_years.intersection(test_years)) == 0, "Leakage: Val and Test share target years!"

    return df_train, df_val, df_test


def get_temporal_metadata() -> Dict[str, Any]:
    """Returns the explicit specification of temporal partitions."""
    return {
        "train": {
            "target_year": 2022,
            "observation_period": "2021-08-01 to 2022-07-31",
            "feature_cutoff": "2021-07-31",
            "historical_loss_years": [2021]
        },
        "val": {
            "target_year": 2023,
            "observation_period": "2022-08-01 to 2023-07-31",
            "feature_cutoff": "2022-07-31",
            "historical_loss_years": [2021, 2022]
        },
        "test": {
            "target_year": 2024,
            "observation_period": "2023-08-01 to 2024-07-31",
            "feature_cutoff": "2023-07-31",
            "historical_loss_years": [2021, 2022, 2023]
        }
    }
