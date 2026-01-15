#!/usr/bin/env python3

import os
import json
from PIL import Image

# Define the directories containing the images to be combined into atlases
chip_dirs = [
    "app/build/intermediates/assets/debug/mergeDebugAssets/www/assets/chips",
    "app/build/intermediates/assets/debug/mergeDebugAssets/www/assets/knxt4_chips",
    "app/build/intermediates/assets/debug/mergeDebugAssets/www/knxt4/assets/chips",
    "app/build/intermediates/assets/debug/mergeDebugAssets/www/knxt4/assets/knxt4_chips"
]

symbol_dirs = [
    "app/build/intermediates/assets/debug/mergeDebugAssets/www/bio_slotz/BiO-Slotz_web_v1.1/assets/symbols",
    "app/build/intermediates/assets/debug/mergeDebugAssets/www/bio_slotz/BiO-Slotz_web_v1.1/assets/symbols_src_extra"
]

# Function to create a texture atlas from a list of image files
def create_texture_atlas(image_files, output_atlas_path, output_map_path):
    # Load all images and get their dimensions
    images = []
    for image_file in image_files:
        try:
            img = Image.open(image_file)
            images.append({"image": img, "path": image_file})
        except Exception as e:
            print(f"Error loading image {image_file}: {e}")
    
    if not images:
        print("No images to combine.")
        return
    
    # Sort images by size (largest first) to optimize packing
    images.sort(key=lambda x: x["image"].size[0] * x["image"].size[1], reverse=True)
    
    # Calculate the size of the atlas (simple approach: sum of widths and max height)
    atlas_width = sum(img["image"].size[0] for img in images)
    atlas_height = max(img["image"].size[1] for img in images)
    
    # Create a new blank image for the atlas
    atlas = Image.new("RGBA", (atlas_width, atlas_height), (0, 0, 0, 0))
    
    # Paste each image into the atlas
    x_offset = 0
    image_data = []
    for img_data in images:
        img = img_data["image"]
        img_path = img_data["path"]
        atlas.paste(img, (x_offset, 0))
        
        # Record the position and size of the image in the atlas
        image_data.append({
            "name": os.path.basename(img_path),
            "x": x_offset,
            "y": 0,
            "width": img.size[0],
            "height": img.size[1]
        })
        
        x_offset += img.size[0]
    
    # Save the atlas image
    atlas.save(output_atlas_path)
    print(f"Atlas saved to {output_atlas_path}")
    
    # Save the image map as a JSON file
    with open(output_map_path, "w") as f:
        json.dump(image_data, f, indent=4)
    print(f"Image map saved to {output_map_path}")

# Create texture atlases for chips and symbols
if __name__ == "__main__":
    # Collect all chip images
    chip_images = []
    for chip_dir in chip_dirs:
        if os.path.exists(chip_dir):
            for filename in os.listdir(chip_dir):
                if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                    chip_images.append(os.path.join(chip_dir, filename))
    
    if chip_images:
        create_texture_atlas(chip_images, "chips_atlas.png", "chips_atlas.json")
    
    # Collect all symbol images
    symbol_images = []
    for symbol_dir in symbol_dirs:
        if os.path.exists(symbol_dir):
            for filename in os.listdir(symbol_dir):
                if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                    symbol_images.append(os.path.join(symbol_dir, filename))
    
    if symbol_images:
        create_texture_atlas(symbol_images, "symbols_atlas.png", "symbols_atlas.json")