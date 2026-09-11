import urllib.request
import urllib.parse
import json
import sys

print("Testing Overpass API for Rondônia major highways...")
query = """[out:json][timeout:30];
area["ISO3166-2"="BR-RO"]->.a;
(
  way["highway"~"motorway|trunk|primary|secondary"](area.a);
);
out geom;"""
url = "https://overpass-api.de/api/interpreter?data=" + urllib.parse.quote(query)
req = urllib.request.Request(url, headers={"User-Agent": "GeoAI-Research-Client/1.0"})

try:
    with urllib.request.urlopen(req, timeout=40) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        elements = data.get("elements", [])
        print("Successfully queried Rondônia roads from Overpass/OSM! Count:", len(elements))
        if elements:
            print("First road element tags:", elements[0].get("tags"))
except Exception as e:
    print("Overpass API error:", e)
