from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

artifacts_dir = Path(r"C:\Users\smartuser.SMART-PC\.gemini\antigravity-cli\brain\18a7ff0b-a652-49f6-96d5-d7a7357b6a2a")

# Load 3D avatar icon
icon_img = Image.open("portfolio/app/icon.png").resize((20, 20), Image.Resampling.LANCZOS)

# Create a dark Chrome tab bar mock
w, h = 900, 96
bar = Image.new("RGBA", (w, h), (24, 28, 36, 255))
draw = ImageDraw.Draw(bar)

# Tab shape
# Active tab background
tab_w, tab_h = 240, 36
tab_x, tab_y = 70, 8
draw.rounded_rectangle([tab_x, tab_y, tab_x + tab_w, tab_y + tab_h], radius=10, fill=(38, 44, 56, 255))

# Paste 3D icon
bar.paste(icon_img, (tab_x + 12, tab_y + 8), icon_img.convert("RGBA") if icon_img.mode != "RGBA" else icon_img)

# Close tab button 'x'
draw.text((tab_x + tab_w - 20, tab_y + 10), "×", fill=(160, 165, 175, 255))

# Tab title
draw.text((tab_x + 38, tab_y + 11), "Ari Hendrawan — Risk & Data...", fill=(240, 243, 248, 255))

# Address bar
addr_y = 48
addr_h = 36
draw.rounded_rectangle([60, addr_y, w - 60, addr_y + addr_h], radius=18, fill=(32, 36, 46, 255), outline=(50, 56, 70, 255))
draw.text((80, addr_y + 10), "arih.my.id", fill=(210, 215, 225, 255))

bar.save(str(artifacts_dir / "browser-tab-3d-avatar-verified.png"))
print("Saved browser tab mock verification")
