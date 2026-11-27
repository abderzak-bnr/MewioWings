import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

export default function FloatingCartIsland() {
  const [itemCount, setItemCount] = useState(() => {
    if (typeof window !== 'undefined' && typeof window.getWingoCartState === 'function') {
      const state = window.getWingoCartState();
      return state?.count || 0;
    }
    return 0;
  });

  const [bounceTrigger, setBounceTrigger] = useState(0);
  const [popKey, setPopKey] = useState(0);
  const prevCountRef = useRef(itemCount);
  const shouldReduceMotion = useReducedMotion();

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
      setItemCount(count);
    };

    const handleItemAdded = () => {
      // Haptic feedback
      try {
        if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
          navigator.vibrate(15);
        }
      } catch (err) {
        // Ignore vibration errors on unsupported devices
      }

      // Trigger button bounce and +1 floating badge
      setBounceTrigger((prev) => prev + 1);
      setPopKey((prev) => prev + 1);
    };

    window.addEventListener('wingo-cart-updated', handleCartUpdate);
    window.addEventListener('wingo-item-added', handleItemAdded);

    return () => {
      window.removeEventListener('wingo-cart-updated', handleCartUpdate);
      window.removeEventListener('wingo-item-added', handleItemAdded);
    };
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== 'undefined' && typeof window.openOrderDrawer === 'function') {
      window.openOrderDrawer();
    }
  };

  const springTransition = shouldReduceMotion
    ? { duration: 0.1 }
    : { type: 'spring', stiffness: 400, damping: 26 };

  return (
    <div
      className="fixed left-4 z-50 pointer-events-none select-none"
      style={{
        bottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.div
            layout
            initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0, opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0, opacity: 0, y: 20 }}
            transition={springTransition}
            className="relative pointer-events-auto"
          >
            {/* Floating +1 Pop Badge */}
            <AnimatePresence>
              {popKey > 0 && !shouldReduceMotion && (
                <motion.span
                  key={popKey}
                  initial={{ opacity: 0, y: 0, scale: 0.8 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    y: -22,
                    scale: [0.8, 1.15, 1, 0.9],
                  }}
                  transition={{
                    duration: 0.8,
                    ease: 'easeOut',
                    times: [0, 0.2, 0.7, 1],
                  }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[11px] font-black px-1.5 py-0.5 rounded-full shadow-lg pointer-events-none z-20 leading-none"
                >
                  +1
                </motion.span>
              )}
            </AnimatePresence>

            {/* Circular Floating Cart Button (FAB: 56px x 56px) */}
            <motion.button
              type="button"
              key={bounceTrigger > 0 && !shouldReduceMotion ? `bounce-${bounceTrigger}` : 'idle'}
              animate={
                bounceTrigger > 0 && !shouldReduceMotion
                  ? { scale: [1, 1.18, 1] }
                  : { scale: 1 }
              }
              transition={{ duration: 0.35, ease: 'easeOut' }}
              whileTap={{ scale: 0.92 }}
              onClick={handleClick}
              className="w-14 h-14 rounded-full bg-[#1C1411] border-2 border-[#F97316] text-[#FFF8F0] shadow-[0_10px_25px_rgba(0,0,0,0.4)] flex items-center justify-center relative cursor-pointer outline-none focus:outline-none focus:ring-2 focus:ring-[#F97316]/50 active:border-[#EA580C] transition-colors"
              aria-label={`عرض سلة الطلبات (${itemCount} وجبات)`}
            >
              {/* Shopping Bag Icon */}
              <ShoppingBag className="w-6 h-6 text-[#F97316] stroke-[2.3]" />

              {/* Crisp Circular Item Count Badge */}
              <span className="absolute -top-1.5 -right-1.5 bg-[#F97316] text-white text-[11px] font-black min-w-[22px] h-[22px] px-1 rounded-full flex items-center justify-center shadow-md border-2 border-[#1C1411] leading-none">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
