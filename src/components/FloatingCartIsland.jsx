import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NumberFlow from '@number-flow/react';
import { ShoppingBag, Check, ArrowLeft } from 'lucide-react';

export default function FloatingCartIsland() {
  const [itemCount, setItemCount] = useState(() => {
    if (typeof window !== 'undefined' && typeof window.getWingoCartState === 'function') {
      const state = window.getWingoCartState();
      return state?.count || 0;
    }
    return 0;
  });

  const [totalPrice, setTotalPrice] = useState(() => {
    if (typeof window !== 'undefined' && typeof window.getWingoCartState === 'function') {
      const state = window.getWingoCartState();
      return state?.subtotal || 0;
    }
    return 0;
  });

  const [justAdded, setJustAdded] = useState(false);
  const prevCountRef = useRef(itemCount);
  const timerRef = useRef(null);

  // Sync container class with cart existence
  useEffect(() => {
    const storefront = document.getElementById('customer-storefront');
    if (storefront) {
      if (itemCount > 0) {
        storefront.classList.add('has-floating-cart');
      } else {
        storefront.classList.remove('has-floating-cart');
      }
    }
  }, [itemCount]);

  useEffect(() => {
    const handleCartUpdate = (e) => {
      const count = Number(e?.detail?.count) || 0;
      const subtotal = Number(e?.detail?.subtotal) || 0;
      setItemCount(count);
      setTotalPrice(subtotal);
    };

    const handleItemAdded = () => {
      // Haptic feedback
      try {
        if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
          navigator.vibrate(15);
        }
      } catch (err) {
        // Ignore vibration errors
      }

      setJustAdded(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setJustAdded(false);
      }, 1400);
    };

    window.addEventListener('wingo-cart-updated', handleCartUpdate);
    window.addEventListener('wingo-item-added', handleItemAdded);

    return () => {
      window.removeEventListener('wingo-cart-updated', handleCartUpdate);
      window.removeEventListener('wingo-item-added', handleItemAdded);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== 'undefined' && typeof window.openOrderDrawer === 'function') {
      window.openOrderDrawer();
    }
  };

  return (
    <div
      className="fixed inset-x-0 bottom-5 z-50 flex justify-center px-4 pointer-events-none"
      style={{ direction: 'rtl' }}
    >
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.div
            layout
            initial={{ y: 80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            onClick={handleClick}
            className="pointer-events-auto cursor-pointer select-none bg-[#1C1411]/95 backdrop-blur-md border border-[#FFF8F0]/15 text-[#FFF8F0] rounded-full shadow-[0_14px_34px_rgba(0,0,0,0.45)] px-3.5 py-2.5 flex items-center justify-between gap-3 w-full max-w-[360px] active:scale-[0.98] transition-transform duration-100"
            role="button"
            aria-label="عرض سلة الطلبات وإتمام الشراء"
          >
            {/* Right section in RTL (Icon + Text) */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex-shrink-0">
                <motion.div
                  key={justAdded ? 'check' : 'cart'}
                  initial={{ scale: 0.7, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white shadow-sm ${
                    justAdded ? 'bg-emerald-500' : 'bg-[#F97316]'
                  }`}
                >
                  {justAdded ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <ShoppingBag className="w-4.5 h-4.5 stroke-[2.2]" />
                  )}
                </motion.div>
                {!justAdded && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-[#1C1411] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md border border-[#1C1411]/20">
                    {itemCount}
                  </span>
                )}
              </div>

              <div className="flex flex-col text-right truncate">
                {justAdded ? (
                  <span className="text-[13px] font-black text-emerald-400">
                    تمت الإضافة للسلة!
                  </span>
                ) : (
                  <>
                    <span className="text-[11px] text-[#FFF8F0]/70 font-medium">عرض السلة</span>
                    <span
                      className="text-[14px] font-black text-[#FFF8F0] tracking-tight"
                      style={{ direction: 'ltr', display: 'inline-flex', alignItems: 'center' }}
                    >
                      <NumberFlow
                        value={totalPrice}
                        suffix=" دج"
                        className="font-mono"
                        style={{
                          fontVariantNumeric: 'tabular-nums',
                          direction: 'ltr',
                          fontFamily: 'monospace, var(--font-cairo)'
                        }}
                      />
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Left section in RTL (CTA Button) */}
            <div className="flex items-center gap-1 bg-[#F97316] hover:bg-[#EA580C] text-white text-[12px] font-black px-3.5 py-2 rounded-full shadow-sm transition-colors flex-shrink-0">
              <span>إتمام الطلب</span>
              <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
