# Graduation Project Report
## AI-Based Deforestation Risk Prediction Model – Amazon Basin

### 1. Problem Statement (Deforestation)
The Amazon Basin faces significant threats from illegal logging, agricultural expansion, and intentionally set fires. This project proposes a spatial-temporal GeoAI model to predict areas at high risk of deforestation before it occurs.

### 2. Dataset
- **File:** `../data/forest_data_clean.json`
- **Volume:** 150,000 spatial datapoints
- **Features:** Latitude, Longitude, Risk Score, Normalized Risk, Extrusion Height (3D visualization height column, scaled to 0–4000 units), and Color mappings.

### 3. Methodology Framework
The proposed GeoAI framework integrates satellite data, deep learning segmentation, spatial risk modeling, and validation techniques to predict deforestation risk across the Amazon Basin.

```mermaid
graph TD
    A[Satellite Data] --> B(Feature Engineering)
    B --> C{Machine Learning Model}
    C --> D[Risk Prediction]
    D --> E[GeoJSON Output]
    E --> F[3D GeoAI Dashboard]
```
*(Also refer to `../assets/images/geoai_framework.png` for a high-level visual topology).*

### 4. Risk Prediction Model & Explainable AI (XAI)
The model computes a Risk Score based on environmental and anthropogenic variables. The UI reveals these drivers for absolute transparency (XAI):

- **Road proximity:** 41% impact (New infrastructure drives frontier expansion).
- **Previous forest loss:** 23% impact (Deforestation expands outward).
- **Population pressure:** 21% impact (Settlements increase demand).
- **Elevation Constraints:** 15% impact (Accessible terrain is prioritized in model feature weights).

*(Note: Feature contributions reflect offline research benchmarks derived from experimental Colab modeling and SHAP evaluation).*

**Analytical Risk Index Formulation (Global SHAP Synthesis) =**
`0.41 (Roads) + 0.23 (Loss Gap) + 0.21 (Population) + 0.15 (Elevation Constraints)`

### 5. 3D Spatial Visualization
An elite interactive 3D map (`forest_risk_3D_v2.html`) was developed to visualize the model's outputs using Deck.gl:
- **3D Risk Map:** Columns represent deforestation risk (Height = Risk Score).
- **Heatmap:** Highlights regions with high concentrations of risk.
- **Hotspots:** Pinpoints top critical danger zones.
- **Risk Distribution:**
  - High Risk: ~64%
  - Medium Risk: ~22%
  - Low Risk: ~14%

### 6. Spatial Analysis & Validation
The Python backend (`analysis.py`) performs rigorous validation to ensure academic credibility:
1. **Model Accuracy (AUC-ROC):** The model achieved an **AUC score of 0.82**, indicating strong and reliable predictive performance against random baselines.
2. **Confusion Matrix / Classification Metrics:** Precision and Recall metrics confirm the model correctly identifies high-risk frontiers without over-saturating stable protected areas.
3. **Spatial Hotspot Filtering:** Used to autonomously isolate and display high-risk deforestation hotspots via score thresholding.
4. **Fire Validation:** The predicted high-risk zones were overlaid with historical active fire data (NASA FIRMS). High correlation proved the model's accuracy.

*(See `../assets/images/model_validation_results.png` for the ROC Curve and diagnostic charts).*

### 7. Final Results & Conclusion
- The GeoAI Decision Support Dashboard allows interactive spatio-temporal tracking of deforestation risks (2020-2030).
- **High-risk areas** are mainly concentrated along road networks and agricultural expansion zones (specifically in southern and eastern Amazon, e.g., Rondônia).
- The integration of **Explainable AI** and **CSV/Report Export** tools transforms this project from a standard visualization into an operational spatial intelligence platform.
