import React from 'react';
import { Plus, Minus, Star, Check, Sparkles } from 'lucide-react';
import { DIP_SAUCES, MENU_RULES, formatDZD } from '../../data/menuData';

export const Step4Dips = ({
  freeDipsCount = 1,
  selectedDips = {}, // { [dipId]: quantity }
  onUpdateDipQuantity,
}) => {
  const totalSelectedDips = Object.values(selectedDips).reduce(
    (acc, q) => acc + (q || 0),
    0
  );

  const freeUsed = Math.min(totalSelectedDips, freeDipsCount);
  const freeRemaining = Math.max(0, freeDipsCount - totalSelectedDips);
  const paidDipsCount = Math.max(0, totalSelectedDips - freeDipsCount);
  const extraCost = paidDipsCount * MENU_RULES.extraDipPrice;

  return (
    <div className="space-y-4">
      {/* Step Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-zinc-900 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold">
              4
            </span>
            اختر الصوصات الجانبية (Dips)
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            للتغميس والاستمتاع بالقرمشة. يمكنك اختيار عدة أنواع وتكرار الكمية.
          </p>
        </div>
      </div>

      {/* Dynamic Dip Counter Status Banner */}
      <div className="p-3.5 rounded-2xl bg-zinc-900 text-white shadow-md border border-zinc-800">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-lg">🥣</span>
            <div>
              <div className="font-extrabold text-white">
                حالة الصوصات: {totalSelectedDips} صوص مختار
              </div>
              <div className="text-[11px] text-zinc-400">
                {freeRemaining > 0 ? (
                  <span className="text-emerald-400 font-semibold">
                    متبقي لك {freeRemaining} صوص مجاني مشمول مع البوكس
                  </span>
                ) : (
                  <span className="text-zinc-300">
                    تم استهلاك {freeDipsCount} صوص مجاني مشمول
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-left">
            {paidDipsCount > 0 ? (
              <span className="inline-block px-2.5 py-1 rounded-lg bg-brand-600/90 text-white text-xs font-black shadow-sm">
                +{paidDipsCount} إضافي ({formatDZD(extraCost)})
              </span>
            ) : (
              <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                مشمول مجاناً ✨
              </span>
            )}
          </div>
        </div>

        {/* Free Dip Tracker Dots */}
        <div className="mt-2.5 pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
          <span>الصوصات المجانية ({freeDipsCount}):</span>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: freeDipsCount }).map((_, index) => {
              const isFilled = index < freeUsed;
              return (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full flex items-center justify-center transition-all ${
                    isFilled
                      ? 'bg-emerald-400 ring-2 ring-emerald-400/30'
                      : 'border border-zinc-600 bg-zinc-800'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Dips Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {DIP_SAUCES.map((dip) => {
          const qty = selectedDips[dip.id] || 0;
          const isSelected = qty > 0;
          const isSignature = dip.isSignature;

          return (
            <div
              key={dip.id}
              className={`p-3 rounded-2xl border-2 transition-all duration-200 text-right flex items-center justify-between gap-3 ${
                isSelected
                  ? isSignature
                    ? 'border-amber-500 bg-amber-50/70 shadow-sm'
                    : 'border-brand-500 bg-brand-50/60 shadow-sm'
                  : 'border-zinc-200 bg-white hover:border-zinc-300'
              }`}
            >
              {/* Dip Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h4 className="text-sm font-bold text-zinc-900 truncate">
                    {dip.name}
                  </h4>
                  {isSignature && (
                    <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-amber-500 text-white shrink-0">
                      ⭐ مميز
                    </span>
                  )}
                  {dip.heatLevel > 0 && !isSignature && (
                    <span className="text-[10px] text-red-500 shrink-0">
                      {'🌶️'.repeat(Math.min(dip.heatLevel, 2))}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-zinc-500 truncate">
                  {dip.nameAr}
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">
                  {MENU_RULES.extraDipPrice} {formatDZD(MENU_RULES.extraDipPrice)} بعد المجاني
                </div>
              </div>

              {/* Counter Controls */}
              <div className="flex items-center gap-2 shrink-0 bg-zinc-100 p-1 rounded-xl border border-zinc-200/80">
                <button
                  type="button"
                  onClick={() => onUpdateDipQuantity(dip.id, Math.max(0, qty - 1))}
                  disabled={qty === 0}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    qty > 0
                      ? 'bg-white text-zinc-800 shadow-sm hover:bg-zinc-200 active:scale-95'
                      : 'text-zinc-300 cursor-not-allowed'
                  }`}
                  aria-label={`إنقاص ${dip.name}`}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <span className="w-5 text-center text-xs font-black text-zinc-900">
                  {qty}
                </span>

                <button
                  type="button"
                  onClick={() => onUpdateDipQuantity(dip.id, qty + 1)}
                  className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center shadow-sm hover:bg-brand-700 active:scale-95 transition-all"
                  aria-label={`زيادة ${dip.name}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
