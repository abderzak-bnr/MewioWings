import React from 'react';
import { Check, Plus, Layers } from 'lucide-react';
import { TOPPINGS, formatDZD } from '../../data/wingsConfig';

export const ToppingsSelector = ({ selectedToppings, onToggleTopping }) => {
  return (
    <section className="space-y-3" aria-labelledby="section-toppings">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF7A00] text-white text-xs font-black">
            3
          </span>
          <h3 id="section-toppings" className="text-base sm:text-lg font-black text-[#FFF8F0] font-tajawal">
            إضافات التوبينغ (Toppings) — اختيار متعدد
          </h3>
        </div>
        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60">
          تتراكم فوق بعضها 🥞
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {TOPPINGS.map((topping) => {
          const isSelected = selectedToppings.includes(topping.id);

          return (
            <button
              key={topping.id}
              type="button"
              onClick={() => onToggleTopping(topping.id)}
              className={`relative text-right p-3.5 rounded-2xl border-2 transition-transform duration-100 cursor-pointer flex items-center justify-between gap-3 active:scale-95 will-change-transform select-none ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-950/30 shadow-sm ring-1 ring-emerald-500/50 scale-[1.01]'
                  : 'border-[#3A2822] bg-[#211A17] hover:border-[#FF7A00]/50 hover:bg-[#2C221F]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl shrink-0 p-2 rounded-xl bg-[#2C221F] border border-[#3A2822]">
                  {topping.icon}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-sm font-black text-[#FFF8F0] font-tajawal truncate">
                      {topping.name}
                    </h4>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#2C221F] text-[#B8A99A]">
                      {topping.badge}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#B8A99A] font-medium">
                    {topping.nameEn}
                  </div>

                  <div className="text-xs font-black text-[#FF7A00] mt-1">
                    +{formatDZD(topping.price)}
                  </div>
                </div>
              </div>

              {/* Toggle Indicator */}
              <div
                className={`w-6 h-6 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  isSelected
                    ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                    : 'border border-[#3A2822] text-[#B8A99A] bg-[#2C221F]'
                }`}
              >
                {isSelected ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
