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
    <header className="sticky top-0 z-40 bg-[#14100E] text-[#FFF8F0] shadow-lg border-b border-[#3A2822]">
      {/* Top micro info bar */}
      <div className="bg-[#211A17]/90 text-xs text-[#B8A99A] py-1.5 px-4 border-b border-[#3A2822]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {RESTAURANT_INFO.isOpen ? 'مفتوح الآن' : 'مغلق'}
            </span>
            <span className="text-[#3A2822]">•</span>
            <span className="flex items-center gap-1 hidden sm:inline-flex text-[#B8A99A]">
              <Clock className="w-3 h-3 text-[#B8A99A]" />
              {RESTAURANT_INFO.openingHours}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[#B8A99A]">
              <MapPin className="w-3 h-3 text-[#FF7A00]" />
              {RESTAURANT_INFO.addressShort}
            </span>
            <span className="text-[#3A2822]">•</span>
            <span className="text-[#FF7A00] font-semibold">{RESTAURANT_INFO.estimatedTime}</span>
          </div>
        </div>
      </div>

      {/* Main Brand & Cart Bar */}
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo & Tagline */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.webp"
            alt="WINGO!"
            className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,248,240,0.35)]"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/public/logo.webp';
            }}
          />
          <div>
            <p className="text-[11px] font-medium text-[#B8A99A] tracking-wider">
              {RESTAURANT_INFO.tagline}
            </p>
          </div>
        </div>

        {/* Floating Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex items-center gap-2.5 bg-gradient-to-r from-[#FF7A00] to-[#E56D00] hover:from-[#E56D00] hover:to-[#FF7A00] active:scale-95 text-[#FFF8F0] px-3.5 py-2 rounded-xl shadow-md transition-all duration-200 border border-[#FF7A00]/40"
          aria-label="عرض السلة"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-[#FFF8F0]" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#FFF8F0] text-[#14100E] font-black text-xs w-5 h-5 rounded-full flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </div>
          <div className="text-right">
            <div className="text-[10px] text-[#FFF8F0]/80 font-medium leading-none">السلة</div>
            <div className="text-xs font-black leading-tight text-[#FFF8F0]">
              {cartCount > 0 ? formatDZD(subtotal) : '0 دج'}
            </div>
          </div>
        </button>
      </div>

      {/* Navigation Ordering Modes Tabs */}
      <div className="max-w-4xl mx-auto px-2 pb-1.5">
        <nav className="grid grid-cols-3 gap-1.5 p-1 bg-[#211A17] rounded-xl border border-[#3A2822]">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative py-2.5 px-2 rounded-lg font-bold text-center transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${
                  isActive
                    ? 'bg-gradient-to-b from-[#FF7A00] to-[#E56D00] text-[#FFF8F0] shadow-md font-extrabold ring-1 ring-[#FF7A00]/50'
                    : 'text-[#B8A99A] hover:text-[#FFF8F0] hover:bg-[#2C221F]'
                }`}
              >
                <span className="text-base sm:text-lg">{tab.icon}</span>
                <span className="text-xs sm:text-sm tracking-tight">{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`hidden md:inline-block text-[9px] px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-white/25 text-[#FFF8F0] font-semibold'
                        : 'bg-[#14100E] text-[#B8A99A]'
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
