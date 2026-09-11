# Authoritative Source Registry: Validated XGBoost Model V2

> **Registry Standard**: Scientific Geodata Provenance Ledger  
> **Evaluation Date**: 2026-09-11  
> **Guiding Principle**: Use only authoritative, sovereign, or documented primary data sources.

---

## 1. Master Source Inventory

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ MODEL V2 AUTHORITATIVE SOURCE REGISTRY                                                                                                 │
├────┬──────────────┬────────────────────────┬───────────────────────────────────────────┬──────────────┬───────────┬────────────────────┤
│ ID │ Institution  │ Product Name           │ Direct URL / Access Point                 │ Vintage/Year │ Native CRS│ Purpose in Model V2│
├────┼──────────────┼────────────────────────┼───────────────────────────────────────────┼──────────────┼───────────┼────────────────────┤
│ S1 │ INPE         │ PRODES Yearly Deforest.│ terrabrasilis.dpi.inpe.br/geoserver/wfs   │ 2021         │ EPSG:4674 │ Prior Hist Loss    │
│ S2 │ INPE         │ PRODES Yearly Deforest.│ terrabrasilis.dpi.inpe.br/geoserver/wfs   │ 2022         │ EPSG:4674 │ Label/Prior Loss   │
│ S3 │ INPE         │ PRODES Yearly Deforest.│ terrabrasilis.dpi.inpe.br/geoserver/wfs   │ 2023         │ EPSG:4674 │ Label/Prior Loss   │
│ S4 │ INPE         │ PRODES Yearly Deforest.│ terrabrasilis.dpi.inpe.br/geoserver/wfs   │ 2024         │ EPSG:4674 │ Final Test Label   │
│ S5 │ IBGE / INPE  │ Sovereign State Bound. │ terrabrasilis.dpi.inpe.br                 │ Official     │ EPSG:4674 │ Territory Mask     │
│ S6 │ INPE         │ Non-Forest Formation   │ terrabrasilis.dpi.inpe.br                 │ Official     │ EPSG:4674 │ Forest Eligibility │
│ S7 │ OSM Contrib. │ Highway Network (Trunk/Pri)│ overpass-api.de/api/interpreter        │ Established  │ EPSG:4326 │ Road Proximity (A) │
│ S8 │ IBGE         │ 2022 Decennial Census  │ ibge.gov.br/estatisticas/sociais/populacao│ 2022         │ Tabular   │ Population Press(C)│
│ S9 │ IBGE         │ Municipalities Geocodes│ servicodados.ibge.gov.br/api/v1/localidade│ Official     │ EPSG:4674 │ Munic Centroids    │
│ S10│ ESA / NASA   │ Copernicus DEM GLO-90  │ api.open-meteo.com/v1/elevation           │ GLO-90       │ EPSG:4326 │ Physical Elev (D)  │
└────┴──────────────┴────────────────────────┴───────────────────────────────────────────┴──────────────┴───────────┴────────────────────┘
```

---

## 2. Cryptographic Checksum & Physical File Ledger

| Product | Local Path | Size (Bytes) | SHA-256 Checksum |
| :--- | :--- | :---: | :--- |
| **PRODES 2021** | `data/external/prodes/prodes_ro_2021.geojson` | 8,045,033 | `e170f0b4476127988bdfb65af9b6bd99923c98a1d7db64bf01876dd3e5259f18` |
| **PRODES 2022** | `data/external/prodes/prodes_ro_2022.geojson` | 8,330,650 | `7e39c218627e382a00515028a8551fdc2c8a2f17c818491dbaad2fed8f05b4a1` |
| **PRODES 2023** | `data/external/prodes/prodes_ro_2023.geojson` | 5,959,016 | `fc35febac4a31b7b4d6a4e9fa9d8e637fb63a3e4d4873305e1011e8079eeca3a` |
| **PRODES 2024** | `data/external/prodes/prodes_ro_2024.geojson` | 5,791,181 | `aca4f29791332b27edbee9993f3cedb744cbf609241788b88cf4aacb8982443c` |
| **Boundary** | `data/external/prodes-validation/rondonia_boundary.geojson` | 298,552 | `b51cab47423e306012f6229d68b1ab9a75ce40c873ff76c9333a1f35c77de4b7` |
| **No-Forest Mask** | `data/external/prodes-validation/rondonia_no_forest.geojson` | 8,008,892 | `ad5572bfa5b640c7c900c10aa2b585bac074d624812964269e1ad4ab6efe6790` |
| **Highways (OSM)** | `data/external/roads/rondonia_federal_highways.json` | 1,859,460 | `57ff44f23f82316466c74ba32222a85b868838519b0688249e8036c47af9053f` |
| **IBGE 2022 Pop** | `data/external/ibge/rondonia_ibge_2022_pop.json` | 6,671 | `ae902117cc495fc3f8251fb08ae88d626b75df41b40deb1167827558b415eee6` |
| **IBGE Municípios**| `data/external/ibge/rondonia_municipios.json` | 22,351 | `e13fccee96be6e7fa914532ec8f7710a7812b6edb04683c44e1c51a94418af3f` |
| **DEM Elevations** | `data/external/dem/rondonia_elevations.json` | 129,648 | `c473f2d1b6f14f37881c82487eb083d7c3141f10faee97be72a3ce9c6734918b` |

---

## 3. Institutional Citations

1. **INPE PRODES**:
   *Instituto Nacional de Pesquisas Espaciais (INPE). Coordenação-Geral de Observação da Terra (CGOBT). Programa de Monitoramento da Floresta Amazônica Brasileira por Satélite (PRODES). São José dos Campos, SP, Brasil.*
2. **OpenStreetMap Contributors**:
   *OpenStreetMap contributors. Rondônia Highway Network (trunk, primary, and secondary corridors including BR-364). Extracted via Overpass API. Open Database License (ODbL), 2024.*
3. **IBGE**:
   *Instituto Brasileiro de Geografia e Estatística (IBGE). Censo Demográfico 2022: População e Domicílios - Primeiros Resultados. Rio de Janeiro: IBGE, 2023.*
4. **Copernicus DEM**:
   *European Space Agency (ESA). Copernicus Digital Elevation Model (DEM) GLO-90 Global 90m resolution dataset. Distributed via Open-Meteo elevation API.*
