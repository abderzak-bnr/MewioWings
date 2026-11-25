import React, { useState, useMemo } from 'react';
import { 
  X, 
  Flame, 
  Sparkles, 
  Check, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Star,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  WINGS_STYLES, 
  COATING_SAUCES, 
  DIP_SAUCES, 
  SIDES_AND_EXTRAS, 
  MENU_RULES, 
  formatDZD 
} from '../../data/menuData';
import { useCart } from '../../context/CartContext';

export const BoxCustomizerModal = ({ box, isOpen, onClose }) => {
  const { addToCart } = useCart();

  if (!isOpen || !box) return null;

  // Selected Style: Crispy or Saucy
  const [selectedStyle, setSelectedStyle] = useState(WINGS_STYLES[0]); // Default Crispy
  const [selectedCoatingSauce, setSelectedCoatingSauce] = useState(COATING_SAUCES[0]); // Algeria Sauce
  const [selectedDips, setSelectedDips] = useState(() => {
    // By default, pre-select the first dip(s) up to box.freeDips
    const initial = {};
    if (box.freeDips > 0) {
      initial[DIP_SAUCES[0].id] = 1;
      if (box.freeDips > 1) {
        initial[DIP_SAUCES[1].id] = 1;
      }
    }
    return initial;
  });
  const [selectedExtraSides, setSelectedExtraSides] = useState({});
  const [quantity, setQuantity] = useState(1);

  const isSaucy = selectedStyle.id === 'saucy';

  // Dip calculation
  const totalDipsSelected = useMemo(() => {
    return Object.values(selectedDips).reduce((acc, qty) => acc + (qty || 0), 0);
  }, [selectedDips]);

  const extraDipsCount = Math.max(0, totalDipsSelected - box.freeDips);
  const extraDipsPrice = extraDipsCount * MENU_RULES.extraDipPrice;

  // Extra sides calculation
  const extraSidesPrice = useMemo(() => {
    return Object.entries(selectedExtraSides).reduce((acc, [id, qty]) => {
      const item = SIDES_AND_EXTRAS.find((s) => s.id === id);
      return acc + (item ? item.price * (qty || 0) : 0);
    }, 0);
  }, [selectedExtraSides]);

  const unitTotal = box.price + extraDipsPrice + extraSidesPrice;
  const grandTotal = unitTotal * quantity;

  const handleUpdateDipQuantity = (dipId, qty) => {
    setSelectedDips((prev) => {
      const next = { ...prev };
      if (qty <= 0) {
        delete next[dipId];
      } else {
        next[dipId] = qty;
      }
      return next;
    });
  };

  const handleUpdateExtraSideQuantity = (sideId, qty) => {
    setSelectedExtraSides((prev) => {
      const next = { ...prev };
      if (qty <= 0) {
        delete next[sideId];
      } else {
        next[sideId] = qty;
      }
      return next;
    });
  };

  const handleAddToCart = () => {
    const dipsList = Object.entries(selectedDips).map(([id, qty]) => {
      const dipObj = DIP_SAUCES.find((d) => d.id === id);
      return {
        id,
        name: dipObj ? dipObj.name : id,
        nameAr: dipObj ? dipObj.nameAr : id,
        quantity: qty,
      };
    });

    const extraSidesList = Object.entries(selectedExtraSides).map(([id, qty]) => {
      const sideObj = SIDES_AND_EXTRAS.find((s) => s.id === id);
      return {
        id,
        name: sideObj ? sideObj.name : id,
        nameAr: sideObj ? sideObj.nameAr : id,
        price: sideObj ? sideObj.price : 0,
        quantity: qty,
      };
    });

    const readyBoxItem = {
      type: 'ready_box',
      boxId: box.id,
      title: `${box.code} (${box.nameAr})`,
      subtitle: `${selectedStyle.nameAr} ${isSaucy && selectedCoatingSauce ? `• ${selectedCoatingSauce.name}` : ''}`,
      includedDetails: box.includedFries,
      wingsCount: box.wingsCount,
      style: selectedStyle,
      coatingSauce: isSaucy ? selectedCoatingSauce : null,
      dips: dipsList,
      extraSides: extraSidesList,
      basePrice: box.price,
      extraDipsCount,
      extraDipsPrice,
      sidesPrice: extraSidesPrice,
      unitTotal,
      quantity,
    };

    addToCart(readyBoxItem);
    onClose();

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#ea580c', '#f59e0b', '#10b981'],
      });
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="relative bg-[#14100E] text-[#FFF8F0] w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#3A2822] overflow-hidden max-h-[90vh] flex flex-col text-right animate-in slide-in-from-bottom sm:zoom-in-95 duration-250"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-[#211A17] text-[#FFF8F0] p-4 sm:p-5 flex items-start justify-between border-b border-[#3A2822] sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#FF7A00] text-white">
                {box.code}
              </span>
              <span className="text-xs text-[#B8A99A]">
                {box.serves}
              </span>
            </div>
            <h3 className="text-xl font-black font-tajawal text-[#FFF8F0]">
              تخصيص {box.nameAr}
            </h3>
            <p className="text-xs text-[#B8A99A] mt-0.5">
              {box.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#2C221F] hover:bg-[#3A2822] text-[#B8A99A] hover:text-[#FFF8F0] flex items-center justify-center transition-all shrink-0 border border-[#3A2822]"
            aria-label="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Section 1: Choose Style (Crispy vs Saucy) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-[#FFF8F0] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF7A00]"></span>
                اختر طريقة التقديم (Style):
              </h4>
              <span className="text-xs text-[#B8A99A] font-medium">خطوة إجبارية</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {WINGS_STYLES.map((style) => {
                const isSelected = selectedStyle.id === style.id;
                const isItemSaucy = style.id === 'saucy';

                return (
                  <div
                    key={style.id}
                    onClick={() => setSelectedStyle(style)}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#FF7A00] bg-[#FF7A00]/15 shadow-sm'
                        : 'border-[#3A2822] bg-[#211A17] hover:border-[#FF7A00]/50 hover:bg-[#2C221F]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        {isItemSaucy ? (
                          <Flame className="w-4 h-4 text-[#FF7A00]" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-amber-400" />
                        )}
                        <span className="text-xs font-black text-[#FFF8F0]">
                          {style.nameAr}
                        </span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          isSelected ? 'bg-[#FF7A00] text-white' : 'border border-[#3A2822]'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-[#B8A99A] leading-tight">
                      {isItemSaucy ? 'مغطاة بالكامل بالصوص' : 'مقرمشة مع صوص جانبي'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Conditional Coating Sauce (Only if Saucy) */}
          {isSaucy && (
            <div className="space-y-3 p-4 rounded-2xl bg-[#211A17] border border-[#3A2822]">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-[#FFF8F0] flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-[#FF7A00]" />
                  اختر صوص التغطية الساخن (Coating Sauce):
                </h4>
                <span className="text-xs font-bold text-[#FF7A00]">مطلوب</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {COATING_SAUCES.map((sauce) => {
                  const isSelected = selectedCoatingSauce?.id === sauce.id;
                  return (
                    <div
                      key={sauce.id}
                      onClick={() => setSelectedCoatingSauce(sauce)}
                      className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? sauce.isSignature
                            ? 'border-amber-400 bg-amber-500/20 shadow-sm'
                            : 'border-[#FF7A00] bg-[#FF7A00]/20 shadow-sm'
                          : 'border-[#3A2822] bg-[#14100E] hover:border-[#FF7A00]/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-[#FFF8F0]">
                            {sauce.name}
                          </span>
                          {sauce.isSignature && (
                            <span className="text-[10px] font-black px-1.5 rounded-full bg-amber-500 text-black">
                              ⭐ مميز
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#B8A99A] truncate max-w-[200px]">
                          {sauce.description}
                        </div>
                      </div>

                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#FF7A00] text-white' : 'border border-[#3A2822]'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 3: Select Included Dips (Free count = box.freeDips) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-[#FFF8F0] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF7A00]"></span>
                  اختر صوصات الديب للتغميس:
                </h4>
                <p className="text-xs text-[#B8A99A] mt-0.5">
                  هذا البوكس يتضمن <strong>{box.freeDips} صوص مجاني</strong> (أي صوص إضافي = {MENU_RULES.extraDipPrice} دج)
                </p>
              </div>

              <div className="text-left shrink-0">
                {extraDipsCount > 0 ? (
                  <span className="text-xs font-bold px-2 py-1 rounded-lg bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/40">
                    +{extraDipsCount} إضافي ({formatDZD(extraDipsPrice)})
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    {totalDipsSelected}/{box.freeDips} مجاناً
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DIP_SAUCES.map((dip) => {
                const qty = selectedDips[dip.id] || 0;
                return (
                  <div
                    key={dip.id}
                    className="p-2.5 rounded-xl border border-[#3A2822] bg-[#211A17] flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 text-xs font-bold text-[#FFF8F0] truncate">
                        {dip.name}
                        {dip.isSignature && (
                          <span className="text-[9px] font-black px-1 rounded bg-amber-500 text-black">
                            ⭐
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#B8A99A] truncate">
                        {dip.nameAr}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 bg-[#14100E] p-1 rounded-lg border border-[#3A2822]">
                      <button
                        type="button"
                        onClick={() => handleUpdateDipQuantity(dip.id, Math.max(0, qty - 1))}
                        disabled={qty === 0}
                        className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
                          qty > 0 ? 'bg-[#2C221F] text-[#FFF8F0] hover:bg-[#3A2822]' : 'text-zinc-600'
                        }`}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-4 text-center text-xs font-black text-[#FFF8F0]">{qty}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateDipQuantity(dip.id, qty + 1)}
                        className="w-6 h-6 rounded bg-[#FF7A00] text-white flex items-center justify-center hover:bg-[#E56D00] transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Optional Extra Sides */}
          <div className="space-y-3 pt-2 border-t border-[#3A2822]">
            <h4 className="text-sm font-black text-[#FFF8F0] flex items-center gap-1.5">
              <span>🍟</span>
              إضافات جانبية للبوكس (اختياري):
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SIDES_AND_EXTRAS.slice(0, 4).map((side) => {
                const qty = selectedExtraSides[side.id] || 0;
                return (
                  <div
                    key={side.id}
                    className="p-2.5 rounded-xl border border-[#3A2822] bg-[#211A17] flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#FFF8F0]">
                        {side.nameAr}
                      </div>
                      <div className="text-[11px] font-bold text-[#FF7A00]">
                        +{formatDZD(side.price)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 bg-[#14100E] p-1 rounded-lg border border-[#3A2822]">
                      <button
                        type="button"
                        onClick={() => handleUpdateExtraSideQuantity(side.id, Math.max(0, qty - 1))}
                        disabled={qty === 0}
                        className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
                          qty > 0 ? 'bg-[#2C221F] text-[#FFF8F0] hover:bg-[#3A2822]' : 'text-zinc-600'
                        }`}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-4 text-center text-xs font-black text-[#FFF8F0]">{qty}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateExtraSideQuantity(side.id, qty + 1)}
                        className="w-6 h-6 rounded bg-[#FF7A00] text-white flex items-center justify-center hover:bg-[#E56D00] transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Sticky Footer CTA */}
        <div className="p-4 bg-[#211A17] border-t border-[#3A2822] flex items-center justify-between gap-3 sticky bottom-0 z-10">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#14100E] rounded-xl p-1 border border-[#3A2822]">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg bg-[#2C221F] text-[#FFF8F0] hover:bg-[#3A2822] flex items-center justify-center transition-all"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-black text-[#FFF8F0]">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg bg-[#FF7A00] text-white hover:bg-[#E56D00] flex items-center justify-center transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="text-[10px] text-[#B8A99A]">الإجمالي للبوكس:</div>
              <div className="text-base font-black text-[#FF7A00]">
                {formatDZD(grandTotal)}
              </div>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 max-w-xs flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-600 text-white font-black py-3.5 px-4 rounded-2xl shadow-md transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>أضف للسلة ({formatDZD(grandTotal)})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
