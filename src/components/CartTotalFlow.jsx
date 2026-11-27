import React, { useState, useEffect } from 'react';
import NumberFlow from '@number-flow/react';

export default function CartTotalFlow({ initialTotal = 0 }) {
  const [total, setTotal] = useState(() => {
    if (typeof window !== 'undefined' && typeof window.getWingoCartState === 'function') {
      const state = window.getWingoCartState();
      return state?.subtotal || 0;
    }
    return initialTotal;
  });

  useEffect(() => {
    const handleCartUpdate = (e) => {
      const subtotal = Number(e?.detail?.subtotal) || 0;
      setTotal(subtotal);
    };

    window.addEventListener('wingo-cart-updated', handleCartUpdate);
    return () => window.removeEventListener('wingo-cart-updated', handleCartUpdate);
  }, []);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        direction: 'ltr',
        fontVariantNumeric: 'tabular-nums',
        fontFamily: 'monospace, var(--font-cairo)',
        fontWeight: 900,
        fontSize: '13.5px',
        color: '#FFFFFF'
      }}
    >
      <NumberFlow
        value={total}
        suffix=" دج"
        style={{
          fontVariantNumeric: 'tabular-nums',
          direction: 'ltr'
        }}
      />
    </span>
  );
}
