import React, { useState, useEffect, useMemo } from 'react';
import { 
  Flame, 
  Sparkles, 
  MapPin, 
  Clock, 
  Phone, 
  MessageCircle, 
  RotateCcw,
  CheckCircle2,
  ChefHat
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  RESTAURANT_INFO, 
  WINGS_QUANTITIES, 
  SAUCES, 
  TOPPINGS, 
  SPICE_LEVELS, 
  getAllLayerImageUrls,
  formatDZD 
} from './data/wingsConfig';
import { VisualMealBuilder } from './components/MealBuilder/VisualMealBuilder';
import { QuantitySelector } from './components/MealBuilder/QuantitySelector';
import { SauceSelector } from './components/MealBuilder/SauceSelector';
import { ToppingsSelector } from './components/MealBuilder/ToppingsSelector';
import { SpiceLevelSelector } from './components/MealBuilder/SpiceLevelSelector';
import { StickyOrderBar } from './components/MealBuilder/StickyOrderBar';
import { OrderDrawer } from './components/MealBuilder/OrderDrawer';

export default function App() {
  // Preload all layered PNG assets on mount for ultra-fast mobile switching
  useEffect(() => {
    const urls = getAllLayerImageUrls();
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  // Builder States
  const [selectedQuantity, setSelectedQuantity] = useState(WINGS_QUANTITIES[1]); // Default 12 wings
  const [selectedSauce, setSelectedSauce] = useState(SAUCES[1]); // Default Algeria Sauce 🇩🇿
  const [selectedToppings, setSelectedToppings] = useState([TOPPINGS[1].id, TOPPINGS[2].id]); // Default Chili + Sesame
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState(SPICE_LEVELS[1]); // Default Medium
  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState(false);

  // Toggle multi-select toppings
  const handleToggleTopping = (toppingId) => {
    setSelectedToppings((prev) => {
      if (prev.includes(toppingId)) {
        return prev.filter((id) => id !== toppingId);
      } else {
        return [...prev, toppingId];
      }
    });
  };

  // Reset to initial recommended meal
  const handleReset = () => {
    setSelectedQuantity(WINGS_QUANTITIES[1]);
    setSelectedSauce(SAUCES[1]);
    setSelectedToppings([TOPPINGS[1].id, TOPPINGS[2].id]);
    setSelectedSpiceLevel(SPICE_LEVELS[1]);
  };

  // Calculate unit total price in DZD (دج)
  const unitPrice = useMemo(() => {
    let total = selectedQuantity.price;
    if (selectedSauce.price) {
      total += selectedSauce.price;
    }
    selectedToppings.forEach((topId) => {
      const toppingObj = TOPPINGS.find((t) => t.id === topId);
      if (toppingObj) {
        total += toppingObj.price;
      }
    });
    if (selectedSpiceLevel.price) {
      total += selectedSpiceLevel.price;
    }
    return total;
  }, [selectedQuantity, selectedSauce, selectedToppings, selectedSpiceLevel]);

  return (
    <div className="min-h-screen bg-[#14100E] text-[#FFF8F0] flex flex-col font-cairo antialiased selection:bg-[#FF7A00] selection:text-[#FFF8F0]">
      {/* Top Brand Micro Bar */}
      <header className="bg-[#14100E] text-[#FFF8F0] border-b border-[#3A2822] sticky top-0 sm:static z-50">
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between text-xs">
          {/* Logo & City Tag */}
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.webp"
              alt="WINGO!"
              className="h-9 sm:h-10 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,248,240,0.35)]"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/public/logo.webp';
              }}
            />
            <div>
              <p className="text-[10px] text-[#B8A99A] font-medium">
                {RESTAURANT_INFO.city} 🇩🇿 • {RESTAURANT_INFO.tagline}
              </p>
            </div>
          </div>

          {/* Status & Contact Shortcut */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-[#B8A99A] text-[11px]">
              <Clock className="w-3.5 h-3.5 text-[#FF7A00]" />
              <span>{RESTAURANT_INFO.openingHours}</span>
            </div>
            <a
              href={`tel:${RESTAURANT_INFO.phone}`}
              className="flex items-center gap-1 text-[11px] font-bold text-[#FFF8F0] hover:text-[#FF7A00] bg-[#211A17] px-2.5 py-1 rounded-xl border border-[#3A2822] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#FF7A00]" />
              <span className="hidden xs:inline">{RESTAURANT_INFO.phone}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 py-3 sm:py-6 space-y-6 pb-28">
        {/* Intro Sub-header on Desktop */}
        <div className="hidden sm:flex items-center justify-between bg-[#211A17] p-4 rounded-3xl border border-[#3A2822]">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-black text-[#FF7A00] bg-[#FF7A00]/15 px-2.5 py-0.5 rounded-full border border-[#FF7A00]/30 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>محرك تصميم الأجنحة المباشر بالطبقات (WINGO!)</span>
            </div>
            <h2 className="text-xl font-black font-tajawal text-[#FFF8F0]">
              خصّص كل تفصيلة في طبق أجنحتك وشاهده يتحول لحظياً!
            </h2>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-[#B8A99A] hover:text-[#FFF8F0] bg-[#2C221F] hover:bg-[#3A2822] px-3.5 py-2 rounded-xl transition-all border border-[#3A2822]"
            title="إعادة ضبط الاختيارات"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة البدء</span>
          </button>
        </div>

        {/* CORE FEATURE: Sticky Visual Meal Preview */}
        <VisualMealBuilder
          selectedQuantity={selectedQuantity}
          selectedSauce={selectedSauce}
          selectedToppings={selectedToppings}
          selectedSpiceLevel={selectedSpiceLevel}
          totalPrice={unitPrice}
        />

        {/* Customization Controls Section below preview */}
        <div className="space-y-6 pt-2">
          {/* Step 1: Quantity */}
          <QuantitySelector
            selectedQuantity={selectedQuantity}
            onSelectQuantity={setSelectedQuantity}
          />

          {/* Step 2: Sauce Glaze */}
          <SauceSelector
            selectedSauce={selectedSauce}
            onSelectSauce={setSelectedSauce}
          />

          {/* Step 3: Stackable Toppings */}
          <ToppingsSelector
            selectedToppings={selectedToppings}
            onToggleTopping={handleToggleTopping}
          />

          {/* Step 4: Spice Level & VFX */}
          <SpiceLevelSelector
            selectedSpiceLevel={selectedSpiceLevel}
            onSelectSpiceLevel={setSelectedSpiceLevel}
          />
        </div>
      </main>

      {/* Sticky Bottom Order Bar */}
      <StickyOrderBar
        totalPrice={unitPrice}
        onOpenOrder={() => setIsOrderDrawerOpen(true)}
      />

      {/* Order Summary Drawer */}
      <OrderDrawer
        isOpen={isOrderDrawerOpen}
        onClose={() => setIsOrderDrawerOpen(false)}
        selectedQuantity={selectedQuantity}
        selectedSauce={selectedSauce}
        selectedToppings={selectedToppings}
        selectedSpiceLevel={selectedSpiceLevel}
        unitPrice={unitPrice}
      />

      {/* Footer */}
      <footer className="bg-[#14100E] text-[#FFF8F0] border-t border-[#3A2822] py-8 px-4 text-center text-xs text-[#B8A99A] space-y-3">
        <div className="flex items-center justify-center gap-2 text-sm font-black font-tajawal text-[#FFF8F0]">
          <span>🍗 WINGO!</span>
          <span className="text-[#3A2822]">•</span>
          <span className="text-[#FF7A00]">{RESTAURANT_INFO.city}، {RESTAURANT_INFO.country} 🇩🇿</span>
        </div>
        <p className="max-w-md mx-auto text-[#B8A99A] text-[11px] leading-relaxed">
          {RESTAURANT_INFO.address} • التوصيل متوفر في بلدية المدية والمناطق المجاورة.
        </p>
        <p className="text-[10px] text-[#B8A99A]/70">
          جميع الحقوق محفوظة © {new Date().getFullYear()} — صمم خصيصاً لعشاق الأجنحة في الجزائر.
        </p>
      </footer>
    </div>
  );
}
