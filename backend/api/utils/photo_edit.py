import textwrap

from PIL import Image, ImageDraw, ImageFont
from staticmap import CircleMarker, StaticMap


def edit_img(
    img: Image.Image,
    description: str,
    longitude: float,
    latitude: float,
    text_color=(255, 255, 255),
    bg_color=(0, 0, 0),
    padding=20,
    line_spacing=5,
    max_width_ratio=0.8,
    font=None
):
    # Set variables depending on img Entry
    draw = ImageDraw.Draw(img)
    img_width, img_height = img.size
    
    max_text_width = int(img_width * max_width_ratio)
    
    # Format font size depending on img width
    font_size = int(round(img_width/36))
    
    # Try to load the specified font, fall back to default if not available
    try:
        if font:
            font_formatted = ImageFont.truetype(font, font_size)
        else:
            # Try to use a default font
            try:
                # Try DejaVu Sans (common on many systems)
                font_formatted = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", font_size)
            except:
                try:
                    # Try Arial (common on Windows)
                    font_formatted = ImageFont.truetype("arial.ttf", font_size)
                except:
                    # Last resort - use the default PIL font
                    font_formatted = ImageFont.load_default()
    except Exception as e:
        print(f"Font error: {e}, using default font")
        font_formatted = ImageFont.load_default()
    
    # Wrap text based on avg width
    try:
        avg_character_width = font_formatted.getlength("A")
    except AttributeError:
        # Older versions of PIL might use getsize instead
        avg_character_width = font_formatted.getsize("A")[0]
    
    apprx_characters_per_line = int(max_text_width // avg_character_width) or 40  # Fallback to 40 if calculation fails
    lines = textwrap.wrap(description, width=apprx_characters_per_line)
    
    # Set Block height to prepare description draw onto img
    try:
        line_height = draw.textbbox((0, 0), "A", font=font_formatted)[3]
    except AttributeError:
        # Older versions of PIL
        line_height = font_formatted.getsize("A")[1]
    
    block_height = len(lines) * (line_height + line_spacing) - line_spacing
    
    # Start drawing image with text from bottom right corner
    y = img_height - block_height - padding
    for line in lines:
        try:
            line_width = draw.textbbox((0, 0), line, font=font_formatted)[2]
        except AttributeError:
            line_width = font_formatted.getsize(line)[0]
        
        x = img_width - line_width - padding
        
        # Draw background for text to be visible in any image
        draw.rectangle([x-5, y, x+line_width+5, y+line_height+3], fill=bg_color)
        
        # Draw text on top of background
        draw.text((x, y), line, font=font_formatted, fill=text_color)
        y += line_height + line_spacing
    
    # Map generation based on longitude and latitude entries
    try:
        map_size = int(round(img_width/4))
        map_obj = StaticMap(map_size, map_size)
        marker = CircleMarker((longitude, latitude), "red", 20)
        map_obj.add_marker(marker)
        map_img = map_obj.render()
        map_img_rendered = Image.frombytes('RGB', map_img.size, map_img.tobytes())
        
        # Paste into original img
        map_width, map_height = map_img_rendered.size
        
        mx = padding
        my = img_height - map_height - padding
        
        img.paste(map_img_rendered, (mx, my))
    except Exception as e:
        print(f"Error generating map: {e}")
        # Continue without the map if there's an error
    
    return img