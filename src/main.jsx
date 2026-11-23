import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminDashboard from './admin/AdminDashboard';
import { supabase } from './lib/supabase';
import './index.css';

// Expose supabase globally for customer storefront script
window.supabase = supabase;

const path = window.location.pathname;

if (path.startsWith('/admin')) {
  // Hide customer storefront completely
  const storefront = document.getElementById('customer-storefront');
  if (storefront) {
    storefront.style.display = 'none';
  }

  // Show admin container and mount AdminDashboard
  const adminRoot = document.getElementById('admin-root');
  if (adminRoot) {
    adminRoot.style.display = 'block';
    ReactDOM.createRoot(adminRoot).render(
      <React.StrictMode>
        <AdminDashboard />
      </React.StrictMode>
    );
  }
} else {
  // Inform storefront script that Supabase is ready
  window.dispatchEvent(new CustomEvent('supabase-ready', { detail: supabase }));
  if (typeof window.initSupabaseStorefront === 'function') {
    window.initSupabaseStorefront();
  }
}
