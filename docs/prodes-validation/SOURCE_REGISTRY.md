# Authoritative Source Registry: INPE / TerraBrasilis PRODES

> **Registry Standard**: Scientific Provenance & Authoritative Source Ledger  
> **Source Institution**: Instituto Nacional de Pesquisas Espaciais (INPE)  
> **Platform**: TerraBrasilis Spatial Data Infrastructure (SDI)

---

## 1. Primary Ground-Truth Source Ledger

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ PRIMARY GROUND-TRUTH SPECIFICATION                                                    │
├──────────────────────┬─────────────────────────────────────────────────────────────────┤
│ Institution          │ Instituto Nacional de Pesquisas Espaciais (INPE)                │
│ Program              │ PRODES (Programa de Monitoramento da Floresta Amazônica)        │
│ Product Name         │ Yearly Deforestation in the Legal Amazon (Desmatamento Anual)   │
│ Service Endpoint     │ http://terrabrasilis.dpi.inpe.br/geoserver/wfs                  │
│ Layer Name           │ prodes-legal-amz:yearly_deforestation                           │
│ Standard Protocol    │ OGC WFS 2.0.0 (Web Feature Service)                             │
│ Native Format        │ GeoJSON (application/json) / Shapefile                         │
│ Native CRS           │ EPSG:4674 (SIRGAS 2000 / Geodetic Datum of Brazil)              │
│ Target Geometry      │ MultiPolygon                                                    │
│ Minimum Mapping Unit │ >= 6.25 hectares (0.0625 km²)                                   │
│ Satellite Sensors    │ Landsat 8/9 OLI, Sentinel-2 MSI, CBERS-4/4A WFI                 │
│ Access Date          │ 2026-09-07                                                      │
│ Licensing & Rights   │ Public Domain / Creative Commons (Brazilian Open Data Mandate)  │
└──────────────────────┴─────────────────────────────────────────────────────────────────┘
```

---

## 2. Acquired Data Products for Rondônia Pilot Validation

| Product ID | Layer / Filter | Temporal Period | Feature Count (RO) | File Size & SHA-256 Checksum | Audit Status |
| :--- | :--- | :---: | :---: | :--- | :---: |
| **PRODES-RO-2024** | `state='RO' AND year=2024` | 2024 PRODES (Aug 2023–Jul 2024) | **2,773 polygons** | `5,791,181 bytes`<br>`aca4f29791332b27edbee9993f3cedb744cbf609241788b88cf4aacb8982443c` | **VERIFIED & DOWNLOADED** |
| **PRODES-RO-2023** | `state='RO' AND year=2023` | 2023 PRODES (Aug 2022–Jul 2023) | **5,055 polygons** | `5,959,016 bytes`<br>`fc35febac4a31b7b4d6a4e9fa9d8e637fb63a3e4d4873305e1011e8079eeca3a` | **VERIFIED & DOWNLOADED** |

---

## 3. Official Provenance & Authority Citation

- **Authoritative Citation**:  
  *INPE (Instituto Nacional de Pesquisas Espaciais). (2024). Metodologia para o Cálculo da Taxa Anual de Desmatamento na Amazônia Legal (PRODES). Coordenação-Geral de Observação da Terra (CGOBT), São José dos Campos, SP, Brasil.*
- **System Authority**:  
  PRODES is the official sovereign baseline used by the Ministry of the Environment and Climate Change (MMA), IBAMA, and Brazil's Nationally Determined Contributions (NDC) under the UNFCCC.
- **Deforestation Definition**:  
  PRODES exclusively maps **anthropic clear-cutting (*corte raso*)** of primary rainforest canopy ($\ge 6.25\text{ ha}$). Selective logging and secondary regrowth fluctuations are strictly excluded from this layer.
