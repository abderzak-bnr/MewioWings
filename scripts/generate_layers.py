import math
import random
import os
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

os.makedirs('public/assets/layers', exist_ok=True)

SIZE = 1024
CENTER = (512, 512)

# Wing anchor positions and orientations (x, y, length, width, angle_deg, is_drummette)
CORE_WINGS_6 = [
    (512, 530, 190, 110, -15, True),
    (430, 440, 180, 100, 35, False),
    (600, 430, 185, 105, -40, True),
    (400, 580, 175, 95, -25, False),
    (620, 580, 180, 100, 45, True),
    (515, 380, 170, 95, 10, False),
]

EXTRA_WINGS_12 = CORE_WINGS_6 + [
    (330, 500, 170, 95, 60, True),
    (690, 490, 175, 100, -55, False),
    (460, 650, 180, 100, 15, True),
    (580, 660, 175, 95, -20, False),
    (470, 470, 160, 90, -10, True), # Piled top
    (560, 480, 165, 95, 20, False), # Piled top
]

EXTRA_WINGS_24 = EXTRA_WINGS_12 + [
    (310, 410, 160, 90, 45, False),
    (710, 400, 165, 90, -35, True),
    (360, 630, 160, 90, -45, True),
    (660, 640, 165, 95, 40, False),
    (410, 340, 160, 85, 20, True),
    (620, 330, 160, 90, -25, False),
    (512, 290, 155, 85, 5, True),
    (512, 690, 165, 90, -5, False),
    (440, 540, 150, 85, 15, True),  # Mountain center
    (580, 530, 155, 85, -20, False), # Mountain center
    (510, 440, 150, 80, 30, True),  # Mountain summit
    (525, 490, 145, 80, -15, False), # Mountain summit
]

def draw_plate(draw, count):
    # Plate dimensions (45-degree isometric perspective ellipse)
    cx, cy = 512, 530
    rx = 430 if count <= 12 else 460
    ry = 320 if count <= 12 else 350
    
    # Outer plate cast shadow on table
    for i in range(25, 0, -1):
        alpha = int(90 * (1 - i / 25))
        draw.ellipse([cx - rx - i, cy - ry - i + 25, cx + rx + i, cy + ry + i + 45], 
                     fill=(0, 0, 0, alpha))
        
    # Plate rim (Charcoal ceramic / cast iron skillet style with warm rim highlight)
    draw.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=(28, 28, 33, 255))
    
    # Rim bevel highlight
    draw.ellipse([cx - rx + 6, cy - ry + 4, cx + rx - 6, cy + ry - 4], fill=(42, 42, 48, 255))
    draw.ellipse([cx - rx + 14, cy - ry + 12, cx + rx - 14, cy + ry - 10], fill=(24, 24, 28, 255))
    
    # Inner basin
    inner_rx = rx - 35
    inner_ry = ry - 28
    draw.ellipse([cx - inner_rx, cy - inner_ry, cx + inner_rx, cy + inner_ry], fill=(18, 18, 22, 255))
    
    # Inner subtle food liner / parchment paper (street food craft paper texture)
    paper_rx = inner_rx - 15
    paper_ry = inner_ry - 12
    draw.ellipse([cx - paper_rx, cy - paper_ry, cx + paper_rx, cy + paper_ry], fill=(32, 30, 28, 255))
    
    # Paper grid checkered faint lines (fast-casual wings basket liner)
    for step in range(-paper_rx, paper_rx, 24):
        draw.line([cx + step, cy - paper_ry + 10, cx + step + 40, cy + paper_ry - 10], fill=(45, 42, 38, 70), width=1)
        draw.line([cx + step, cy + paper_ry - 10, cx + step + 40, cy - paper_ry + 10], fill=(45, 42, 38, 70), width=1)

def draw_wing(draw, x, y, length, width, angle, is_drummette):
    # Draw a plump, crispy golden-brown fried wing piece
    rad = math.radians(angle)
    cos_a, sin_a = math.cos(rad), math.sin(rad)
    
    # Shadow under this specific wing
    sx, sy = x + 10, y + 15
    shadow_img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow_img)
    sdraw.ellipse([sx - length//2 - 10, sy - width//2 - 5, sx + length//2 + 10, sy + width//2 + 5], fill=(0, 0, 0, 110))
    shadow_img = shadow_img.rotate(-angle, center=(sx, sy))
    
    # Wing body: Crisp golden-brown gradient
    base_color = (217, 130, 43, 255) # Deep golden
    dark_crust = (168, 86, 20, 255) # Crispy fried edge
    highlight_color = (245, 175, 75, 255) # Golden highlight
    
    # Create wing isolated image for clean rotation
    w_img = Image.new('RGBA', (length + 60, width + 60), (0, 0, 0, 0))
    w_draw = ImageDraw.Draw(w_img)
    wcx, wcy = (length + 60) // 2, (width + 60) // 2
    
    if is_drummette:
        # Drummette: Thicker rounded head on one side, tapered bone on other
        # Base shadow edge
        w_draw.polygon([
            (wcx - length//2, wcy - width//3),
            (wcx - length//4, wcy - width//2),
            (wcx + length//3, wcy - width//2 + 5),
            (wcx + length//2, wcy),
            (wcx + length//3, wcy + width//2 - 5),
            (wcx - length//4, wcy + width//2),
            (wcx - length//2, wcy + width//3),
        ], fill=dark_crust)
        
        # Meat bulk
        w_draw.polygon([
            (wcx - length//2 + 6, wcy - width//3 + 4),
            (wcx - length//4 + 4, wcy - width//2 + 6),
            (wcx + length//3 - 4, wcy - width//2 + 10),
            (wcx + length//2 - 6, wcy),
            (wcx + length//3 - 4, wcy + width//2 - 10),
            (wcx - length//4 + 4, wcy + width//2 - 6),
            (wcx - length//2 + 6, wcy + width//3 - 4),
        ], fill=base_color)
        
        # Golden crunchy ridge highlight
        w_draw.ellipse([wcx - length//3, wcy - width//3, wcx + length//4, wcy + width//4], fill=highlight_color)
        
        # Crunchy bumps & crispy breading texture
        random.seed(int(x + y))
        for _ in range(45):
            bx = random.randint(wcx - length//2 + 15, wcx + length//3)
            by = random.randint(wcy - width//3, wcy + width//3)
            br = random.randint(3, 7)
            bcol = random.choice([(180, 95, 25, 220), (250, 190, 90, 230), (140, 70, 15, 200), (255, 215, 120, 240)])
            w_draw.ellipse([bx - br, by - br, bx + br, by + br], fill=bcol)
            
        # Bone tip at end
        w_draw.ellipse([wcx + length//2 - 14, wcy - 8, wcx + length//2 + 4, wcy + 8], fill=(235, 225, 210, 255))
    else:
        # Flat / Wingette: Oval with two distinct bone ridges
        w_draw.ellipse([wcx - length//2, wcy - width//2, wcx + length//2, wcy + width//2], fill=dark_crust)
        w_draw.ellipse([wcx - length//2 + 6, wcy - width//2 + 5, wcx + length//2 - 6, wcy + width//2 - 5], fill=base_color)
        
        # Two meat lobes
        w_draw.ellipse([wcx - length//2 + 10, wcy - width//2 + 8, wcx + length//2 - 10, wcy], fill=highlight_color)
        w_draw.ellipse([wcx - length//2 + 15, wcy + 2, wcx + length//2 - 15, wcy + width//2 - 8], fill=(225, 140, 50, 255))
        
        # Crunch flecks
        random.seed(int(x * y))
        for _ in range(40):
            bx = random.randint(wcx - length//2 + 15, wcx + length//2 - 15)
            by = random.randint(wcy - width//2 + 10, wcy + width//2 - 10)
            br = random.randint(3, 6)
            bcol = random.choice([(170, 80, 20, 220), (255, 195, 95, 240), (130, 60, 15, 210)])
            w_draw.ellipse([bx - br, by - br, bx + br, by + br], fill=bcol)

    # Soft blur on edges for realistic photo composite blending
    w_rotated = w_img.rotate(-angle, expand=True, resample=Image.Resampling.BILINEAR)
    rw, rh = w_rotated.size
    
    return w_rotated, x - rw//2, y - rh//2

def generate_base_wings(wings_list, filename):
    img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 1. Plate
    draw_plate(draw, len(wings_list))
    
    # 2. Celery sticks & dip bowl garnish on the edge of the plate
    # Dip ramekin
    rx, ry = 220, 390
    draw.ellipse([rx - 45, ry - 32, rx + 45, ry + 32], fill=(0, 0, 0, 90)) # Shadow
    draw.ellipse([rx - 40, ry - 30, rx + 40, ry + 30], fill=(240, 240, 245, 255)) # Ceramic white cup
    draw.ellipse([rx - 32, ry - 24, rx + 32, ry + 24], fill=(245, 245, 240, 255)) # Ranch dip
    draw.ellipse([rx - 25, ry - 18, rx + 25, ry + 18], fill=(255, 255, 250, 255))
    # Celery stick
    draw.polygon([(260, 340), (330, 310), (336, 324), (266, 354)], fill=(101, 163, 13, 255))
    draw.polygon([(250, 355), (320, 325), (325, 338), (255, 368)], fill=(132, 204, 22, 255))
    
    # 3. Wings
    for w in wings_list:
        x, y, length, width, angle, is_drummette = w
        w_img, px, py = draw_wing(draw, x, y, length, width, angle, is_drummette)
        img.paste(w_img, (px, py), w_img)
        
    img.save(filename, 'PNG')
    print(f"Generated {filename}")

def generate_sauce_layer(wings_list, sauce_id, color_base, color_highlight, color_drip, filename):
    # Transparent PNG overlay containing ONLY the sauce texture, drips, and gloss over the wings
    img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    for w in wings_list:
        x, y, length, width, angle, is_drummette = w
        
        # Sauce layer on this wing
        s_img = Image.new('RGBA', (length + 60, width + 60), (0, 0, 0, 0))
        s_draw = ImageDraw.Draw(s_img)
        wcx, wcy = (length + 60) // 2, (width + 60) // 2
        
        # Sauce coat covering the wing surface
        sw = int(width * 0.85)
        sl = int(length * 0.85)
        
        # Base thick glaze
        s_draw.ellipse([wcx - sl//2, wcy - sw//2, wcx + sl//2, wcy + sw//2], fill=color_base)
        
        # Drips along the edges
        random.seed(int(x + y + hash(sauce_id) % 1000))
        for i in range(4):
            dx = wcx + random.randint(-sl//3, sl//3)
            dy = wcy + random.choice([-sw//2, sw//2])
            dr = random.randint(8, 16)
            s_draw.ellipse([dx - dr, dy - dr//2, dx + dr, dy + dr], fill=color_drip)
            
        # Top specular gloss highlight (curved reflection for wet sauce look)
        gx = wcx - sl//4
        gy = wcy - sw//4
        gw = sl//2
        gh = sw//3
        s_draw.ellipse([gx, gy, gx + gw, gy + gh], fill=color_highlight)
        
        # Intense specular sheen dot
        s_draw.ellipse([gx + 15, gy + 3, gx + 35, gy + 12], fill=(255, 255, 255, 180))
        s_draw.ellipse([gx + 45, gy + 6, gx + 55, gy + 13], fill=(255, 255, 255, 140))
        
        # Rotate to match wing
        s_rotated = s_img.rotate(-angle, expand=True, resample=Image.Resampling.BILINEAR)
        rw, rh = s_rotated.size
        img.paste(s_rotated, (x - rw//2, y - rh//2), s_rotated)
        
    # Additional appetizing pooling sauce drips on plate around bottom wings
    for px, py in [(430, 680), (512, 700), (610, 680), (460, 560), (580, 570)]:
        pr = random.randint(10, 22)
        draw.ellipse([px - pr, py - pr//2, px + pr, py + pr//2], fill=color_drip)
        draw.ellipse([px - pr//2, py - pr//4, px + pr//4, py + pr//4], fill=color_highlight)
        
    img.save(filename, 'PNG')
    print(f"Generated {filename}")

def generate_toppings():
    # 1. Extra Melted Cheese
    img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Thick dripping warm cheese ribbons across the pile
    cheese_gold = (245, 158, 11, 235)
    cheese_light = (254, 240, 138, 245)
    cheese_shadow = (217, 119, 6, 210)
    
    # Zigzag flowing ribbons
    ribbons = [
        [(400, 420), (450, 450), (520, 430), (590, 460), (640, 420)],
        [(360, 510), (420, 540), (490, 510), (560, 550), (650, 510)],
        [(420, 580), (470, 620), (530, 590), (600, 630), (630, 590)],
        [(480, 370), (512, 400), (550, 380)],
    ]
    for pts in ribbons:
        # Shadow underneath ribbon
        for i in range(len(pts) - 1):
            x1, y1 = pts[i]
            x2, y2 = pts[i+1]
            draw.line([x1, y1 + 4, x2, y2 + 4], fill=cheese_shadow, width=16)
            draw.line([x1, y1, x2, y2], fill=cheese_gold, width=14)
            draw.line([x1, y1 - 2, x2, y2 - 2], fill=cheese_light, width=6)
            # Cheese dollop at joints
            draw.ellipse([x1 - 8, y1 - 8, x1 + 8, y1 + 8], fill=cheese_gold)
            
    img.save('public/assets/layers/topping_extra_cheese.png', 'PNG')
    print("Generated topping_extra_cheese.png")

    # 2. Fresh Chili Pepper Slices
    img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    chili_coords = [
        (470, 430, 18, 30),
        (550, 420, 20, -25),
        (410, 510, 19, 45),
        (512, 490, 22, 10),
        (620, 500, 19, -40),
        (460, 580, 21, 20),
        (560, 590, 20, -15),
        (500, 380, 17, 35),
        (370, 460, 18, -30),
        (650, 440, 18, 50),
    ]
    for cx, cy, r, angle in chili_coords:
        # Drop shadow
        draw.ellipse([cx - r + 3, cy - r//2 + 5, cx + r + 3, cy + r//2 + 5], fill=(0, 0, 0, 100))
        # Outer red skin
        draw.ellipse([cx - r, cy - r//2, cx + r, cy + r//2], fill=(220, 38, 38, 255))
        # Inner white/pale green ring
        draw.ellipse([cx - r + 4, cy - r//2 + 3, cx + r - 4, cy + r//2 - 3], fill=(254, 226, 226, 255))
        # Hollow center with green core
        draw.ellipse([cx - r + 7, cy - r//2 + 5, cx + r - 7, cy + r//2 - 5], fill=(185, 28, 28, 255))
        # Yellow seed dots
        draw.ellipse([cx - 3, cy - 2, cx + 3, cy + 2], fill=(254, 240, 138, 255))
        draw.ellipse([cx + 4, cy - 1, cx + 8, cy + 3], fill=(254, 240, 138, 255))
        
    img.save('public/assets/layers/topping_chili_slices.png', 'PNG')
    print("Generated topping_chili_slices.png")

    # 3. Sesame Seeds Sprinkle
    img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    random.seed(42)
    # 250 oval toasted white & golden sesame seeds scattered across wings zone
    for _ in range(260):
        sx = random.randint(370, 660)
        sy = random.randint(370, 640)
        # Check if roughly inside plate ellipse
        dx = (sx - 512) / 160
        dy = (sy - 512) / 130
        if dx*dx + dy*dy <= 1.2:
            sw = random.randint(3, 5)
            sh = random.randint(6, 9)
            s_col = random.choice([
                (255, 255, 245, 240), # White sesame
                (250, 240, 205, 240), # Golden sesame
                (217, 165, 80, 230),  # Toasted edge
                (70, 40, 20, 200),    # Occasional black sesame for gourmet contrast
            ])
            # Draw tilted oval seed
            seed_img = Image.new('RGBA', (sh*2, sh*2), (0, 0, 0, 0))
            s_d = ImageDraw.Draw(seed_img)
            s_d.ellipse([sh - sw//2, sh - sh//2, sh + sw//2, sh + sh//2], fill=s_col)
            rot = seed_img.rotate(random.randint(0, 180), resample=Image.Resampling.BILINEAR)
            rw, rh = rot.size
            img.paste(rot, (sx - rw//2, sy - rh//2), rot)
            
    img.save('public/assets/layers/topping_sesame.png', 'PNG')
    print("Generated topping_sesame.png")

    # 4. Chopped Green Onions (Scallions)
    img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    random.seed(88)
    for _ in range(65):
        ox = random.randint(380, 650)
        oy = random.randint(380, 630)
        dx = (ox - 512) / 150
        dy = (oy - 512) / 120
        if dx*dx + dy*dy <= 1.15:
            orad = random.randint(7, 12)
            # Drop shadow
            draw.ellipse([ox - orad + 2, oy - orad//2 + 3, ox + orad + 2, oy + orad//2 + 3], fill=(0, 0, 0, 80))
            # Green scallion outer ring
            draw.ellipse([ox - orad, oy - orad//2, ox + orad, oy + orad//2], fill=(22, 163, 74, 255))
            # Light lime green inner core
            draw.ellipse([ox - orad + 3, oy - orad//2 + 2, ox + orad - 3, oy + orad//2 - 2], fill=(187, 247, 208, 255))
            # Dark hollow center
            draw.ellipse([ox - orad + 5, oy - orad//2 + 3, ox + orad - 5, oy + orad//2 - 3], fill=(21, 128, 61, 255))
            
    img.save('public/assets/layers/topping_green_onions.png', 'PNG')
    print("Generated topping_green_onions.png")

def main():
    print("Generating base wings plates...")
    generate_base_wings(CORE_WINGS_6, 'public/assets/layers/base_wings_6.png')
    generate_base_wings(EXTRA_WINGS_12, 'public/assets/layers/base_wings_12.png')
    generate_base_wings(EXTRA_WINGS_24, 'public/assets/layers/base_wings_24.png')
    
    # Generate sauce layers
    print("Generating sauce glaze layers...")
    sauces_config = [
        # BBQ: Glossy dark brown
        ('sauce_bbq', (59, 20, 8, 230), (120, 53, 15, 200), (35, 12, 5, 245)),
        # Buffalo: Vibrant fiery red-orange
        ('sauce_buffalo', (234, 60, 12, 235), (254, 110, 45, 210), (194, 30, 8, 245)),
        # Cheese: Melted yellowish-white cheddar
        ('sauce_cheese', (245, 158, 11, 235), (254, 215, 80, 220), (217, 119, 6, 245)),
        # Honey Mustard: Glossy golden-yellow
        ('sauce_honey_mustard', (234, 179, 8, 230), (254, 240, 138, 210), (180, 130, 5, 245)),
        # Algeria Sauce: Light creamy orange with paprika
        ('sauce_algeria', (249, 115, 22, 230), (254, 185, 125, 215), (210, 75, 10, 245)),
        # White Sauce: Creamy smooth ivory-white garlic ranch
        ('sauce_white', (241, 245, 249, 235), (255, 255, 255, 230), (203, 213, 225, 245)),
    ]
    
    # We generate sauces aligned with EXTRA_WINGS_24 so they provide coverage across all wings!
    for s_id, c_base, c_high, c_drip in sauces_config:
        generate_sauce_layer(EXTRA_WINGS_24, s_id, c_base, c_high, c_drip, f'public/assets/layers/{s_id}.png')
        
    print("Generating toppings...")
    generate_toppings()
    print("All layers generated successfully!")

if __name__ == '__main__':
    main()
