import React, { useState } from 'react';
import { Sparkles, Flame, Users, Clock, ArrowLeft, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import { READY_BOXES, formatDZD } from '../../data/menuData';
import { BoxCustomizerModal } from './BoxCustomizerModal';

export const ReadyBoxes = () => {
  const [selectedBoxToCustomize, setSelectedBoxToCustomize] = useState(null);

  return (
    <div className="space-y-6 pb-28">
      {/* Ready Boxes Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 text-white p-5 sm:p-6 shadow-xl border border-zinc-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-black border border-orange-500/30 mb-2">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            عروض كومبو موفرة وشاملة
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-tajawal tracking-tight">
            البوكسات الجاهزة (Ready Combos) 🔥
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-xl leading-relaxed">
            مجموعات متكاملة مجهزة مسبقاً بالأجنحة والبطاطا المقرمشة وصوصات الديب المجانية، جاهزة للتخصيص الفوري بضغطة زر.
          </p>
        </div>
      </div>

      {/* Boxes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {READY_BOXES.map((box) => {
          return (
            <div
              key={box.id}
              className="bg-white rounded-3xl border border-zinc-200 p-5 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between relative overflow-hidden group text-right"
            >
              {/* Top Row: Code, Badge & Servings */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black tracking-wider px-3 py-1 rounded-full bg-zinc-950 text-white shadow-sm font-tajawal">
                      {box.code}
                    </span>
                    {box.badge && (
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-brand-600 to-amber-500 text-white shadow-sm">
                        {box.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-zinc-500 flex items-center gap-1 font-medium">
                    <Users className="w-3.5 h-3.5 text-brand-600" />
                    {box.serves}
                  </span>
                </div>

                {/* Title & Tagline */}
                <div className="mb-2">
                  <h3 className="text-xl font-black text-zinc-900 font-tajawal">
                    {box.nameAr}
                  </h3>
                  <div className="text-xs text-zinc-400 font-medium">
                    {box.tagline}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  {box.description}
                </p>

                {/* Included Pills */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {box.contentsSummary.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 border border-zinc-200/80 flex items-center gap-1"
                    >
                      <span>✓</span>
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Row: Price & Customize Button */}
              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-zinc-400 font-medium">السعر يبدأ من:</div>
                  <div className="text-xl font-black text-brand-600 font-tajawal">
                    {formatDZD(box.price)}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedBoxToCustomize(box)}
                  className="flex items-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-600 text-white font-black text-xs px-4 py-3 rounded-2xl shadow-md transition-all active:scale-95"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>تخصيص وطلب</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customizer Modal */}
      {selectedBoxToCustomize && (
        <BoxCustomizerModal
          box={selectedBoxToCustomize}
          isOpen={!!selectedBoxToCustomize}
          onClose={() => setSelectedBoxToCustomize(null)}
        />
      )}
    </div>
  );
};
