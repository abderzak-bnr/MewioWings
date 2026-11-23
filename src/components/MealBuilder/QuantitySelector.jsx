import React from 'react';
import { Check, Flame, Users, Sparkles } from 'lucide-react';
import { WINGS_QUANTITIES, formatDZD } from '../../data/wingsConfig';

export const QuantitySelector = ({ selectedQuantity, onSelectQuantity }) => {
  return (
    <section className="space-y-3" aria-labelledby="section-quantity">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-black">
            1
          </span>
          <h3 id="section-quantity" className="text-base sm:text-lg font-black text-white font-tajawal">
            اختر عدد قطع الأجنحة
          </h3>
        </div>
        <span className="text-[11px] font-bold text-zinc-400">
          دجاج طازج 100% يومياً
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {WINGS_QUANTITIES.map((qty) => {
          const isSelected = selectedQuantity.id === qty.id;

          return (
            <button
              key={qty.id}
              type="button"
              onClick={() => onSelectQuantity(qty)}
              className={`relative text-right p-3.5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-brand-500 bg-brand-950/40 shadow-glow ring-1 ring-brand-500/50 scale-[1.01]'
                  : 'border-zinc-800 bg-zinc-900/90 hover:border-zinc-700 hover:bg-zinc-800/60'
              }`}
            >
              {/* Header row with badge and check */}
              <div className="flex items-center justify-between w-full mb-2">
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    qty.recommended
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-zinc-800 text-zinc-300'
                  }`}
                >
                  {qty.badge}
                </span>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'border border-zinc-700 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Title & Price */}
              <div>
                <h4 className="text-base font-black text-white font-tajawal">
                  {qty.title}
                </h4>
                <div className="text-[11px] text-zinc-400 font-medium">
                  {qty.titleEn}
                </div>
              </div>

              {/* Price and calories */}
              <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between w-full">
                <span className="text-base font-black text-brand-400 font-tajawal">
                  {formatDZD(qty.price)}
                </span>
                <span className="text-[10px] text-zinc-500">
                  {qty.calories}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
