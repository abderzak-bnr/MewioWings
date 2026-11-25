import React from 'react';
import { Check, Flame, Users, Sparkles } from 'lucide-react';
import { WINGS_QUANTITIES, formatDZD } from '../../data/wingsConfig';

export const QuantitySelector = ({ selectedQuantity, onSelectQuantity }) => {
  return (
    <section className="space-y-3" aria-labelledby="section-quantity">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF7A00] text-white text-xs font-black">
            1
          </span>
          <h3 id="section-quantity" className="text-base sm:text-lg font-black text-[#FFF8F0] font-tajawal">
            اختر عدد قطع الأجنحة
          </h3>
        </div>
        <span className="text-[11px] font-bold text-[#B8A99A]">
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
              className={`relative text-right p-3.5 rounded-2xl border-2 transition-transform duration-100 cursor-pointer flex flex-col justify-between active:scale-95 will-change-transform select-none ${
                isSelected
                  ? 'border-[#FF7A00] bg-[#FF7A00]/15 shadow-glow ring-1 ring-[#FF7A00]/50 scale-[1.01]'
                  : 'border-[#3A2822] bg-[#211A17] hover:border-[#FF7A00]/50 hover:bg-[#2C221F]'
              }`}
            >
              {/* Header row with badge and check */}
              <div className="flex items-center justify-between w-full mb-2">
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    qty.recommended
                      ? 'bg-[#FF7A00] text-white shadow-sm'
                      : 'bg-[#2C221F] text-[#B8A99A]'
                  }`}
                >
                  {qty.badge}
                </span>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#FF7A00] text-white shadow-sm'
                      : 'border border-[#3A2822] text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Title & Price */}
              <div>
                <h4 className="text-base font-black text-[#FFF8F0] font-tajawal">
                  {qty.title}
                </h4>
                <div className="text-[11px] text-[#B8A99A] font-medium">
                  {qty.titleEn}
                </div>
              </div>

              {/* Price and calories */}
              <div className="mt-3 pt-2 border-t border-[#3A2822] flex items-center justify-between w-full">
                <span className="text-base font-black text-[#FF7A00] font-tajawal">
                  {formatDZD(qty.price)}
                </span>
                <span className="text-[10px] text-[#B8A99A]">
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
