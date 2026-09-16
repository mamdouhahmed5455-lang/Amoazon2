[ARCHIVAL DOCUMENT]
This document reflects an earlier project stage and may contain terminology or methodological descriptions that were superseded by the current GeoAI Deforestation Risk Intelligence Platform documentation.
For the current scientific scope, metrics, and limitations, see:
docs/submission/GeoAI_Competition_Submission
docs/submission/GeoAI_Technical_Evidence
docs/model-v2/

# Amazon Risk Project

This repository contains the GeoAI Deforestation Risk Prediction Framework for the Amazon Basin.

## Structure
Amazon_Risk_Project
│
├ index.html                 # Interactive 3D web application
├ data/forest_data_clean.json     # Spatial dataset (150,000 points)
├ scripts/risk_stats.py      # Validation and metrics computation helper
├ assets/images/model_validation_results.png # 4-panel visual validation chart
└ docs/README.txt            # Project structure and metadata

## Abstract
The model predicts deforestation risk using spatial and environmental variables. It evaluates geographic and environmental features using an offline-trained XGBoost classification model, outputting precomputed spatial risk predictions across 150,000 cells in the Rondônia region.

## Key Metrics
- Final Accuracy: The model achieved an AUC score of 0.82, indicating strong predictive performance.
- Results: High-risk areas are mainly concentrated along road networks and agricultural expansion zones (specifically in Rondônia).

## Execution
Open `index.html` in any modern web browser to interact with the 3D GeoAI Risk Map.
