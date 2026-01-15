#!/usr/bin/env python3

import os

# Function to parse the size report files
def parse_size_report(file_path):
    sizes = {}
    with open(file_path, "r") as f:
        for line in f:
            parts = line.strip().split("\t")
            if len(parts) >= 2:
                size = parts[0].strip()
                file_path = parts[1].strip()
                file_name = os.path.basename(file_path)
                sizes[file_name] = size
    return sizes

# Parse the before and after size reports
before_sizes = parse_size_report("asset_sizes_before.txt")
after_sizes = parse_size_report("asset_sizes_after.txt")

# Calculate the total sizes
def calculate_total_size(sizes):
    total_size = 0
    for size in sizes.values():
        if size.endswith("K"):
            total_size += float(size[:-1]) * 1024
        elif size.endswith("M"):
            total_size += float(size[:-1]) * 1024 * 1024
        elif size.endswith("G"):
            total_size += float(size[:-1]) * 1024 * 1024 * 1024
    return total_size

before_total = calculate_total_size(before_sizes)
after_total = calculate_total_size(after_sizes)

# Generate the size comparison report
report = []
report.append("=== ASSET SIZE COMPARISON REPORT ===")
report.append(f"\nTotal size before: {before_total / (1024 * 1024):.2f} MB")
report.append(f"Total size after: {after_total / (1024 * 1024):.2f} MB")
report.append(f"Size reduction: {((before_total - after_total) / before_total) * 100:.2f}%")

# Write the report to a file
with open("asset_size_report.txt", "w") as f:
    f.write("\n".join(report))

print("Size comparison report generated successfully.")