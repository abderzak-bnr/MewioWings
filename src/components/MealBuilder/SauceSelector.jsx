import React from 'react';
import { Check, Star, Sparkles } from 'lucide-react';
import { SAUCES, formatDZD } from '../../data/wingsConfig';

export const SauceSelector = ({ selectedSauce, onSelectSauce }) => {
  return (
    <section className="space-y-3" aria-labelledby="section-sauce">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF7A00] text-white text-xs font-black">
            2
          </span>
          <h3 id="section-sauce" className="text-base sm:text-lg font-black text-[#FFF8F0] font-tajawal">
            اختر صوص التغطية (Sauce Glaze)
          </h3>
        </div>
        <span className="text-[11px] font-bold text-[#FF7A00] bg-[#FF7A00]/15 px-2 py-0.5 rounded-full border border-[#FF7A00]/30">
          تغطية كاملة ولامعة ✨
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {SAUCES.map((sauce) => {
          const isSelected = selectedSauce.id === sauce.id;
          const isSignature = sauce.isSignature;

          return (
            <button
              key={sauce.id}
              type="button"
              onClick={() => onSelectSauce(sauce)}
              className={`relative text-right p-3.5 rounded-2xl border-2 transition-transform duration-100 cursor-pointer flex items-start justify-between gap-3 active:scale-95 will-change-transform select-none ${
                isSelected
                  ? isSignature
                    ? 'border-amber-400 bg-amber-500/20 shadow-gold-glow ring-1 ring-amber-400/60 scale-[1.01]'
                    : 'border-[#FF7A00] bg-[#FF7A00]/20 shadow-glow ring-1 ring-[#FF7A00]/50 scale-[1.01]'
                  : isSignature
                  ? 'border-amber-500/40 bg-[#211A17] hover:border-amber-500/70 hover:bg-[#2C221F]'
                  : 'border-[#3A2822] bg-[#211A17] hover:border-[#FF7A00]/50 hover:bg-[#2C221F]'
              }`}
            >
              <div className="flex-1 min-w-0">
                {/* Header row with color pill & badges */}
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {/* Color dot */}
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0 shadow-sm"
                    style={{ backgroundColor: sauce.dotColor }}
                  />

                  <h4 className="text-sm font-black text-[#FFF8F0] font-tajawal truncate">
                    {sauce.name}
                  </h4>

                  {isSignature && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-sm">
                      <Star className="w-2.5 h-2.5 fill-zinc-950" />
                      {sauce.signatureBadge}
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-[#B8A99A] font-medium mb-1 truncate">
                  {sauce.nameEn}
                </div>

                <p className="text-[11px] text-[#B8A99A] leading-relaxed line-clamp-2">
                  {sauce.description}
                </p>

                {sauce.price > 0 && (
                  <div className="text-[11px] font-bold text-[#FF7A00] mt-1.5">
                    +{formatDZD(sauce.price)}
                  </div>
                )}
              </div>

              {/* Selection Checkbox */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  isSelected
                    ? isSignature
                      ? 'bg-amber-400 text-zinc-950 shadow-sm'
                      : 'bg-[#FF7A00] text-white shadow-sm'
                    : 'border border-[#3A2822] text-transparent'
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
