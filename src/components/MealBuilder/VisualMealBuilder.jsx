import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Sparkles, MapPin, Zap } from 'lucide-react';
import { TOPPINGS, formatDZD, RESTAURANT_INFO } from '../../data/wingsConfig';

export const VisualMealBuilder = ({
  selectedQuantity,
  selectedSauce,
  selectedToppings,
  selectedSpiceLevel,
  totalPrice,
}) => {
  const isMediumSpice = selectedSpiceLevel.id === 'spice_medium';
  const isExtraHotSpice = selectedSpiceLevel.id === 'spice_extra_hot';

  // Floating chili particles for Extra Hot spice level
  const chiliParticles = [
    { id: 1, x: '25%', delay: 0 },
    { id: 2, x: '45%', delay: 0.6 },
    { id: 3, x: '68%', delay: 1.2 },
    { id: 4, x: '35%', delay: 1.8 },
    { id: 5, x: '58%', delay: 2.3 },
  ];

  return (
    <div className="sticky top-0 z-40 sm:static bg-zinc-950/95 sm:bg-transparent backdrop-blur-md border-b border-zinc-800/80 sm:border-0 pt-2 pb-3 sm:py-0 px-2 sm:px-0">
      <div className="max-w-md mx-auto">
        {/* Aspect Ratio Container (relative, aspect-square) */}
        <div
          className={`relative aspect-square w-full max-h-[36vh] sm:max-h-none sm:max-w-[440px] md:max-w-[480px] mx-auto rounded-3xl overflow-hidden border transition-all duration-300 ${
            isExtraHotSpice
              ? 'border-red-500/80 anim-spice-extra-hot bg-gradient-to-b from-zinc-900 via-red-950/20 to-zinc-950'
              : isMediumSpice
              ? 'border-orange-500/60 anim-spice-medium bg-gradient-to-b from-zinc-900 via-amber-950/15 to-zinc-950'
              : 'border-zinc-800 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 shadow-2xl'
          }`}
        >
          {/* Ambient Lighting & Radial Glow behind the plate */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Center spotlight */}
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full blur-3xl transition-all duration-500 ${
                isExtraHotSpice
                  ? 'bg-red-600/35 scale-125'
                  : isMediumSpice
                  ? 'bg-orange-500/25 scale-110'
                  : 'bg-amber-600/15 scale-100'
              }`}
            />
          </div>

          {/* Floating Live Total Price Badge */}
          <div className="absolute top-3 left-3 z-50 flex items-center gap-1.5 bg-brand-600/95 text-white font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl shadow-lg border border-brand-400/40 backdrop-blur-sm font-tajawal animate-in fade-in zoom-in duration-200">
            <span className="text-[10px] text-brand-200 font-medium hidden xs:inline">الإجمالي:</span>
            <span>{formatDZD(totalPrice)}</span>
          </div>

          {/* Restaurant Location Pin Badge (المدية، الجزائر) */}
          <div className="absolute top-3 right-3 z-50 flex items-center gap-1 bg-zinc-900/90 text-zinc-300 font-bold text-[10px] sm:text-xs px-2.5 py-1.5 rounded-2xl border border-zinc-700/80 shadow-md backdrop-blur-sm">
            <MapPin className="w-3 h-3 text-brand-500 shrink-0" />
            <span>{RESTAURANT_INFO.city} 🇩🇿</span>
          </div>

          {/* ========================================================
              LAYER 1 (z-10): Base Wings & Plate Layer
              Dynamically swaps based on selected quantity (6, 12, 24)
             ======================================================== */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedQuantity.id}
                src={selectedQuantity.image}
                alt={selectedQuantity.title}
                className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              />
            </AnimatePresence>
          </div>

          {/* ========================================================
              LAYER 2 (z-20): Sauce Glaze Layer
              Transparent PNG overlay with subtle mix-blend-mode / opacity
             ======================================================== */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            <AnimatePresence>
              {selectedSauce && selectedSauce.image && (
                <motion.img
                  key={selectedSauce.id}
                  src={selectedSauce.image}
                  alt={selectedSauce.name}
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{
                    mixBlendMode: selectedSauce.blendMode || 'normal',
                    opacity: selectedSauce.opacity || 0.96,
                  }}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: selectedSauce.opacity || 0.96, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* ========================================================
              LAYER 3 (z-30): Toppings Layers (Multi-select Stackable)
              Each topping is an independent transparent PNG layer
             ======================================================== */}
          <div className="absolute inset-0 z-30 pointer-events-none">
            <AnimatePresence>
              {TOPPINGS.map((topping) => {
                const isSelected = selectedToppings.includes(topping.id);
                if (!isSelected) return null;

                return (
                  <motion.img
                    key={topping.id}
                    src={topping.image}
                    alt={topping.name}
                    className="absolute inset-0 w-full h-full object-contain"
                    initial={{ opacity: 0, scale: 0.93, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.93, y: -8 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                  />
                );
              })}
            </AnimatePresence>
          </div>

          {/* ========================================================
              LAYER 4 (z-40): Spice Level Visual Effects Layer
              - Mild: None
              - Medium: Subtle pulsing red radial glow
              - Extra Hot: Rising steam trails + floating chili sparks + fierce fiery aura
             ======================================================== */}
          <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
            {/* Medium Heat: Soft ambient warmth wave */}
            {isMediumSpice && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-t from-orange-600/10 via-transparent to-transparent"
              />
            )}

            {/* Extra Hot: Animated Rising Steam Wisps */}
            {isExtraHotSpice && (
              <div className="absolute inset-0">
                {/* Steam trails */}
                <div className="absolute bottom-1/4 left-1/3 w-16 h-28 bg-gradient-to-t from-white/20 via-orange-300/15 to-transparent rounded-full blur-md steam-wisp-1" />
                <div className="absolute bottom-1/4 left-1/2 w-20 h-32 bg-gradient-to-t from-white/25 via-red-400/15 to-transparent rounded-full blur-md steam-wisp-2" />
                <div className="absolute bottom-1/4 right-1/3 w-16 h-28 bg-gradient-to-t from-white/20 via-amber-300/15 to-transparent rounded-full blur-md steam-wisp-3" />

                {/* Floating animated chili particles rising from the hot wings */}
                {chiliParticles.map((p) => (
                  <motion.div
                    key={p.id}
                    className="absolute text-sm select-none"
                    style={{ left: p.x, bottom: '35%' }}
                    initial={{ y: 0, opacity: 0, scale: 0.6 }}
                    animate={{
                      y: [-10, -75, -120],
                      opacity: [0, 0.9, 0],
                      scale: [0.7, 1.2, 0.8],
                      rotate: [-15, 25, -20],
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      delay: p.delay,
                      ease: 'easeInOut',
                    }}
                  >
                    🌶️
                  </motion.div>
                ))}

                {/* Fiery perimeter warning banner */}
                <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1.5 text-[10px] font-black text-red-400 bg-red-950/80 py-0.5 px-2 border-y border-red-500/30">
                  <Flame className="w-3 h-3 text-red-500 fill-red-500 animate-bounce" />
                  <span>تنبيه: أجنحة حارة جداً وناشفة من الحرارة!</span>
                  <Flame className="w-3 h-3 text-red-500 fill-red-500 animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Quick Active Layers Mini-Chips at bottom */}
          <div className="absolute bottom-2 left-2 right-2 z-50 flex items-center justify-center gap-1.5 flex-wrap pointer-events-none">
            {/* Sauce Chip */}
            <span
              className={`text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm backdrop-blur-md border ${
                selectedSauce.id === 'sauce_algeria'
                  ? 'bg-amber-500 text-zinc-950 border-amber-300'
                  : selectedSauce.id === 'sauce_none'
                  ? 'bg-zinc-800/90 text-zinc-300 border-zinc-700'
                  : 'bg-orange-600/90 text-white border-orange-400/40'
              }`}
            >
              {selectedSauce.name}
            </span>

            {/* Toppings count chip */}
            {selectedToppings.length > 0 && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-600/90 text-white border border-emerald-400/40 shadow-sm backdrop-blur-md">
                +{selectedToppings.length} توبينغ
              </span>
            )}

            {/* Spice Chip */}
            {selectedSpiceLevel.level > 0 && (
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-red-600/90 text-white border border-red-400/40 shadow-sm backdrop-blur-md">
                {selectedSpiceLevel.title}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
