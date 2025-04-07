from PIL import Image, ImageFont, ImageDraw
from staticmap import StaticMap, CircleMarker
import textwrap

import textwrap
def edit_img(
    img: Image.Image,
    description: str,
    longitude : float,
    latitude: float,
    text_color = (255,255,255),
    bg_color = (0,0,0),
    padding = 20,
    line_spacing = 5,
    max_width_ratio = 0.8,
    font = "../assets/font.ttf"
):
    #Set variables depending on img Entry
    draw = ImageDraw.Draw(img)
    img_width, img_height = img.size
    
    max_text_width = img(img_width*max_width_ratio)
    
    #Format font size depending on img width
    font_size = int(round(img_width/36))
    font_formatted = ImageFont.truetype(font, font_size)
    
    #Wrap text based on avg width
    avg_character_width = font_formatted.getlength("A")
    apprx_characters_per_line = max_text_width // avg_character_width
    lines = textwrap.wrap(description, width=int(apprx_characters_per_line))
    
    #Set Block height to prepare description draw onto img
    line_height = draw.textbbox((0,0), "A", font=font_formatted)[3]
    block_height = len(lines) * (line_height+line_spacing) - line_spacing
    
    #Start drawing image with text from bottom right corner
    y = img_height - block_height - padding
    for line in lines:
        line_width = draw.textbbox((0,0), line, font=font_formatted)[2]
        x = img_width - line_width - padding
        
        #Draw background for text to be visible in any image
        draw.rectangle([x-5, y, x+line_width+5, y+line_height+3], fill=bg_color)
        
        #Draw text on top of background
        draw.text((x,y), line, font=font_formatted, fill=text_color)
        y+=line_height+line_spacing
    
    #Map generation based on longitude and latitude entries
    map_size = int(round(img_width/4))
    map = StaticMap(map_size, map_size)
    marker = CircleMarker((longitude, latitude), "red", 20)
    map.add_marker(marker)
    map_img=map.render()
    map_img_rendered=Image.frombytes('RGB', map_img.size, map_img.tobytes())
    
    #Paste into original img
    map_width, map_height = map_img_rendered.size
    
    mx=padding
    my=img_height - map_height - padding
    
        
    img.paste(map_img_rendered, (mx, my))
    
    return img