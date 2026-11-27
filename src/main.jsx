import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { supabase } from './lib/supabase';
import LivePriceFlow from './components/LivePriceFlow';
import CartTotalFlow from './components/CartTotalFlow';
import './index.css';

// Lazy-load AdminDashboard so customer storefront never downloads admin code
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));

// Expose supabase globally for customer storefront script
window.supabase = supabase;

const path = window.location.pathname;

if (path.startsWith('/admin')) {
  // Hide customer storefront completely
  const storefront = document.getElementById('customer-storefront');
  if (storefront) {
    storefront.style.display = 'none';
  }

  // Show admin container and mount AdminDashboard with Suspense fallback
  const adminRoot = document.getElementById('admin-root');
  if (adminRoot) {
    adminRoot.style.display = 'block';
    ReactDOM.createRoot(adminRoot).render(
      <React.StrictMode>
        <Suspense fallback={
          <div style={{
            minHeight: '100vh',
            backgroundColor: '#14100E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Cairo', sans-serif",
            color: '#FFF8F0',
            direction: 'rtl'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '44px',
                height: '44px',
                border: '3px solid rgba(255,122,0,0.2)',
                borderTopColor: '#FF7A00',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 16px'
              }} />
              <div style={{ fontSize: '15px', fontWeight: 800 }}>جارٍ تحميل لوحة التحكم...</div>
            </div>
          </div>
        }>
          <AdminDashboard />
        </Suspense>
      </React.StrictMode>
    );
  }
} else {
  // Mount Live Price Flow into Add-to-Cart Button
  const ctaPriceEl = document.getElementById('ctaPriceText');
  if (ctaPriceEl) {
    ReactDOM.createRoot(ctaPriceEl).render(
      <React.StrictMode>
        <LivePriceFlow />
      </React.StrictMode>
    );
  }

  // Mount Cart Total Flow into Split Cart Button
  const splitPriceEl = document.getElementById('splitCartPriceText');
  if (splitPriceEl) {
    ReactDOM.createRoot(splitPriceEl).render(
      <React.StrictMode>
        <CartTotalFlow />
      </React.StrictMode>
    );
  }

  // Inform storefront script that Supabase is ready
  window.dispatchEvent(new CustomEvent('supabase-ready', { detail: supabase }));
  if (typeof window.initSupabaseStorefront === 'function') {
    window.initSupabaseStorefront();
  }
}
