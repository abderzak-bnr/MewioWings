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
    <div className="min-h-screen bg-[#0f0f12] text-zinc-100 flex flex-col font-cairo antialiased selection:bg-brand-600 selection:text-white">
      {/* Top Brand Micro Bar */}
      <header className="bg-zinc-950 text-white border-b border-zinc-800/80 sticky top-0 sm:static z-50">
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between text-xs">
          {/* Logo & City Tag */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center font-black shadow-glow">
              <span className="text-lg">🍗</span>
            </div>
            <div>
              <h1 className="text-sm font-black font-tajawal text-white tracking-tight flex items-center gap-1.5">
                {RESTAURANT_INFO.name}
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">
                  {RESTAURANT_INFO.city} 🇩🇿
                </span>
              </h1>
              <p className="text-[10px] text-zinc-400 font-medium">
                {RESTAURANT_INFO.tagline}
              </p>
            </div>
          </div>

          {/* Status & Contact Shortcut */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-zinc-400 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-brand-500" />
              <span>{RESTAURANT_INFO.openingHours}</span>
            </div>
            <a
              href={`tel:${RESTAURANT_INFO.phone}`}
              className="flex items-center gap-1 text-[11px] font-bold text-zinc-300 hover:text-brand-400 bg-zinc-900 px-2.5 py-1 rounded-xl border border-zinc-800 transition-colors"
            >
              <Phone className="w-3 h-3 text-brand-500" />
              <span className="hidden xs:inline">{RESTAURANT_INFO.phone}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 py-3 sm:py-6 space-y-6 pb-28">
        {/* Intro Sub-header on Desktop */}
        <div className="hidden sm:flex items-center justify-between bg-zinc-900/60 p-4 rounded-3xl border border-zinc-800/80">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-black text-brand-400 bg-brand-950/60 px-2.5 py-0.5 rounded-full border border-brand-800/60 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>محرك تصميم الأجنحة المباشر بالطبقات (Layered PNG Engine)</span>
            </div>
            <h2 className="text-xl font-black font-tajawal text-white">
              خصّص كل تفصيلة في طبق أجنحتك وشاهده يتحول لحظياً!
            </h2>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 px-3.5 py-2 rounded-xl transition-all border border-zinc-700/60"
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
      <footer className="bg-zinc-950 text-white border-t border-zinc-900 py-8 px-4 text-center text-xs text-zinc-500 space-y-3">
        <div className="flex items-center justify-center gap-2 text-sm font-black font-tajawal text-white">
          <span>🍗 {RESTAURANT_INFO.name}</span>
          <span className="text-zinc-600">•</span>
          <span className="text-brand-400">{RESTAURANT_INFO.city}، {RESTAURANT_INFO.country} 🇩🇿</span>
        </div>
        <p className="max-w-md mx-auto text-zinc-400 text-[11px] leading-relaxed">
          {RESTAURANT_INFO.address} • التوصيل متوفر في بلدية المدية والمناطق المجاورة.
        </p>
        <p className="text-[10px] text-zinc-600">
          جميع الحقوق محفوظة © {new Date().getFullYear()} — صمم خصيصاً لعشاق الأجنحة في الجزائر.
        </p>
      </footer>
    </div>
  );
}
