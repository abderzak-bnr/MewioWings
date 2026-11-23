import React from 'react';
import { Sparkles, Flame, Check } from 'lucide-react';
import { WINGS_STYLES } from '../../data/menuData';

export const Step2WingsStyle = ({ selectedStyle, onSelectStyle }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-zinc-900 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold">
              2
            </span>
            طريقة التقديم (Style)
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            تحبها مقرمشة كرانشي أو مغرقة بالصوص الساخن؟
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {WINGS_STYLES.map((style) => {
          const isSelected = selectedStyle?.id === style.id;
          const isSaucy = style.id === 'saucy';

          return (
            <div
              key={style.id}
              onClick={() => onSelectStyle(style)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectStyle(style)}
              className={`relative text-right p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer overflow-hidden ${
                isSelected
                  ? isSaucy
                    ? 'border-orange-600 bg-orange-50/70 shadow-card ring-2 ring-orange-500/30 -translate-y-0.5'
                    : 'border-amber-500 bg-amber-50/70 shadow-card ring-2 ring-amber-500/30 -translate-y-0.5'
                  : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm'
              }`}
            >
              {/* Top Accent Icon & Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSaucy
                        ? 'bg-orange-100 text-orange-600'
                        : 'bg-amber-100 text-amber-600'
                    }`}
                  >
                    {isSaucy ? (
                      <Flame className="w-5 h-5 fill-orange-500/20" />
                    ) : (
                      <Sparkles className="w-5 h-5 fill-amber-500/20" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                      isSaucy
                        ? 'bg-orange-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {style.badge}
                  </span>
                </div>

                {/* Radio checkmark */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? isSaucy
                        ? 'bg-orange-600 text-white'
                        : 'bg-amber-500 text-white'
                      : 'border-2 border-zinc-300 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Title & details */}
              <div className="mb-1">
                <h3 className="text-base font-black text-zinc-900 font-tajawal">
                  {style.nameAr}
                </h3>
                <div className="text-xs font-semibold text-zinc-500">
                  {style.name}
                </div>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed mt-2">
                {style.description}
              </p>

              {/* Extra hint for saucy */}
              {isSaucy ? (
                <div className="mt-3 pt-2.5 border-t border-orange-200/60 flex items-center gap-1.5 text-[11px] font-bold text-orange-700">
                  <span>👈</span>
                  <span>المرحلة القادمة: تحديد صوص التغطية الساخن</span>
                </div>
              ) : (
                <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center gap-1.5 text-[11px] font-bold text-amber-800">
                  <span>✨</span>
                  <span>أقصى درجات القرمشة والكرانش الذهبي</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
