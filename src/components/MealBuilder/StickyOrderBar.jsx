import React from 'react';
import { ShoppingBag, ArrowLeft, Sparkles, MapPin } from 'lucide-react';
import { formatDZD, RESTAURANT_INFO } from '../../data/wingsConfig';

export const StickyOrderBar = ({ totalPrice, onOpenOrder }) => {
  return (
    <aside 
      aria-label="شريط الطلب السريع"
      className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 bg-gradient-to-t from-black via-zinc-950/90 to-transparent pointer-events-none"
    >
      <div className="max-w-md mx-auto pointer-events-auto">
        <button
          type="button"
          onClick={onOpenOrder}
          className="w-full bg-zinc-900 text-white rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-zinc-700/80 flex items-center justify-between gap-3 active:scale-[0.98] transition-all duration-200 hover:bg-zinc-850 group"
          aria-label="عرض ملخص الوجبة وإتمام الطلب"
        >
          {/* Price & Location info */}
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center shadow-md">
              <ShoppingBag className="w-5 h-5" />
            </div>

            <div className="text-right">
              <div className="text-[10px] text-zinc-400 flex items-center gap-1 font-medium">
                <MapPin className="w-2.5 h-2.5 text-brand-500" />
                <span>{RESTAURANT_INFO.city} 🇩🇿 • جاهز للطلب</span>
              </div>
              <div className="text-lg font-black text-white font-tajawal leading-tight">
                {formatDZD(totalPrice)}
              </div>
            </div>
          </div>

          {/* CTA Label */}
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-black text-xs sm:text-sm shadow-glow group-hover:from-brand-500 group-hover:to-brand-600 transition-all">
            <span>أضف للطلب</span>
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </div>
        </button>
      </div>
    </aside>
  );
};
