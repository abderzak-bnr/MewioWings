import React from 'react';
import { Plus, Minus, Sparkles, Check } from 'lucide-react';
import { SIDES_AND_EXTRAS, formatDZD } from '../../data/menuData';

export const Step5Sides = ({
  selectedSides = {}, // { [sideId]: quantity }
  onUpdateSideQuantity,
}) => {
  // Filter for upsell sides (e.g., fries, sides, extras)
  const upsellItems = SIDES_AND_EXTRAS.filter(
    (item) => item.category === 'fries' || item.category === 'sides' || item.id === 'side_extra_cheese' || item.id === 'side_extra_wings_3'
  );

  const totalSelectedSidesCount = Object.values(selectedSides).reduce(
    (acc, q) => acc + (q || 0),
    0
  );

  const sidesTotalCost = Object.entries(selectedSides).reduce((acc, [id, qty]) => {
    const item = SIDES_AND_EXTRAS.find((s) => s.id === id);
    return acc + (item ? item.price * (qty || 0) : 0);
  }, 0);

  return (
    <div className="space-y-4">
      {/* Step Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-zinc-900 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold">
              5
            </span>
            إضافات جانبية وسناك (اختياري)
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            كمّل وجبتك ببطاطا مقرمشة، صوص جبن ذائب أو كول سلو منعش
          </p>
        </div>

        {totalSelectedSidesCount > 0 && (
          <span className="text-xs font-black px-2.5 py-1 rounded-full bg-brand-100 text-brand-800 border border-brand-200">
            +{formatDZD(sidesTotalCost)}
          </span>
        )}
      </div>

      {/* Sides Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {upsellItems.map((item) => {
          const qty = selectedSides[item.id] || 0;
          const isSelected = qty > 0;

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border-2 transition-all duration-200 text-right flex items-center justify-between gap-3 ${
                isSelected
                  ? 'border-brand-500 bg-brand-50/70 shadow-sm'
                  : 'border-zinc-200 bg-white hover:border-zinc-300'
              }`}
            >
              {/* Item Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                  <h4 className="text-sm font-bold text-zinc-900 truncate">
                    {item.nameAr}
                  </h4>
                  {item.isPopular && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-700">
                      محبوب 🔥
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-zinc-400 font-medium truncate">
                  {item.name}
                </div>
                <div className="text-xs font-black text-brand-600 mt-1">
                  {formatDZD(item.price)}
                </div>
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center gap-2 shrink-0 bg-zinc-100 p-1 rounded-xl border border-zinc-200/80">
                <button
                  type="button"
                  onClick={() => onUpdateSideQuantity(item.id, Math.max(0, qty - 1))}
                  disabled={qty === 0}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    qty > 0
                      ? 'bg-white text-zinc-800 shadow-sm hover:bg-zinc-200 active:scale-95'
                      : 'text-zinc-300 cursor-not-allowed'
                  }`}
                  aria-label={`إنقاص ${item.nameAr}`}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <span className="w-5 text-center text-xs font-black text-zinc-900">
                  {qty}
                </span>

                <button
                  type="button"
                  onClick={() => onUpdateSideQuantity(item.id, qty + 1)}
                  className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center shadow-sm hover:bg-brand-700 active:scale-95 transition-all"
                  aria-label={`زيادة ${item.nameAr}`}
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
