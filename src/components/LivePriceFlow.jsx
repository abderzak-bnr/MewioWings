import React, { useState, useEffect } from 'react';
import NumberFlow from '@number-flow/react';

export default function LivePriceFlow({ initialPrice = 850 }) {
  const [price, setPrice] = useState(() => {
    if (typeof window !== 'undefined' && typeof window.getCurrentMealPrice === 'function') {
      const current = window.getCurrentMealPrice();
      if (typeof current?.price === 'number') return current.price;
    }
    return initialPrice;
  });

  const [status, setStatus] = useState(() => {
    if (typeof window !== 'undefined' && typeof window.getCurrentMealPrice === 'function') {
      const current = window.getCurrentMealPrice();
      if (current?.status) return current.status;
    }
    return 'available';
  });

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e?.detail) {
        if (typeof e.detail.price === 'number') {
          setPrice(e.detail.price);
        }
        if (e.detail.status) {
          setStatus(e.detail.status);
        }
      }
    };

    window.addEventListener('wingo-live-price-update', handleUpdate);
    return () => window.removeEventListener('wingo-live-price-update', handleUpdate);
  }, []);

  if (status === 'closed') {
    return <span style={{ fontSize: '13px', fontWeight: 800 }}>المطعم مغلق</span>;
  }

  if (status === 'unavailable') {
    return <span style={{ fontSize: '13px', fontWeight: 800 }}>غير متوفر</span>;
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        direction: 'ltr',
        fontVariantNumeric: 'tabular-nums',
        fontFamily: 'monospace, var(--font-cairo)',
        fontWeight: 900,
        fontSize: '15px'
      }}
    >
      <NumberFlow
        value={price}
        suffix=" دج"
        style={{
          fontVariantNumeric: 'tabular-nums',
          direction: 'ltr'
        }}
      />
    </span>
  );
}
