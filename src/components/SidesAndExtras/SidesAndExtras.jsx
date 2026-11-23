import React, { useState } from 'react';
import { Plus, Minus, ShoppingBag, Sparkles, Filter, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SIDES_AND_EXTRAS, DIP_SAUCES, formatDZD } from '../../data/menuData';
import { useCart } from '../../context/CartContext';

export const SidesAndExtras = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [addedAnimationId, setAddedAnimationId] = useState(null);

  const categories = [
    { id: 'all', label: 'الكل' },
    { id: 'fries', label: 'بطاطا مقلية 🍟' },
    { id: 'sides', label: 'مقبلات وسلطات 🥗' },
    { id: 'extras', label: 'إضافات وأجنحة 🍗' },
    { id: 'dips', label: 'علب صوصات ديب 🥣' },
    { id: 'drinks', label: 'مشروبات باردة 🥤' },
  ];

  // Merge standalone sides with dip standalone cups if 'dips' selected
  const allItems = [...SIDES_AND_EXTRAS];
  
  // Also create standalone dip items from DIP_SAUCES
  const dipItemsFormatted = DIP_SAUCES.map((d) => ({
    id: `standalone_${d.id}`,
    category: 'dips',
    name: `${d.name} Dip`,
    nameAr: `علبة ${d.nameAr}`,
    nameFr: d.nameFr,
    description: d.description,
    price: 30, // from menuData extraDipPrice
    isPopular: d.isSignature,
  }));

  const combinedItems = [...allItems, ...dipItemsFormatted];

  const filteredItems = selectedCategory === 'all'
    ? combinedItems
    : combinedItems.filter((item) => item.category === selectedCategory);

  const handleQuickAdd = (item) => {
    const cartItem = {
      type: 'standalone_item',
      id: item.id,
      title: item.nameAr,
      subtitle: item.name,
      unitTotal: item.price,
      price: item.price,
      quantity: 1,
    };

    addToCart(cartItem);

    // Micro feedback animation
    setAddedAnimationId(item.id);
    setTimeout(() => {
      setAddedAnimationId(null);
    }, 1200);

    try {
      confetti({
        particleCount: 20,
        spread: 40,
        origin: { y: 0.85 },
        colors: ['#ea580c', '#f59e0b'],
      });
    } catch (e) {}
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 text-white p-5 sm:p-6 shadow-xl border border-zinc-800">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black border border-amber-500/30 mb-2">
            <span>🍟</span>
            سناك وإضافات مكملة
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-tajawal tracking-tight">
            الإضافات والصوصات الفردية
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-xl leading-relaxed">
            اطلب بطاطا إضافية، صوصات ديب، سلطة كول سلو منعشة أو مشروب غازي بارد مع وجبتك.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat.id
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredItems.map((item) => {
          const isJustAdded = addedAnimationId === item.id;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-zinc-200/90 p-4 shadow-sm hover:shadow-card transition-all duration-200 flex flex-col justify-between text-right"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-base font-black text-zinc-900 font-tajawal truncate">
                    {item.nameAr}
                  </h3>
                  {item.isPopular && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 shrink-0">
                      محبوب 🔥
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-zinc-400 font-medium mb-2">
                  {item.name}
                </div>

                <p className="text-xs text-zinc-500 leading-relaxed mb-4 line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                <span className="text-base font-black text-brand-600 font-tajawal">
                  {formatDZD(item.price)}
                </span>

                <button
                  onClick={() => handleQuickAdd(item)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-sm ${
                    isJustAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-brand-600 hover:bg-brand-700 text-white'
                  }`}
                >
                  {isJustAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>تمت الإضافة!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>أضف للسلة</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
