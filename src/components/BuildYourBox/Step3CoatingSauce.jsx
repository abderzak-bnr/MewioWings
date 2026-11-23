import React, { useState } from 'react';
import { Flame, Check, Info, Star } from 'lucide-react';
import { COATING_SAUCES } from '../../data/menuData';

export const Step3CoatingSauce = ({
  selectedSauce,
  onSelectSauce,
  isCrispyStyle,
}) => {
  const [activeTooltip, setActiveTooltip] = useState(null);

  if (isCrispyStyle) {
    return (
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-right">
        <div className="flex items-center gap-2.5 text-amber-900 font-bold text-sm mb-1">
          <span className="text-xl">✨</span>
          <span>تم تخطي هذه الخطوة تلقائياً</span>
        </div>
        <p className="text-xs text-amber-800 leading-relaxed">
          اخترت نمط <strong>Crispy Wings (الأجنحة المقرمشة)</strong> بدون تغطية.
          سيتم تقديم أجنحتك مقرمشة وذهبية بدون صوص تغطية، ويمكنك اختيار صوصات الديب للتغميس في الخطوة التالية.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-zinc-900 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold">
              3
            </span>
            اختر صوص التغطية (Coating Sauce)
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            يتم تقليب الأجنحة بالكامل في الصوص الساخن من اختيارك
          </p>
        </div>
        <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
          مطلوب لـ Saucy 🔥
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {COATING_SAUCES.map((sauce) => {
          const isSelected = selectedSauce?.id === sauce.id;
          const isSignature = sauce.isSignature;

          return (
            <div
              key={sauce.id}
              onClick={() => onSelectSauce(sauce)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectSauce(sauce)}
              className={`relative text-right p-3.5 rounded-2xl border-2 transition-all duration-200 cursor-pointer overflow-hidden ${
                isSelected
                  ? isSignature
                    ? 'border-amber-500 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/50 shadow-gold-glow ring-2 ring-amber-400'
                    : 'border-brand-600 bg-brand-50/70 shadow-card ring-2 ring-brand-500/30'
                  : isSignature
                  ? 'border-amber-300/80 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 hover:border-amber-400 shadow-sm'
                  : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm'
              }`}
            >
              {/* Signature badge if applicable */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  {isSignature ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm tracking-wide">
                      <Star className="w-3 h-3 fill-white" />
                      {sauce.signatureBadge}
                    </span>
                  ) : sauce.heatLevel > 0 ? (
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                      {'🌶️'.repeat(sauce.heatLevel)}
                      <span className="text-[10px] mr-1">حرارة</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                      حلاوة ونكهة
                    </span>
                  )}
                </div>

                {/* Checkbox circle */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? isSignature
                        ? 'bg-amber-600 text-white'
                        : 'bg-brand-600 text-white'
                      : 'border-2 border-zinc-300 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Title & names */}
              <div className="mb-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-zinc-900 font-tajawal flex items-center gap-1.5">
                    {sauce.name}
                  </h3>
                </div>
                <div className="text-[11px] text-zinc-500 font-semibold">
                  {sauce.nameAr} • {sauce.nameFr}
                </div>
              </div>

              {/* Description */}
              <p
                className={`text-xs leading-relaxed mt-1.5 ${
                  isSignature ? 'text-amber-950 font-medium' : 'text-zinc-600'
                }`}
              >
                {sauce.description}
              </p>

              {/* Signature extra notice */}
              {isSignature && (
                <div className="mt-2 pt-2 border-t border-amber-200/80 flex items-center gap-1 text-[11px] font-bold text-amber-800">
                  <span>🇩🇿</span>
                  <span>الوصفة الأكثر طلباً في المحل — متوازنة ومميزة</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
