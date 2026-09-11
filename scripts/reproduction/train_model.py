"""
Model training module for the independent XGBoost reproduction experiment.
Defines explicit hyperparameters and distinguishes verified settings from experimental assumptions.
"""

from typing import Dict, Any, Tuple
import xgboost as xgb
import pandas as pd
import numpy as np

from .config import EXPERIMENT_SEED


# Baseline XGBoost Hyperparameter Specification
DEFAULT_HYPERPARAMS = {
    # Verified algorithmic family from project documentation
    "objective": "binary:logistic",
    "eval_metric": "auc",
    
    # Explicit New Experiment Assumptions (Documented Baseline Defaults)
    "max_depth": 6,
    "learning_rate": 0.05,
    "n_estimators": 200,
    "subsample": 0.8,
    "colsample_bytree": 0.8,
    "random_state": EXPERIMENT_SEED,
    "tree_method": "hist"
}


def build_model(custom_params: Dict[str, Any] = None) -> xgb.XGBClassifier:
    """Builds an XGBoost classifier with explicit hyperparameter logging."""
    params = DEFAULT_HYPERPARAMS.copy()
    if custom_params:
        params.update(custom_params)
    return xgb.XGBClassifier(**params)


def train_reproduction_model(X_train: pd.DataFrame, y_train: pd.Series, 
                             X_val: pd.DataFrame = None, y_val: pd.Series = None,
                             params: Dict[str, Any] = None) -> Tuple[xgb.XGBClassifier, Dict[str, Any]]:
    """Trains the reconstructed model and logs training metadata."""
    model = build_model(params)
    
    eval_set = [(X_train, y_train)]
    if X_val is not None and y_val is not None:
        eval_set.append((X_val, y_val))

    model.fit(X_train, y_train, eval_set=eval_set, verbose=False)
    
    metadata = {
        "model_class": "xgboost.XGBClassifier",
        "xgboost_version": xgb.__version__,
        "hyperparameters": model.get_params(),
        "n_features_in": int(model.n_features_in_),
        "training_samples": len(X_train)
    }

    return model, metadata
