import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# ==========================================================
# 1. CSS: REMOVE VERTICAL THERMOMETER & ADD HORIZONTAL SPICE BAR
# ==========================================================
old_thermo_css = """    /* ==========================================================
       INTERACTIVE VERTICAL SPICE THERMOMETER (Right Side)
       ========================================================== */
    .spice-thermometer-wrap {
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 25;
      cursor: pointer;
      background: rgba(19, 30, 51, 0.8);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      padding: 8px 6px 6px;
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
      transition: all 0.25s ease;
    }
    .spice-thermometer-wrap:hover {
      background: rgba(19, 30, 51, 0.95);
      border-color: rgba(255, 255, 255, 0.25);
    }
    .spice-thermometer-wrap:active {
      transform: translateY(-50%) scale(0.96);
    }

    .thermo-header-icon {
      font-size: 13px;
      margin-bottom: 4px;
      line-height: 1;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
    }

    .thermometer-glass {
      width: 12px;
      height: 84px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 6px 6px 0 0;
      border: 1.5px solid rgba(255, 255, 255, 0.3);
      border-bottom: none;
      position: relative;
      overflow: hidden;
    }

    .thermo-ticks-guide {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 6px 1px;
      pointer-events: none;
      z-index: 3;
    }
    .thermo-tick-line {
      width: 5px;
      height: 1px;
      background: rgba(255, 255, 255, 0.4);
    }

    .thermo-mercury {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      border-radius: 4px 4px 0 0;
      transition: height 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s ease;
      z-index: 2;
    }

    .thermo-bulb {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 1.5px solid rgba(255, 255, 255, 0.35);
      margin-top: -3px;
      position: relative;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .thermo-bulb-inner {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .thermo-label {
      font-size: 10px;
      font-weight: 800;
      margin-top: 5px;
      white-space: nowrap;
      font-family: var(--font-cairo);
      text-align: center;
      line-height: 1.1;
      transition: color 0.25s ease;
    }"""

new_thermo_css = """    /* ==========================================================
       SLEEK HORIZONTAL 3-STEP SPICE BAR (Bottom of Visual Stage)
       ========================================================== */
    .spice-bar-wrap {
      position: absolute;
      bottom: 9px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(11, 18, 33, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      padding: 3px 4px;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      gap: 3px;
      z-index: 25;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.5);
    }

    .spice-bar-btn {
      border: 1px solid transparent;
      background: transparent;
      padding: 4px 9px;
      border-radius: 9999px;
      color: var(--text-muted);
      font-size: 11px;
      font-weight: 800;
      font-family: var(--font-cairo);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      white-space: nowrap;
    }
    .spice-bar-btn:active {
      transform: scale(0.95);
    }
    .spice-bar-btn.active.mild {
      background: rgba(16, 185, 129, 0.18);
      color: #10B981;
      border-color: rgba(16, 185, 129, 0.4);
      box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
    }
    .spice-bar-btn.active.medium {
      background: rgba(249, 115, 22, 0.2);
      color: #F97316;
      border-color: rgba(249, 115, 22, 0.45);
      box-shadow: 0 0 12px rgba(249, 115, 22, 0.28);
    }
    .spice-bar-btn.active.extra-hot {
      background: rgba(239, 68, 68, 0.24);
      color: #EF4444;
      border-color: rgba(239, 68, 68, 0.55);
      box-shadow: 0 0 14px rgba(239, 68, 68, 0.4);
    }

    .spice-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }"""

html = html.replace(old_thermo_css, new_thermo_css)

# ==========================================================
# 2. CSS: UPDATE WINGS STAGE & SAUCE BADGE MARGIN
# ==========================================================
old_wings_stage_css = """    /* Dedicated Full-Size Centered Flex Container for Wings Box (Dead-Center, Zero RTL Shift Bug) */
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
    }"""

new_wings_stage_css = """    /* Dedicated Full-Size Centered Flex Container for Wings Box (Dead-Center Symmetrical Stage) */
    .wings-center-stage {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 10;
      padding-bottom: 28px; /* Breathing room for horizontal spice bar below */
      padding-top: 14px; /* Clearance for top sauce badge */
    }

    .main-plate-wrap {
      width: 205px;
      height: 205px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }"""

html = html.replace(old_wings_stage_css, new_wings_stage_css)

# Top sauce badge positioned with ample margin above top rim of bucket
old_badge_css = """    /* Active Sauce Name Badge on Stage (Top Center above Wings) */
    .stage-sauce-badge {
      position: absolute;
      top: 10px;
      left: 54%;
      transform: translateX(-50%);
      background: rgba(11, 18, 33, 0.88);
      border: 1px solid rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(8px);
      padding: 3px 12px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 800;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      gap: 6px;
      z-index: 20;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }"""

new_badge_css = """    /* Active Sauce Name Badge on Stage (Top Center above Wings with ample margin) */
    .stage-sauce-badge {
      position: absolute;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(11, 18, 33, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.14);
      backdrop-filter: blur(10px);
      padding: 3px 12px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 800;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      gap: 6px;
      z-index: 20;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }"""

html = html.replace(old_badge_css, new_badge_css)

# ==========================================================
# 3. CSS: SIDES MOVED TO RIGHT ZONE (STACKED VERTICALLY)
# ==========================================================
old_sides_css = """    /* ==========================================================
       SIDES ZONE: DEDICATED BOTTOM-LEFT / BELOW WINGS (2 SLOTS)
       Smooth < 250ms spring scale/fade animations, zero collision
       ========================================================== */
    .orbit-side-plate {
      position: absolute;
      width: 64px;
      height: 64px;
      z-index: 16;
      transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
      transform: scale(0) rotate(-6deg);
      opacity: 0;
      pointer-events: none;
    }
    .orbit-side-plate.visible {
      transform: scale(1) rotate(0deg);
      opacity: 1;
      pointer-events: auto;
    }

    /* Cleanly tucked below the wings box and clear of dips and thermometer */
    .side-slot-0 { bottom: 12px; left: 78px; }
    .side-slot-1 { bottom: 12px; left: 154px; }"""

new_sides_css = """    /* ==========================================================
       RIGHT ZONE (SIDES): STACKED VERTICALLY IN FREED RIGHT SPACE
       Consistent generous sizing, zero collision with wings bucket
       ========================================================== */
    .orbit-side-plate {
      position: absolute;
      width: 68px;
      height: 68px;
      z-index: 16;
      transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
      transform: scale(0);
      opacity: 0;
      pointer-events: none;
    }
    .orbit-side-plate.visible {
      transform: scale(1);
      opacity: 1;
      pointer-events: auto;
    }

    /* Stacked vertically on the right side of the wings box */
    .side-slot-0 { right: 12px; top: 44px; }
    .side-slot-1 { right: 12px; top: 130px; }"""

html = html.replace(old_sides_css, new_sides_css)

# Ensure quantity badge on sides is anchored cleanly on top-right of its own image
old_side_badge = """.side-qty-badge {
      position: absolute;
      top: -3px;
      right: -3px;
      background: var(--brand-orange);
      color: #FFFFFF;
      font-size: 11px;
      font-weight: 900;
      border-radius: 9999px;
      min-width: 20px;
      height: 20px;
      padding: 0 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1.5px solid var(--bg-midnight);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
      z-index: 22;
      animation: popInBadge 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }"""

new_side_badge = """.side-qty-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: var(--brand-orange);
      color: #FFFFFF;
      font-size: 10px;
      font-weight: 900;
      border-radius: 9999px;
      min-width: 19px;
      height: 19px;
      padding: 0 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1.5px solid var(--bg-midnight);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
      z-index: 22;
      animation: popInBadge 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }"""

html = html.replace(old_side_badge, new_side_badge)

# ==========================================================
# 4. CSS: CATEGORY TABS FIT & BOTTOM CTA SAFE AREA
# ==========================================================
old_controls_css = """    .controls-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 10px 16px 14px;
      gap: 10px;
    }

    .category-tabs-row {
      display: flex;
      align-items: center;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 2px;
    }

    .tab-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 7px 14px;
      border-radius: 9999px;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      color: var(--text-muted);
      font-size: 12px;
      font-weight: 700;
      font-family: var(--font-cairo);
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
    }"""

new_controls_css = """    .controls-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 8px 14px calc(14px + env(safe-area-inset-bottom, 0px));
      gap: 10px;
    }

    .category-tabs-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      padding-bottom: 2px;
      width: 100%;
    }

    .tab-pill {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      padding: 7px 8px;
      border-radius: 9999px;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      color: var(--text-muted);
      font-size: 11px;
      font-weight: 800;
      font-family: var(--font-cairo);
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
    }"""

html = html.replace(old_controls_css, new_controls_css)

# Update Bottom CTA Button for safe-area margin
old_cta_css = """    /* Bottom CTA Button */
    .cta-button {
      width: 100%;
      background: var(--brand-orange);
      color: #FFFFFF;
      border: none;
      border-radius: 9999px;
      padding: 14px 20px;
      font-size: 15px;
      font-weight: 900;
      font-family: var(--font-cairo);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 8px 20px rgba(249, 78, 30, 0.45);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }"""

new_cta_css = """    /* Bottom CTA Button with Mobile Safe-Area Margin */
    .cta-button {
      width: 100%;
      background: var(--brand-orange);
      color: #FFFFFF;
      border: none;
      border-radius: 9999px;
      padding: 14px 20px;
      font-size: 15px;
      font-weight: 900;
      font-family: var(--font-cairo);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 8px 20px rgba(249, 78, 30, 0.45);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      margin-bottom: max(4px, env(safe-area-inset-bottom, 0px));
    }"""

html = html.replace(old_cta_css, new_cta_css)

# ==========================================================
# 5. DOM: REPLACE VERTICAL THERMOMETER WITH HORIZONTAL SPICE BAR
# ==========================================================
old_stage_dom_end = """        <!-- Dedicated Vertical Spice Thermometer on Right Side -->
        <div class="spice-thermometer-wrap" id="spiceThermometer" onclick="cycleSpiceLevel()" title="انقر لتبديل مستوى الحرارة">
          <div class="thermo-header-icon" id="thermoHeaderIcon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
            </svg>
          </div>
          <div class="thermometer-glass">
            <div class="thermo-ticks-guide">
              <div class="thermo-tick-line" style="width: 7px;"></div>
              <div class="thermo-tick-line" style="width: 5px;"></div>
              <div class="thermo-tick-line" style="width: 7px;"></div>
              <div class="thermo-tick-line" style="width: 5px;"></div>
              <div class="thermo-tick-line" style="width: 7px;"></div>
            </div>
            <div class="thermo-mercury" id="thermoMercury" style="height: 65%; background: #F97316;"></div>
          </div>
          <div class="thermo-bulb" id="thermoBulb" style="border-color: rgba(249, 115, 22, 0.6); box-shadow: 0 0 12px rgba(249, 115, 22, 0.4);">
            <div class="thermo-bulb-inner" id="thermoBulbInner" style="background: #F97316;"></div>
          </div>
          <div class="thermo-label" id="thermoLabel" style="color: #F97316;">حار</div>
        </div>

        <!-- Active Sauce Name Badge on Stage -->
        <div class="stage-sauce-badge" id="stageSauceBadge">
          <span class="sauce-badge-dot" id="stageSauceBadgeDot" style="background-color: #F59E0B;"></span>
          <span id="stageSauceBadgeText">أجنحة مقرمشة ذهبية</span>
        </div>"""

new_stage_dom_end = """        <!-- Sleek Horizontal 3-Step Spice Selector Bar (Bottom of Stage) -->
        <div class="spice-bar-wrap" id="spiceBarWrap" role="radiogroup" aria-label="درجة الحرارة">
          <button type="button" class="spice-bar-btn" id="spiceBtn0" onclick="setSpiceLevel(0)">
            <span class="spice-dot" style="background: #10B981;"></span>
            <span>غير حار</span>
          </button>
          <button type="button" class="spice-bar-btn active medium" id="spiceBtn1" onclick="setSpiceLevel(1)">
            <span class="spice-dot" style="background: #F97316;"></span>
            <span style="display:inline-flex;align-items:center;gap:3px;">
              حار
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
            </span>
          </button>
          <button type="button" class="spice-bar-btn" id="spiceBtn2" onclick="setSpiceLevel(2)">
            <span class="spice-dot" style="background: #EF4444;"></span>
            <span style="display:inline-flex;align-items:center;gap:3px;">
              حار جداً
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
            </span>
          </button>
        </div>

        <!-- Active Sauce Name Badge on Stage (Top Center above Wings) -->
        <div class="stage-sauce-badge" id="stageSauceBadge">
          <span class="sauce-badge-dot" id="stageSauceBadgeDot" style="background-color: #F59E0B;"></span>
          <span id="stageSauceBadgeText">أجنحة مقرمشة ذهبية</span>
        </div>"""

html = html.replace(old_stage_dom_end, new_stage_dom_end)

# ==========================================================
# 6. MENU_CONFIG: SHORTEN CRISPY LABEL (NO TRUNCATION)
# ==========================================================
old_crispy_config = """        {
          id: "crispy",
          name: "بدون صوص (مقرمش فقط)",
          nameEn: "Crispy (No Sauce)",
          color: "#D97706",
          stops: ["#FBBF24", "#D97706", "#78350F"],
          isPlain: true,
          description: "أجنحة ذهبية مقلية مقرمشة بدون أي صوص للحفاظ على القرمشة القصوى",
        },"""

new_crispy_config = """        {
          id: "crispy",
          name: "كريسبي",
          subtitle: "بدون صوص",
          nameEn: "Crispy",
          color: "#D97706",
          stops: ["#FBBF24", "#D97706", "#78350F"],
          isPlain: true,
          description: "أجنحة ذهبية مقلية مقرمشة بدون أي صوص للحفاظ على القرمشة القصوى",
        },"""

html = html.replace(old_crispy_config, new_crispy_config)

# ==========================================================
# 7. JS: SPICE BAR CONTROLS & CAROUSEL RENDERING
# ==========================================================
old_thermo_fn = """    /**
     * VERTICAL SPICE THERMOMETER
     */
    function cycleSpiceLevel() {
      state.spiceLevel = (state.spiceLevel + 1) % 3;
      updateThermometerUI();
      renderWingsSvg();
    }

    function updateThermometerUI() {
      const current = MENU_CONFIG.spiceLevels[state.spiceLevel];
      const mercury = document.getElementById("thermoMercury");
      const bulb = document.getElementById("thermoBulb");
      const bulbInner = document.getElementById("thermoBulbInner");
      const label = document.getElementById("thermoLabel");
      const headerIcon = document.getElementById("thermoHeaderIcon");

      if (!mercury || !bulb) return;

      mercury.style.height = current.mercuryHeight;
      mercury.style.background = current.color;
      bulbInner.style.background = current.color;
      bulb.style.borderColor = current.color;
      bulb.style.boxShadow = `0 0 12px ${current.color}88`;
      label.style.color = current.color;

      const flameIcon = `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style="display:inline-block;vertical-align:-1px;"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`;
      const thermoSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>`;

      headerIcon.innerHTML = thermoSvg;

      if (state.spiceLevel === 0) {
        label.innerHTML = "<span>غير حار</span>";
      } else if (state.spiceLevel === 1) {
        label.innerHTML = `<span style="display:inline-flex;align-items:center;gap:3px;justify-content:center;">حار ${flameIcon}</span>`;
      } else {
        label.innerHTML = `<span style="display:inline-flex;align-items:center;gap:3px;justify-content:center;">حار جداً ${flameIcon}${flameIcon}</span>`;
      }
    }"""

new_thermo_fn = """    /**
     * HORIZONTAL 3-STEP SPICE SELECTOR
     */
    function setSpiceLevel(level) {
      state.spiceLevel = level;
      updateSpiceBarUI();
      renderWingsSvg();
    }

    function updateSpiceBarUI() {
      const btn0 = document.getElementById("spiceBtn0");
      const btn1 = document.getElementById("spiceBtn1");
      const btn2 = document.getElementById("spiceBtn2");
      if (!btn0 || !btn1 || !btn2) return;

      btn0.className = "spice-bar-btn" + (state.spiceLevel === 0 ? " active mild" : "");
      btn1.className = "spice-bar-btn" + (state.spiceLevel === 1 ? " active medium" : "");
      btn2.className = "spice-bar-btn" + (state.spiceLevel === 2 ? " active extra-hot" : "");
    }"""

html = html.replace(old_thermo_fn, new_thermo_fn)

# Replace updateThermometerUI call in renderAll
html = html.replace("updateThermometerUI();", "updateSpiceBarUI();")

# Update renderSauceCarousel subtitle rendering
old_sauce_render = """          <div class="item-name">${sauce.name}</div>
          <div class="item-price free">${sauce.isSignature ? `<span style="display:inline-flex;align-items:center;gap:3px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>مميز</span>` : "مشمول"}</div>"""

new_sauce_render = """          <div class="item-name">${sauce.name}</div>
          <div class="item-price free">${sauce.subtitle ? sauce.subtitle : (sauce.isSignature ? `<span style="display:inline-flex;align-items:center;gap:3px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>مميز</span>` : "مشمول")}</div>"""

html = html.replace(old_sauce_render, new_sauce_render)

# Update stageSauceBadge text for crispy
old_stage_badge_update = """    function updateStageSauceBadge() {
      const badgeText = document.getElementById("stageSauceBadgeText");
      const badgeDot = document.getElementById("stageSauceBadgeDot");

      const sauce = MENU_CONFIG.coatingSauces.find(s => s.id === state.selectedSauceId);
      if (sauce) {
        badgeText.innerText = sauce.name;
        badgeDot.style.backgroundColor = sauce.color;
      }
    }"""

new_stage_badge_update = """    function updateStageSauceBadge() {
      const badgeText = document.getElementById("stageSauceBadgeText");
      const badgeDot = document.getElementById("stageSauceBadgeDot");

      const sauce = MENU_CONFIG.coatingSauces.find(s => s.id === state.selectedSauceId);
      if (sauce) {
        badgeText.innerText = sauce.subtitle ? `${sauce.name} (${sauce.subtitle})` : sauce.name;
        badgeDot.style.backgroundColor = sauce.color;
      }
    }"""

html = html.replace(old_stage_badge_update, new_stage_badge_update)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

with open("wings_app.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Applied refined layout and horizontal spice bar successfully!")
