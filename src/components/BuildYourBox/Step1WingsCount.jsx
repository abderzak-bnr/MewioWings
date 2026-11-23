import React from 'react';
import { Check, Sparkles, Flame, Users } from 'lucide-react';
import { WINGS_COUNTS, formatDZD } from '../../data/menuData';

export const Step1WingsCount = ({ selectedWings, onSelectWings }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-zinc-900 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold">
              1
            </span>
            اختر عدد الأجنحة
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            كل حجم يتضمن صوصات ديب مجانية للتغميس
          </p>
        </div>
        <span className="text-xs font-bold px-2 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
          دجاج طازج 100% 🍗
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {WINGS_COUNTS.map((item) => {
          const isSelected = selectedWings?.id === item.id;

          return (
            <div
              key={item.id}
              onClick={() => onSelectWings(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectWings(item)}
              className={`relative text-right p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-brand-600 bg-brand-50/60 shadow-card ring-2 ring-brand-500/30 -translate-y-0.5'
                  : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm'
              }`}
            >
              {/* Badges on top */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {item.badge && (
                    <span
                      className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                        item.recommended
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-zinc-900 text-zinc-100'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    +{item.freeDips} صوص مجاني
                  </span>
                </div>

                {/* Selection Check Circle */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-brand-600 text-white'
                      : 'border-2 border-zinc-300 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Title & English name */}
              <div className="flex items-baseline justify-between mb-1">
                <h3 className="text-base font-black text-zinc-900 font-tajawal">
                  {item.title}
                </h3>
                <span className="text-base font-black text-brand-600">
                  {formatDZD(item.price)}
                </span>
              </div>

              <div className="text-[11px] text-zinc-400 font-medium mb-1.5">
                {item.titleEn}
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
