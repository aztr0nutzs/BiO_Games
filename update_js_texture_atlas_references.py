#!/usr/bin/env python3

import os
import json
import re

# Load the texture atlas JSON maps
with open("chips_atlas.json", "r") as f:
    chips_atlas = json.load(f)

with open("symbols_atlas.json", "r") as f:
    symbols_atlas = json.load(f)

# Function to find the position and size of an image in the atlas
def find_image_in_atlas(atlas, image_name):
    for entry in atlas:
        if entry["name"] == image_name:
            return entry
    return None

# Function to update JavaScript files to use the texture atlases
def update_js_file(file_path):
    with open(file_path, "r") as f:
        content = f.read()
    
    # Replace references to individual chip images
    for chip in chips_atlas:
        image_name = chip["name"]
        # Replace references in JavaScript (file: "assets/.../image.png")
        content = re.sub(
            rf'file:\s*["\']assets/{{0,1}}{re.escape(image_name)}["\']',
            f'file: "chips_atlas.png", x: {chip["x"]}, y: {chip["y"]}, width: {chip["width"]}, height: {chip["height"]}',
            content
        )
    
    # Replace references to individual symbol images
    for symbol in symbols_atlas:
        image_name = symbol["name"]
        # Replace references in JavaScript (file: "assets/.../image.png")
        content = re.sub(
            rf'file:\s*["\']assets/{{0,1}}{re.escape(image_name)}["\']',
            f'file: "symbols_atlas.png", x: {symbol["x"]}, y: {symbol["y"]}, width: {symbol["width"]}, height: {symbol["height"]}',
            content
        )
    
    with open(file_path, "w") as f:
        f.write(content)

# Update the JavaScript files
js_files = [
    "app/build/intermediates/assets/debug/mergeDebugAssets/www/bio_petz/data/specimens.js",
    "app/build/intermediates/assets/debug/mergeDebugAssets/www/bio_petz/bio_petz_game.js",
    "app/build/intermediates/assets/debug/mergeDebugAssets/www/bio_slotz/BiO-Slotz_web_v1.1/game.js"
]

for js_file in js_files:
    if os.path.exists(js_file):
        update_js_file(js_file)
        print(f"Updated {js_file}")
    else:
        print(f"File not found: {js_file}")