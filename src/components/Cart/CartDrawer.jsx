import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowLeft, 
  FileText, 
  Sparkles,
  Flame,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { RESTAURANT_INFO, formatDZD } from '../../data/menuData';
import { OrderSuccessModal } from './OrderSuccessModal';

export const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    cartCount,
    kitchenNotes,
    setKitchenNotes,
    isOrderSubmitted,
    setIsOrderSubmitted,
    lastOrderDetails,
    setLastOrderDetails,
  } = useCart();

  const [orderModalOpen, setOrderModalOpen] = useState(false);

  if (!isCartOpen) return null;

  const handleConfirmOrder = () => {
    if (cartItems.length === 0) return;

    const orderPayload = {
      orderId: Math.floor(100000 + Math.random() * 900000),
      items: [...cartItems],
      subtotal,
      kitchenNotes,
      createdAt: new Date().toISOString(),
    };

    setLastOrderDetails(orderPayload);
    setOrderModalOpen(true);
    setIsCartOpen(false);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ea580c', '#f59e0b', '#10b981'],
      });
    } catch (e) {}
  };

  const handleResetOrder = () => {
    clearCart();
    setOrderModalOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm flex justify-start animate-in fade-in duration-200">
        <div 
          className="relative w-full max-w-md bg-[#14100E] text-[#FFF8F0] h-full shadow-2xl flex flex-col text-right animate-in slide-in-from-right duration-250 border-r border-[#3A2822]"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="bg-[#211A17] text-[#FFF8F0] p-4 flex items-center justify-between border-b border-[#3A2822]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FF7A00] text-white flex items-center justify-center font-bold shadow-md">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black font-tajawal text-[#FFF8F0]">
                  سلة الطلبات
                </h3>
                <span className="text-xs text-[#B8A99A]">
                  {cartCount} {cartCount === 1 ? 'عنصر' : 'عناصر'} مخصصة
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cartItems.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-[#B8A99A] hover:text-red-400 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#2C221F] transition-all"
                  title="تفريغ السلة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>تفريغ</span>
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-[#2C221F] text-[#B8A99A] hover:text-[#FFF8F0] flex items-center justify-center transition-all border border-[#3A2822]"
                aria-label="إغلاق السلة"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#B8A99A] space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-[#211A17] border border-[#3A2822] flex items-center justify-center text-3xl">
                  🍗
                </div>
                <div>
                  <h4 className="text-base font-black text-[#FFF8F0]">
                    سلتك فارغة حالياً
                  </h4>
                  <p className="text-xs text-[#B8A99A] mt-1 max-w-xs">
                    اختر أجنحتك وصمم بوكسك الخاص أو اختر أحد البوكسات الجاهزة الشهية!
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-3 px-5 py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#E56D00] text-white font-bold text-xs transition-all shadow-sm"
                >
                  تصفح المنيو
                </button>
              </div>
            ) : (
              cartItems.map((item) => {
                const itemTotal = item.unitTotal * (item.quantity || 1);

                return (
                  <div
                    key={item.cartItemId}
                    className="bg-[#211A17] rounded-2xl border border-[#3A2822] p-3.5 shadow-sm space-y-2.5 relative"
                  >
                    {/* Item header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-sm font-black text-[#FFF8F0] font-tajawal">
                            {item.title}
                          </h4>
                          {item.type === 'custom_box' && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/40">
                              مخصص
                            </span>
                          )}
                        </div>

                        {item.subtitle && (
                          <div className="text-xs text-[#B8A99A] font-medium mt-0.5">
                            {item.subtitle}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-[#B8A99A] hover:text-red-400 p-1 transition-all"
                        aria-label="حذف العنصر"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Specifications & Selections breakdown */}
                    <div className="text-[11px] space-y-1 bg-[#14100E] p-2.5 rounded-xl border border-[#3A2822] text-[#B8A99A]">
                      {/* Coating sauce if saucy */}
                      {item.coatingSauce && (
                        <div className="flex items-center gap-1 font-semibold text-[#FF7A00]">
                          <Flame className="w-3 h-3 text-[#FF7A00]" />
                          <span>صوص التغطية: {item.coatingSauce.name}</span>
                        </div>
                      )}

                      {/* Dips */}
                      {item.dips && item.dips.length > 0 && (
                        <div>
                          <span className="font-bold text-[#FFF8F0]">الصوصات: </span>
                          <span>
                            {item.dips.map((d) => `${d.nameAr} (×${d.quantity})`).join('، ')}
                          </span>
                        </div>
                      )}

                      {/* Sides / Extras */}
                      {item.sides && item.sides.length > 0 && (
                        <div>
                          <span className="font-bold text-[#FFF8F0]">الإضافات: </span>
                          <span>
                            {item.sides.map((s) => `${s.nameAr} (×${s.quantity})`).join('، ')}
                          </span>
                        </div>
                      )}

                      {item.extraSides && item.extraSides.length > 0 && (
                        <div>
                          <span className="font-bold text-[#FFF8F0]">الإضافات: </span>
                          <span>
                            {item.extraSides.map((s) => `${s.nameAr} (×${s.quantity})`).join('، ')}
                          </span>
                        </div>
                      )}

                      {/* Ready box included items */}
                      {item.includedDetails && (
                        <div className="text-[#B8A99A]">
                          ✓ {item.includedDetails}
                        </div>
                      )}
                    </div>

                    {/* Quantity & Unit Total */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2 bg-[#14100E] p-1 rounded-xl border border-[#3A2822]">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, (item.quantity || 1) - 1)}
                          className="w-6 h-6 rounded-lg bg-[#2C221F] text-[#FFF8F0] hover:bg-[#3A2822] flex items-center justify-center transition-all"
                          aria-label="إنقاص الكمية"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-black text-[#FFF8F0]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, (item.quantity || 1) + 1)}
                          className="w-6 h-6 rounded-lg bg-[#FF7A00] text-white flex items-center justify-center hover:bg-[#E56D00] transition-all"
                          aria-label="زيادة الكمية"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-sm font-black text-[#FF7A00] font-tajawal">
                        {formatDZD(itemTotal)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Kitchen Notes */}
            {cartItems.length > 0 && (
              <div className="bg-[#211A17] rounded-2xl border border-[#3A2822] p-3.5 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#FFF8F0]">
                  <FileText className="w-3.5 h-3.5 text-[#FF7A00]" />
                  <span>ملاحظات خاصة للمطبخ:</span>
                </div>
                <textarea
                  value={kitchenNotes}
                  onChange={(e) => setKitchenNotes(e.target.value)}
                  placeholder="مثال: يرجى وضع الصوص في علبة منفصلة، بدون بصل، زيادة مناديل..."
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#3A2822] focus:outline-none focus:ring-2 focus:ring-[#FF7A00] text-right bg-[#14100E] text-[#FFF8F0] placeholder:text-[#B8A99A]/50"
                />
              </div>
            )}
          </div>

          {/* Sticky Bottom Summary in Cart */}
          {cartItems.length > 0 && (
            <div className="p-4 bg-[#211A17] border-t border-[#3A2822] space-y-3 sticky bottom-0 z-10 shadow-lg">
              <div className="space-y-1.5 text-xs text-[#B8A99A]">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span className="font-bold text-[#FFF8F0]">{formatDZD(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#B8A99A]">
                  <span>التوصيل (تقديري):</span>
                  <span>حسب موقع الزبون 📍</span>
                </div>
                <div className="flex justify-between text-base font-black text-[#FFF8F0] pt-2 border-t border-[#3A2822] font-tajawal">
                  <span>الإجمالي:</span>
                  <span className="text-[#FF7A00] text-lg font-black font-tajawal">
                    {formatDZD(subtotal)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleConfirmOrder}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-600 active:scale-95 text-white font-black py-3.5 px-4 rounded-2xl shadow-md transition-all text-sm"
              >
                <span>تأكيد الطلب الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Order Success & WhatsApp Invoice Modal */}
      {orderModalOpen && (
        <OrderSuccessModal
          orderDetails={lastOrderDetails}
          isOpen={orderModalOpen}
          onClose={() => setOrderModalOpen(false)}
          onResetOrder={handleResetOrder}
        />
      )}
    </>
  );
};
