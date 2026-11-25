import React from 'react';
import { Shield, Flame, Zap, Check } from 'lucide-react';
import { SPICE_LEVELS } from '../../data/wingsConfig';

export const SpiceLevelSelector = ({ selectedSpiceLevel, onSelectSpiceLevel }) => {
  return (
    <section className="space-y-3" aria-labelledby="section-spice">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF7A00] text-white text-xs font-black">
            4
          </span>
          <h3 id="section-spice" className="text-base sm:text-lg font-black text-[#FFF8F0] font-tajawal">
            درجة الحرارة (Spice Level & VFX)
          </h3>
        </div>
        <span className="text-[11px] font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded-full border border-red-800/60">
          مؤثرات بصرية حية 🌋
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {SPICE_LEVELS.map((spice) => {
          const isSelected = selectedSpiceLevel.id === spice.id;
          const isExtraHot = spice.id === 'spice_extra_hot';
          const isMedium = spice.id === 'spice_medium';

          return (
            <button
              key={spice.id}
              type="button"
              onClick={() => onSelectSpiceLevel(spice)}
              className={`relative text-right p-3.5 rounded-2xl border-2 transition-transform duration-100 cursor-pointer flex flex-col justify-between active:scale-95 will-change-transform select-none ${
                isSelected
                  ? isExtraHot
                    ? 'border-red-500 bg-red-950/40 shadow-glow ring-1 ring-red-500/60 scale-[1.01]'
                    : isMedium
                    ? 'border-[#FF7A00] bg-[#FF7A00]/20 shadow-glow ring-1 ring-[#FF7A00]/50 scale-[1.01]'
                    : 'border-zinc-500 bg-[#2C221F] shadow-sm ring-1 ring-zinc-400/40 scale-[1.01]'
                  : 'border-[#3A2822] bg-[#211A17] hover:border-[#FF7A00]/50 hover:bg-[#2C221F]'
              }`}
            >
              {/* Header with icon and badge */}
              <div className="flex items-center justify-between w-full mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isExtraHot
                        ? 'bg-red-500/20 text-red-500'
                        : isMedium
                        ? 'bg-[#FF7A00]/20 text-[#FF7A00]'
                        : 'bg-[#2C221F] text-[#B8A99A]'
                    }`}
                  >
                    {isExtraHot ? (
                      <Flame className="w-5 h-5 fill-red-500/30 animate-pulse" />
                    ) : isMedium ? (
                      <Flame className="w-4 h-4" />
                    ) : (
                      <Shield className="w-4 h-4" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isExtraHot
                        ? 'bg-red-600 text-white'
                        : isMedium
                        ? 'bg-[#FF7A00] text-white'
                        : 'bg-[#2C221F] text-[#B8A99A]'
                    }`}
                  >
                    {spice.badge}
                  </span>
                </div>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? isExtraHot
                        ? 'bg-red-600 text-white'
                        : isMedium
                        ? 'bg-[#FF7A00] text-white'
                        : 'bg-zinc-400 text-zinc-950'
                      : 'border border-[#3A2822] text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h4 className="text-sm font-black text-[#FFF8F0] font-tajawal">
                  {spice.title}
                </h4>
                <div className="text-[11px] text-[#B8A99A] font-medium">
                  {spice.titleEn}
                </div>
              </div>

              <p className="text-[11px] text-[#B8A99A] leading-relaxed mt-2 pt-2 border-t border-[#3A2822]">
                {spice.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
};
