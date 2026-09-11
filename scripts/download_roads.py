import urllib.request
import urllib.parse
import json
import pathlib

out_dir = pathlib.Path('data/external/roads')
out_dir.mkdir(parents=True, exist_ok=True)
out_file = out_dir / 'rondonia_federal_highways.json'

# Federal highways (BR-364, BR-421, BR-429, etc.) within Rondônia bbox
# Bounding box: south, west, north, east = -13.7, -66.8, -7.9, -59.8
query = """[out:json][timeout:25];
(
  way["highway"~"trunk|primary|secondary"](-13.7,-66.8,-7.9,-59.8);
);
out geom qt 1000;"""
url = "https://overpass-api.de/api/interpreter?data=" + urllib.parse.quote(query)
req = urllib.request.Request(url, headers={"User-Agent": "GeoAI-Research-Client/1.0"})

print("Downloading Rondônia highway network...")
try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read()
        out_file.write_bytes(data)
        print(f"Road network saved to {out_file}! Size: {len(data)} bytes")
except Exception as e:
    print("Error:", e)
