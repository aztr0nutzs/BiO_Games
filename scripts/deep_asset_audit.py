#!/usr/bin/env python3
import os
import re
import sys
from pathlib import Path

def find_files_with_extensions(root_dir, extensions):
    """Find all files with given extensions recursively."""
    files = []
    for ext in extensions:
        files.extend(Path(root_dir).rglob(f"*.{ext}"))
    return files

def extract_image_references(file_path):
    """Extract image file references from a file."""
    references = set()
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            # Find URLs or paths ending with .png, .gif, .webp
            # Match things like 'image.png', '/path/image.gif', 'url(image.webp)'
            patterns = [
                r'["\']([^"\']*\.(png|gif|webp))["\']',  # quoted
                r'url\(([^)]*\.(png|gif|webp))\)',  # css url()
                r'src=["\']([^"\']*\.(png|gif|webp))["\']',  # src attribute
            ]
            for pattern in patterns:
                matches = re.findall(pattern, content, re.IGNORECASE)
                for match in matches:
                    if isinstance(match, tuple):
                        ref = match[0]
                    else:
                        ref = match
                    # Normalize: remove leading ./ or ../ etc? But keep as is for now
                    references.add(ref)
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
    return references

def normalize_path(path, base_dir):
    """Normalize a path relative to base_dir."""
    # If absolute or starts with http, skip
    if path.startswith(('http', 'https', '//')):
        return None
    # Remove query params
    path = path.split('?')[0].split('#')[0]
    # If starts with /, it's absolute in assets
    if path.startswith('/'):
        return os.path.join(base_dir, path[1:])
    # Relative path
    return os.path.join(base_dir, path)

def main():
    assets_dir = "app/src/main/assets/www"
    if not os.path.exists(assets_dir):
        print(f"Assets directory {assets_dir} not found.")
        sys.exit(1)
    
    # Find all source files
    source_files = find_files_with_extensions(assets_dir, ['js', 'html', 'css', 'json'])
    
    # Collect all referenced images
    referenced_images = set()
    for src_file in source_files:
        refs = extract_image_references(str(src_file))
        for ref in refs:
            normalized = normalize_path(ref, assets_dir)
            if normalized:
                referenced_images.add(normalized)
    
    # Find all existing image files
    existing_images = set()
    image_files = find_files_with_extensions(assets_dir, ['png', 'gif', 'webp'])
    for img_file in image_files:
        existing_images.add(str(img_file))
    
    # Check for missing
    missing = referenced_images - existing_images
    
    # Check for duplicates (same basename in different dirs? or exact same path multiple refs)
    # For duplicates, perhaps count references
    ref_counts = {}
    for ref in referenced_images:
        ref_counts[ref] = ref_counts.get(ref, 0) + 1
    duplicates = {k: v for k, v in ref_counts.items() if v > 1}
    
    # Orphans: existing but not referenced
    orphans = existing_images - referenced_images
    
    # Output
    print("=== ASSET AUDIT RESULTS ===")
    print(f"Source files scanned: {len(source_files)}")
    print(f"Referenced images: {len(referenced_images)}")
    print(f"Existing images: {len(existing_images)}")
    print()
    
    if missing:
        print("MISSING IMAGES:")
        for img in sorted(missing):
            print(f"  {img}")
        print()
    
    if duplicates:
        print("DUPLICATE REFERENCES:")
        for img, count in sorted(duplicates.items()):
            print(f"  {img} (referenced {count} times)")
        print()
    
    if orphans:
        print("ORPHAN IMAGES (exist but not referenced):")
        for img in sorted(orphans):
            print(f"  {img}")
        print()
    
    # Fail if any missing
    if missing:
        print("FAIL: Missing images found.")
        sys.exit(1)
    else:
        print("PASS: No missing images.")
    
    if duplicates:
        print("WARNING: Duplicate references found.")
    
    if orphans:
        print("INFO: Orphan images found.")

if __name__ == "__main__":
    main()
