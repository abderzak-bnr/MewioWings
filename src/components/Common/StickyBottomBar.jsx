import React from 'react';
import { ShoppingBag, ArrowLeft, ChevronUp } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatDZD } from '../../data/menuData';

export const StickyBottomBar = ({ activeTab, onOpenCart }) => {
  const { cartCount, subtotal, setIsCartOpen } = useCart();

  if (cartCount === 0) return null;

  return (
    <aside 
      aria-label="شريط السلة العائم" 
      className="fixed bottom-0 left-0 right-0 z-30 p-3 sm:p-4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"
    >
      <div className="max-w-md mx-auto pointer-events-auto">
        <button
          onClick={() => setIsCartOpen(true)}
          className="w-full bg-zinc-950 text-white rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-zinc-800 flex items-center justify-between gap-3 active:scale-[0.98] transition-all duration-200 hover:bg-zinc-900 group"
          aria-label="عرض تفاصيل السلة والطلب"
        >
          {/* Cart Icon & Count */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center shadow-md">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 bg-white text-zinc-950 font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                {cartCount}
              </span>
            </div>

            <div className="text-right">
              <div className="text-[11px] text-zinc-400 font-medium">
                {cartCount} {cartCount === 1 ? 'عنصر في السلة' : 'عناصر في السلة'}
              </div>
              <div className="text-base font-black text-white font-tajawal">
                {formatDZD(subtotal)}
              </div>
            </div>
          </div>

          {/* CTA Button Label */}
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-black text-xs sm:text-sm shadow-md group-hover:from-brand-500 group-hover:to-brand-600 transition-all">
            <span>متابعة الطلب</span>
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </div>
        </button>
      </div>
    </aside>
  );
};
