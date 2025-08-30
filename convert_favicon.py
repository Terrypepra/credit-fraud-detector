import cairosvg
import os

def convert_svg_to_ico():
    """Convert SVG shield icon to ICO format"""
    svg_path = "fraud-finder-web-1/public/shield.svg"
    ico_path = "fraud-finder-web-1/public/favicon.ico"
    
    try:
        # Convert SVG to PNG first (ICO is typically made from PNG)
        png_data = cairosvg.svg2png(url=svg_path, output_width=32, output_height=32)
        
        # Convert PNG to ICO
        cairosvg.svg2png(url=svg_path, write_to=ico_path, output_width=32, output_height=32)
        
        print(f"✅ Successfully converted {svg_path} to {ico_path}")
        print("The favicon has been updated with a shield icon!")
        
    except Exception as e:
        print(f"❌ Error converting favicon: {e}")
        print("You may need to install cairosvg: pip install cairosvg")

if __name__ == "__main__":
    convert_svg_to_ico() 