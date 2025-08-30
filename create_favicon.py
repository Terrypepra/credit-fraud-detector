from PIL import Image, ImageDraw
import os

def create_shield_favicon():
    """Create a shield favicon using PIL"""
    
    # Create a 32x32 image with transparent background
    img = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Shield colors (blue gradient)
    shield_outer = (30, 64, 175)  # Blue-600
    shield_middle = (59, 130, 246)  # Blue-500
    shield_inner = (96, 165, 250)  # Blue-400
    lock_color = (30, 64, 175)  # Blue-600
    white = (255, 255, 255)
    
    # Draw shield shape (simplified)
    # Outer shield
    shield_points = [
        (16, 2),   # Top point
        (28, 8),   # Top right
        (28, 16),  # Right middle
        (24, 24),  # Right bottom
        (16, 28),  # Bottom point
        (8, 24),   # Left bottom
        (4, 16),   # Left middle
        (8, 8),    # Top left
    ]
    draw.polygon(shield_points, fill=shield_outer)
    
    # Inner shield (smaller)
    inner_points = [
        (16, 4),   # Top point
        (24, 8),   # Top right
        (24, 16),  # Right middle
        (20, 22),  # Right bottom
        (16, 24),  # Bottom point
        (12, 22),  # Left bottom
        (8, 16),   # Left middle
        (12, 8),   # Top left
    ]
    draw.polygon(inner_points, fill=shield_middle)
    
    # Innermost shield (highlight)
    highlight_points = [
        (16, 6),   # Top point
        (22, 9),   # Top right
        (22, 16),  # Right middle
        (19, 20),  # Right bottom
        (16, 22),  # Bottom point
        (13, 20),  # Left bottom
        (10, 16),  # Left middle
        (13, 9),   # Top left
    ]
    draw.polygon(highlight_points, fill=shield_inner)
    
    # Draw lock inside shield
    # Lock body
    draw.rectangle([13, 12, 19, 20], fill=lock_color)
    # Lock top (circle)
    draw.ellipse([14, 8, 18, 12], fill=lock_color)
    # Lock keyhole
    draw.rectangle([15, 14, 17, 18], fill=white)
    draw.ellipse([15.5, 15.5, 16.5, 16.5], fill=lock_color)
    
    # Save as ICO
    ico_path = "fraud-finder-web-1/public/favicon.ico"
    img.save(ico_path, format='ICO', sizes=[(32, 32)])
    
    print(f"✅ Successfully created shield favicon at {ico_path}")
    print("The favicon now represents cybersecurity and fraud protection!")

if __name__ == "__main__":
    create_shield_favicon() 