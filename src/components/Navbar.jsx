import React from 'react';
import { ShoppingBag, Flame, Sparkles, Clock, MapPin, ChevronLeft } from 'lucide-react';
import { RESTAURANT_INFO, formatDZD } from '../data/menuData';
import { useCart } from '../context/CartContext';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { cartCount, subtotal, setIsCartOpen } = useCart();

  const navTabs = [
    {
      id: 'build',
      label: 'اصنع بوكسك',
      labelEn: 'Build Your Box',
      icon: '🍗',
      badge: 'تخصيص كامل',
    },
    {
      id: 'boxes',
      label: 'البوكسات الجاهزة',
      labelEn: 'Ready Boxes',
      icon: '🔥',
      badge: 'عروض كومبو',
    },
    {
      id: 'sides',
      label: 'الإضافات والصوصات',
      labelEn: 'Sides & Dips',
      icon: '🍟',
      badge: null,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-zinc-950 text-white shadow-lg border-b border-zinc-800">
      {/* Top micro info bar */}
      <div className="bg-zinc-900/90 text-xs text-zinc-400 py-1.5 px-4 border-b border-zinc-800/80">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {RESTAURANT_INFO.isOpen ? 'مفتوح الآن' : 'مغلق'}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="flex items-center gap-1 hidden sm:inline-flex text-zinc-300">
              <Clock className="w-3 h-3 text-zinc-400" />
              {RESTAURANT_INFO.openingHours}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-zinc-300">
              <MapPin className="w-3 h-3 text-brand-500" />
              {RESTAURANT_INFO.addressShort}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-brand-400 font-semibold">{RESTAURANT_INFO.estimatedTime}</span>
          </div>
        </div>
      </div>

      {/* Main Brand & Cart Bar */}
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
            <span className="text-2xl animate-flame">🍗</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-white font-tajawal flex items-center gap-1.5">
                {RESTAURANT_INFO.name}
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">
                  DZ 🇩🇿
                </span>
              </h1>
            </div>
            <p className="text-[11px] font-medium text-zinc-400 tracking-wider">
              {RESTAURANT_INFO.tagline}
            </p>
          </div>
        </div>

        {/* Floating Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex items-center gap-2.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-600 active:scale-95 text-white px-3.5 py-2 rounded-xl shadow-md transition-all duration-200 border border-brand-400/40"
          aria-label="عرض السلة"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-brand-700 font-black text-xs w-5 h-5 rounded-full flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </div>
          <div className="text-right">
            <div className="text-[10px] text-brand-100 font-medium leading-none">السلة</div>
            <div className="text-xs font-black leading-tight">
              {cartCount > 0 ? formatDZD(subtotal) : '0 دج'}
            </div>
          </div>
        </button>
      </div>

      {/* Navigation Ordering Modes Tabs */}
      <div className="max-w-4xl mx-auto px-2 pb-1.5">
        <nav className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative py-2.5 px-2 rounded-lg font-bold text-center transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${
                  isActive
                    ? 'bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-md font-extrabold ring-1 ring-brand-400/50'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70'
                }`}
              >
                <span className="text-base sm:text-lg">{tab.icon}</span>
                <span className="text-xs sm:text-sm tracking-tight">{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`hidden md:inline-block text-[9px] px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-white/25 text-white font-semibold'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
