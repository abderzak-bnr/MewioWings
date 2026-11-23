import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# ==========================================================
# 1. UPDATE CSS FOR MAIN WINGS BOX CENTERING
# ==========================================================
old_plate_wrap_css = """    /* Main Wings Box Wrapper: Centered slightly toward top-middle (Zero Overlap) */
    .main-plate-wrap {
      position: absolute;
      left: 54%;
      top: 44%;
      transform: translate(-50%, -50%);
      width: 215px;
      height: 215px;
      z-index: 10;
      transition: transform 0.22s ease-out;
    }

    .plate-svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
      pointer-events: none;
    }

    /* Transparent PNG Wings Box: Direct on dark stage (#0B1221) with soft realistic drop shadow */
    .real-wing-overlay {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      z-index: 12;
      pointer-events: none;
      filter: drop-shadow(0 18px 28px rgba(0, 0, 0, 0.55));
      transition: opacity 0.22s cubic-bezier(0.4, 0, 0.2, 1), transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
      opacity: 1;
      transform: scale(1);
    }
    .real-wing-overlay.switching {
      opacity: 0.12;
      transform: scale(0.96);
    }"""

new_plate_wrap_css = """    /* Dedicated Full-Size Centered Flex Container for Wings Box (Dead-Center, Zero RTL Shift Bug) */
    .wings-center-stage {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 10;
      padding-right: 38px; /* Comfortable breathing room from right-side vertical spice thermometer */
      padding-bottom: 22px; /* Breathing room for sides below */
    }

    .main-plate-wrap {
      width: 215px;
      height: 215px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }

    .plate-svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
      pointer-events: none;
    }

    /* Transparent PNG Wings Box: Direct on dark stage (#0B1221) with soft realistic drop shadow */
    .real-wing-overlay {
      width: 100%;
      height: 100%;
      max-width: 215px;
      max-height: 215px;
      object-fit: contain;
      z-index: 12;
      pointer-events: none;
      filter: drop-shadow(0 18px 28px rgba(0, 0, 0, 0.55));
      transition: opacity 0.22s cubic-bezier(0.4, 0, 0.2, 1), transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
      opacity: 1;
      transform: scale(1);
      transform-origin: center center;
    }
    .real-wing-overlay.switching {
      opacity: 0.12;
      transform: scale(0.96);
    }"""

html = html.replace(old_plate_wrap_css, new_plate_wrap_css)

# ==========================================================
# 2. UPDATE DOM STAGE MARKUP WITH WINGS-CENTER-STAGE
# ==========================================================
old_stage_wrap_dom = """        <!-- Main Focal Point: Transparent PNG Wings Box Floating Directly on Dark Navy Stage (No White Plate) -->
        <div class="main-plate-wrap" id="mainPlateWrap">
          <!-- Real PNG Image Overlay: Transparent PNG with Soft Realistic Drop Shadow -->
          <img id="realWingImg" class="real-wing-overlay" src="" alt="Chicken Wings" 
               onerror="handleWingImgError(this)" 
               onload="handleWingImgLoad(this)" />

          <!-- Procedural Vector Fallback (ONLY shown if PNG fails, transparent backdrop, no white dish) -->
          <svg class="plate-svg" id="mainPlateSvg" viewBox="0 0 240 240">"""

new_stage_wrap_dom = """        <!-- Dedicated Centered Flex Stage for Main Wings (Dead-Center, Zero RTL Shift Bug) -->
        <div class="wings-center-stage">
          <div class="main-plate-wrap" id="mainPlateWrap">
            <!-- Real PNG Image Overlay: Transparent PNG with Soft Realistic Drop Shadow -->
            <img id="realWingImg" class="real-wing-overlay" src="" alt="Chicken Wings" 
                 onerror="handleWingImgError(this)" 
                 onload="handleWingImgLoad(this)" />

            <!-- Procedural Vector Fallback (ONLY shown if PNG fails, transparent backdrop, no white dish) -->
            <svg class="plate-svg" id="mainPlateSvg" viewBox="0 0 240 240">"""

html = html.replace(old_stage_wrap_dom, new_stage_wrap_dom)

# Close the .wings-center-stage div after </svg>\n        </div>
old_stage_close = """          </svg>
        </div>

        <!-- Dedicated Vertical Spice Thermometer on Right Side -->"""

new_stage_close = """          </svg>
          </div>
        </div>

        <!-- Dedicated Vertical Spice Thermometer on Right Side -->"""

html = html.replace(old_stage_close, new_stage_close)

# ==========================================================
# 3. UPDATE setWingsCount TO SCALE INNER IMG ONLY
# ==========================================================
old_set_count_fn = """    function setWingsCount(count) {
      state.wingsCount = count;
      const plateWrap = document.getElementById("mainPlateWrap");
      plateWrap.style.transform = "scale(0.96)";
      setTimeout(() => { plateWrap.style.transform = "scale(1)"; }, 150);
      renderAll();
    }"""

new_set_count_fn = """    function setWingsCount(count) {
      state.wingsCount = count;
      const img = document.getElementById("realWingImg");
      if (img) {
        img.style.transform = "scale(0.95)";
        setTimeout(() => { img.style.transform = "scale(1)"; }, 150);
      }
      renderAll();
    }"""

html = html.replace(old_set_count_fn, new_set_count_fn)

# ==========================================================
# 4. REPLACE "ALGERIA SAUCE" WITH "HONEY MUSTARD" IN SIDE DIPS ONLY
# ==========================================================
old_dips_config = """      /**
       * SIDE DIPS: Exactly 6 items mapped to /images/dip-${id}.png with automatic fallback
       */
      dips: [
        { id: "buffalo", name: "بافالو", nameEn: "Buffalo", color: "#DC2626", sauceColor: "#EF4444", image: "/images/dip-buffalo.png" },
        { id: "algeria", name: "الصوص الجزائرية", nameEn: "Algerian Sauce", color: "#EA580C", sauceColor: "#F97316", isSignature: true, image: "/images/dip-algeria.png" },
        { id: "ranch", name: "رانش", nameEn: "Ranch", color: "#F8FAFC", sauceColor: "#FFFFFF", image: "/images/dip-ranch.png" },
        { id: "cheese", name: "صوص الجبن", nameEn: "Cheese Sauce", color: "#F59E0B", sauceColor: "#FBBF24", image: "/images/dip-cheese.png" },
        { id: "bbq", name: "باربكيو", nameEn: "BBQ", color: "#451A03", sauceColor: "#451A03", image: "/images/dip-bbq.png" },
        { id: "ketchup", name: "كاتشب", nameEn: "Ketchup", color: "#B91C1C", sauceColor: "#DC2626", image: "/images/dip-ketchup.png" },
      ],"""

new_dips_config = """      /**
       * SIDE DIPS: Exactly 6 items mapped to /images/dip-${id}.png with automatic fallback
       */
      dips: [
        { id: "buffalo", name: "بافالو", nameEn: "Buffalo", color: "#DC2626", sauceColor: "#EF4444", image: "/images/dip-buffalo.png" },
        { id: "honey-mustard", name: "هوني ماسترد", nameEn: "Honey Mustard", color: "#EAB308", sauceColor: "#FACC15", image: "/images/dip-honey-mustard.png" },
        { id: "ranch", name: "رانش", nameEn: "Ranch", color: "#F8FAFC", sauceColor: "#FFFFFF", image: "/images/dip-ranch.png" },
        { id: "cheese", name: "صوص الجبن", nameEn: "Cheese Sauce", color: "#F59E0B", sauceColor: "#FBBF24", image: "/images/dip-cheese.png" },
        { id: "bbq", name: "باربكيو", nameEn: "BBQ", color: "#451A03", sauceColor: "#451A03", image: "/images/dip-bbq.png" },
        { id: "ketchup", name: "كاتشب", nameEn: "Ketchup", color: "#B91C1C", sauceColor: "#DC2626", image: "/images/dip-ketchup.png" },
      ],"""

html = html.replace(old_dips_config, new_dips_config)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

with open("wings_app.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Centering bug fixed and side dips updated successfully!")
