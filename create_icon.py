from PIL import Image, ImageDraw
import math
import os

def create_bio_icon(size):
    # Create image with transparency
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background - dark purple/black gradient effect
    for y in range(size):
        r = int(10 + 5 * (y / size))
        g = 0
        b = int(20 + 10 * (y / size))
        draw.line([(0, y), (size, y)], fill=(r, g, b, 255))
    
    # Add grid pattern
    grid_color = (40, 0, 60, 80)
    grid_spacing = max(size // 10, 4)
    for i in range(0, size, grid_spacing):
        draw.line([(i, 0), (i, size)], fill=grid_color, width=1)
        draw.line([(0, i), (size, i)], fill=grid_color, width=1)
    
    center = size // 2
    
    # Outer glow rings
    for r in range(int(size * 0.46), int(size * 0.40), -1):
        alpha = int(50 * (1 - (r - size * 0.40) / (size * 0.06)))
        draw.ellipse([center - r, center - r, center + r, center + r], 
                     outline=(0, 255, 255, alpha), width=1)
    
    # Main hexagon background
    hex_size = int(size * 0.38)
    hex_points = []
    for i in range(6):
        angle = -math.pi / 2 + i * math.pi / 3
        x = center + hex_size * math.cos(angle)
        y = center + hex_size * math.sin(angle)
        hex_points.append((x, y))
    
    # Fill hexagon with dark color
    draw.polygon(hex_points, fill=(15, 0, 35, 255))
    
    # Hexagon border - cyan glow
    draw.polygon(hex_points, outline=(0, 255, 255, 255), width=max(2, size // 40))
    
    # Inner hexagon - pink
    inner_hex_size = int(size * 0.30)
    inner_hex_points = []
    for i in range(6):
        angle = -math.pi / 2 + i * math.pi / 3
        x = center + inner_hex_size * math.cos(angle)
        y = center + inner_hex_size * math.sin(angle)
        inner_hex_points.append((x, y))
    draw.polygon(inner_hex_points, outline=(255, 0, 255, 200), width=max(1, size // 60))
    
    # Bio hazard symbol
    bio_center_y = center + int(size * 0.02)
    
    # Center circle
    bio_radius = int(size * 0.07)
    draw.ellipse([center - bio_radius, bio_center_y - bio_radius, 
                  center + bio_radius, bio_center_y + bio_radius], 
                 fill=(57, 255, 20, 255))
    
    # Three bio hazard arcs/petals
    petal_dist = int(size * 0.12)
    petal_size = int(size * 0.09)
    
    for i in range(3):
        angle = -math.pi/2 + i * 2 * math.pi / 3
        px = center + petal_dist * math.cos(angle)
        py = bio_center_y + petal_dist * math.sin(angle)
        
        # Draw petal
        draw.ellipse([px - petal_size, py - petal_size * 0.6,
                      px + petal_size, py + petal_size * 0.6],
                     fill=(57, 255, 20, 220))
    
    # Inner ring of bio hazard
    inner_bio = int(size * 0.04)
    draw.ellipse([center - inner_bio, bio_center_y - inner_bio,
                  center + inner_bio, bio_center_y + inner_bio],
                 fill=(15, 0, 35, 255))
    
    # Glowing accent dots
    dot_radius = max(int(size * 0.025), 2)
    
    # Top left - cyan
    dx, dy = center - int(size * 0.25), center - int(size * 0.28)
    draw.ellipse([dx - dot_radius, dy - dot_radius, dx + dot_radius, dy + dot_radius],
                 fill=(0, 255, 255, 255))
    
    # Top right - pink
    dx, dy = center + int(size * 0.25), center - int(size * 0.28)
    draw.ellipse([dx - dot_radius, dy - dot_radius, dx + dot_radius, dy + dot_radius],
                 fill=(255, 0, 255, 255))
    
    # Bottom - green
    dx, dy = center, center + int(size * 0.32)
    draw.ellipse([dx - dot_radius, dy - dot_radius, dx + dot_radius, dy + dot_radius],
                 fill=(57, 255, 20, 255))
    
    # Corner brackets
    bracket_len = int(size * 0.12)
    bracket_width = max(2, size // 50)
    bracket_color = (0, 255, 255, 180)
    margin = int(size * 0.08)
    
    # Top-left
    draw.line([(margin, margin), (margin + bracket_len, margin)], fill=bracket_color, width=bracket_width)
    draw.line([(margin, margin), (margin, margin + bracket_len)], fill=bracket_color, width=bracket_width)
    
    # Top-right
    draw.line([(size - margin, margin), (size - margin - bracket_len, margin)], fill=bracket_color, width=bracket_width)
    draw.line([(size - margin, margin), (size - margin, margin + bracket_len)], fill=bracket_color, width=bracket_width)
    
    # Bottom-left
    draw.line([(margin, size - margin), (margin + bracket_len, size - margin)], fill=bracket_color, width=bracket_width)
    draw.line([(margin, size - margin), (margin, size - margin - bracket_len)], fill=bracket_color, width=bracket_width)
    
    # Bottom-right
    draw.line([(size - margin, size - margin), (size - margin - bracket_len, size - margin)], fill=bracket_color, width=bracket_width)
    draw.line([(size - margin, size - margin), (size - margin, size - margin - bracket_len)], fill=bracket_color, width=bracket_width)
    
    return img

# Generate icons for each density
densities = {
    'mdpi': 48,
    'hdpi': 72,
    'xhdpi': 96,
    'xxhdpi': 144,
    'xxxhdpi': 192
}

base_path = 'app/src/main/res'

for density, size in densities.items():
    folder = f'{base_path}/mipmap-{density}'
    os.makedirs(folder, exist_ok=True)
    
    icon = create_bio_icon(size)
    icon.save(f'{folder}/ic_launcher.png')
    
    # Create round version with circular mask
    round_icon = create_bio_icon(size)
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse([0, 0, size, size], fill=255)
    round_icon.putalpha(mask)
    round_icon.save(f'{folder}/ic_launcher_round.png')
    
    print(f'Created {density} icons ({size}x{size})')

print('All icons created successfully!')
