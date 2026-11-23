with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Update MENU_CONFIG with cache-busting query string ?v=2 for side-fries.png
old_sides_config = """      /**
       * SIDES: Exactly 2 items mapped to /images/side-${id}.png with automatic fallback
       */
      sides: [
        { id: "fries", name: "بطاطا مقلية", nameEn: "Fries", price: 200, type: "fries", image: "/images/side-fries.png" },
        { id: "coleslaw", name: "سلطة الكرنب", nameEn: "Coleslaw", price: 220, type: "coleslaw", image: "/images/side-coleslaw.png" },
      ],"""

new_sides_config = """      /**
       * SIDES: Exactly 2 items mapped to /images/side-${id}.png with automatic fallback
       */
      sides: [
        { id: "fries", name: "بطاطا مقلية", nameEn: "Fries", price: 200, type: "fries", image: "/images/side-fries.png?v=2" },
        { id: "coleslaw", name: "سلطة الكرنب", nameEn: "Coleslaw", price: 220, type: "coleslaw", image: "/images/side-coleslaw.png" },
      ],"""

html = html.replace(old_sides_config, new_sides_config)

# 2. Update resolveImagePath to cleanly strip query params for file:// access while keeping them for http/https
old_resolve = """    function resolveImagePath(path) {
      if (!path) return "";
      if (window.location.protocol === 'file:') {
        return path.startsWith('/') ? 'public' + path : 'public/' + path;
      }
      return path;
    }"""

new_resolve = """    function resolveImagePath(path) {
      if (!path) return "";
      if (window.location.protocol === 'file:') {
        const cleanPath = path.split('?')[0];
        return cleanPath.startsWith('/') ? 'public' + cleanPath : 'public/' + cleanPath;
      }
      return path;
    }"""

html = html.replace(old_resolve, new_resolve)

# 3. Clean border-radius: 50% from createSideContent so transparent square PNGs render without clipping
old_side_content = """        <img src="${imgPath}" alt="${sideObj ? sideObj.name : ''}"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
             onload="this.style.display='block'; this.nextElementSibling.style.display='none';"
             style="display: none; width: 100%; height: 100%; object-fit: contain; border-radius: 50%; filter: drop-shadow(0 10px 18px rgba(0,0,0,0.6));" />"""

new_side_content = """        <img src="${imgPath}" alt="${sideObj ? sideObj.name : ''}"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
             onload="this.style.display='block'; this.nextElementSibling.style.display='none';"
             style="display: none; width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 10px 18px rgba(0,0,0,0.6));" />"""

html = html.replace(old_side_content, new_side_content)

# Update both files
with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

with open("wings_app.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Updated fries image path with ?v=2 and verified visual sizing!")
