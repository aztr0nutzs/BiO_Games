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

# Function to update HTML files to use the texture atlases
def update_html_file(file_path):
    with open(file_path, "r") as f:
        content = f.read()
    
    # Replace references to individual chip images
    for chip in chips_atlas:
        image_name = chip["name"]
        # Replace references in CSS (background: url(...))
        content = re.sub(
            rf'background:\s*url\(\s*["\']?assets/{{0,1}}{re.escape(image_name)}["\']?\s*\)',
            f'background: url(chips_atlas.png) {chip["x"]}px {chip["y"]}px / {chip["width"]}px {chip["height"]}px no-repeat',
            content
        )
        # Replace references in HTML (src="...")
        content = re.sub(
            rf'src="assets/{{0,1}}{re.escape(image_name)}"',
            f'src="chips_atlas.png" style="background-position: {-chip["x"]}px {-chip["y"]}px; width: {chip["width"]}px; height: {chip["height"]}px;"',
            content
        )
    
    # Replace references to individual symbol images
    for symbol in symbols_atlas:
        image_name = symbol["name"]
        # Replace references in CSS (background: url(...))
        content = re.sub(
            rf'background:\s*url\(\s*["\']?assets/{{0,1}}{re.escape(image_name)}["\']?\s*\)',
            f'background: url(symbols_atlas.png) {symbol["x"]}px {symbol["y"]}px / {symbol["width"]}px {symbol["height"]}px no-repeat',
            content
        )
        # Replace references in HTML (src="...")
        content = re.sub(
            rf'src="assets/{{0,1}}{re.escape(image_name)}"',
            f'src="symbols_atlas.png" style="background-position: {-symbol["x"]}px {-symbol["y"]}px; width: {symbol["width"]}px; height: {symbol["height"]}px;"',
            content
        )
    
    with open(file_path, "w") as f:
        f.write(content)

# Update the HTML files
html_files = [
    "app/build/intermediates/assets/debug/mergeDebugAssets/www/bio_lobby3.html",
    "app/build/intermediates/assets/debug/mergeDebugAssets/www/bio_wheel/wheel_game.html",
    "app/build/intermediates/assets/debug/mergeDebugAssets/www/knxt4/chips_menu.html"
]

for html_file in html_files:
    if os.path.exists(html_file):
        update_html_file(html_file)
        print(f"Updated {html_file}")
    else:
        print(f"File not found: {html_file}")