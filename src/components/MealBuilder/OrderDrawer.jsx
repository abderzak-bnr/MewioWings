import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowLeft, 
  MapPin, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RESTAURANT_INFO, TOPPINGS, formatDZD } from '../../data/wingsConfig';

export const OrderDrawer = ({
  isOpen,
  onClose,
  selectedQuantity,
  selectedSauce,
  selectedToppings,
  selectedSpiceLevel,
  unitPrice,
}) => {
  const [mealQuantity, setMealQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('المدية (وسط المدينة)');
  const [kitchenNotes, setKitchenNotes] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const activeToppingObjects = TOPPINGS.filter((t) => selectedToppings.includes(t.id));
  const totalPrice = unitPrice * mealQuantity;

  // Format WhatsApp message text
  const generateWhatsAppMessage = () => {
    let msg = `🍗 *طلب جديد: صمّم أجنحتك بنفسك (WINGO! MÉDÉA)* 🍗\n`;
    if (orderId) msg += `رقم الطلب: #${orderId}\n`;
    msg += `📍 الموقع: ${RESTAURANT_INFO.fullLocation}\n`;
    msg += `------------------------------------\n`;
    msg += `📦 *تفاصيل الوجبة المخصصة (×${mealQuantity}):*\n`;
    msg += `   • الحجم: ${selectedQuantity.title}\n`;
    msg += `   • الصصوص: ${selectedSauce.name}\n`;
    if (activeToppingObjects.length > 0) {
      msg += `   • التوبينغ: ${activeToppingObjects.map((t) => t.name).join(' + ')}\n`;
    } else {
      msg += `   • التوبينغ: بدون إضافات\n`;
    }
    msg += `   • درجة الحرارة: ${selectedSpiceLevel.title}\n`;
    msg += `------------------------------------\n`;
    if (customerName) msg += `👤 الاسم: ${customerName}\n`;
    if (customerPhone) msg += `📞 الهاتف: ${customerPhone}\n`;
    if (customerAddress) msg += `🏠 العنوان في المدية: ${customerAddress}\n`;
    if (kitchenNotes) msg += `📝 ملاحظات خاصة: ${kitchenNotes}\n`;
    msg += `💰 *المجموع الإجمالي: ${formatDZD(totalPrice)}*\n`;
    msg += `شكراً لاختياركم WINGO! المدية! 🔥`;

    return msg;
  };

  const handleConfirmOrder = () => {
    const newId = Math.floor(100000 + Math.random() * 900000);
    setOrderId(newId);
    setOrderConfirmed(true);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ea580c', '#f59e0b', '#10b981'],
      });
    } catch (e) {}
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(generateWhatsAppMessage());
    const url = `https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${text}`;
    window.open(url, '_blank');
  };

  const handleCopyReceipt = () => {
    const text = generateWhatsAppMessage();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-start animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#3D1408] text-[#FFF8F0] h-full shadow-2xl flex flex-col text-right animate-in slide-in-from-right duration-250 border-r border-[#5C200E]"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="p-4 bg-[#4A190B] border-b border-[#5C200E] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FF7A00] text-white flex items-center justify-center font-bold shadow-md">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black font-tajawal text-[#FFF8F0]">
                ملخص وجبتك المخصصة
              </h3>
              <span className="text-xs text-[#FF7A00] flex items-center gap-1 font-medium">
                <MapPin className="w-3 h-3 text-[#FF7A00]" />
                {RESTAURANT_INFO.fullLocation}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#2B0D05] text-[#D4C7BA] hover:text-[#FFF8F0] flex items-center justify-center transition-all border border-[#5C200E]"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!orderConfirmed ? (
            <>
              {/* Customized Wings Meal Card */}
              <div className="bg-[#4A190B] rounded-2xl border border-[#5C200E] p-4 space-y-3 shadow-card">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/40">
                      وجبة أجنحة صممتها بنفسك
                    </span>
                    <h4 className="text-lg font-black text-[#FFF8F0] font-tajawal mt-1">
                      {selectedQuantity.title}
                    </h4>
                  </div>

                  <span className="text-lg font-black text-[#FF7A00] font-tajawal">
                    {formatDZD(unitPrice)}
                  </span>
                </div>

                {/* Configuration Specs */}
                <div className="space-y-1.5 text-xs text-[#D4C7BA] bg-[#2B0D05] p-3 rounded-xl border border-[#5C200E]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#D4C7BA]">صوص التغطية:</span>
                    <span className="font-bold text-[#FF7A00] flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedSauce.dotColor }} />
                      {selectedSauce.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#D4C7BA]">التوبينغ المختار:</span>
                    <span className="font-bold text-emerald-400">
                      {activeToppingObjects.length > 0
                        ? activeToppingObjects.map((t) => t.name).join('، ')
                        : 'بدون إضافات'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#D4C7BA]">درجة الحرارة:</span>
                    <span className="font-bold text-red-400 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-red-500" />
                      {selectedSpiceLevel.title}
                    </span>
                  </div>
                </div>

                {/* Meal Quantity Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-[#5C200E]">
                  <span className="text-xs text-[#D4C7BA] font-medium">عدد الأطباق:</span>
                  <div className="flex items-center gap-2 bg-[#2B0D05] p-1 rounded-xl border border-[#5C200E]">
                    <button
                      type="button"
                      onClick={() => setMealQuantity(Math.max(1, mealQuantity - 1))}
                      className="w-7 h-7 rounded-lg bg-[#3D1408] text-[#FFF8F0] hover:bg-[#4A190B] flex items-center justify-center transition-all border border-[#5C200E]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-black text-[#FFF8F0]">
                      {mealQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setMealQuantity(mealQuantity + 1)}
                      className="w-7 h-7 rounded-lg bg-[#FF7A00] text-white flex items-center justify-center hover:bg-[#E56D00] transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Delivery Info in Médéa */}
              <div className="bg-[#4A190B] rounded-2xl border border-[#5C200E] p-4 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#FFF8F0]">
                  <MapPin className="w-3.5 h-3.5 text-[#FF7A00]" />
                  <span>معلومات التوصيل أو الاستلام في المدية:</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[#D4C7BA] block mb-1">الاسم الكريم:</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="مثال: يونس بن علي"
                      className="w-full text-xs p-2.5 rounded-xl border border-[#5C200E] bg-[#2B0D05] text-[#FFF8F0] placeholder:text-[#D4C7BA]/50 focus:outline-none focus:border-[#FF7A00] text-right"
                    />
                  </div>

                  <div>
                    <label className="text-[#D4C7BA] block mb-1">رقم الهاتف:</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="مثال: 0555 12 34 56"
                      className="w-full text-xs p-2.5 rounded-xl border border-[#5C200E] bg-[#2B0D05] text-[#FFF8F0] placeholder:text-[#D4C7BA]/50 focus:outline-none focus:border-[#FF7A00] text-right"
                    />
                  </div>

                  <div>
                    <label className="text-[#D4C7BA] block mb-1">العنوان / الحي في المدية:</label>
                    <input
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="مثال: حي المصلى، قرب مسجد النور"
                      className="w-full text-xs p-2.5 rounded-xl border border-[#5C200E] bg-[#2B0D05] text-[#FFF8F0] placeholder:text-[#D4C7BA]/50 focus:outline-none focus:border-[#FF7A00] text-right"
                    />
                  </div>

                  <div>
                    <label className="text-[#D4C7BA] block mb-1">ملاحظات للمطبخ (اختياري):</label>
                    <textarea
                      value={kitchenNotes}
                      onChange={(e) => setKitchenNotes(e.target.value)}
                      placeholder="مثال: صوص إضافي في علبة صغيرة، بدون بهارات حارة جداً..."
                      rows={2}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#5C200E] bg-[#2B0D05] text-[#FFF8F0] placeholder:text-[#D4C7BA]/50 focus:outline-none focus:border-[#FF7A00] text-right"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Order Confirmed View */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="text-xl font-black font-tajawal text-[#FFF8F0]">
                  تم تأكيد طلبك بنجاح! 🎉
                </h3>
                <p className="text-xs text-[#D4C7BA] mt-1">
                  رقم الطلب: <span className="font-mono font-bold text-[#FF7A00]">#{orderId}</span>
                </p>
                <p className="text-xs text-[#D4C7BA] mt-0.5">
                  مطعم WINGO! — المدية، الجزائر 🇩🇿
                </p>
              </div>

              <div className="bg-[#4A190B] p-4 rounded-2xl border border-[#5C200E] text-right space-y-2 text-xs">
                <div className="flex justify-between font-bold text-[#FFF8F0]">
                  <span>{selectedQuantity.title} (×{mealQuantity})</span>
                  <span>{formatDZD(totalPrice)}</span>
                </div>
                <div className="text-[#D4C7BA] text-[11px]">
                  • الصوص: {selectedSauce.name}
                </div>
                {activeToppingObjects.length > 0 && (
                  <div className="text-emerald-400 text-[11px]">
                    • التوبينغ: {activeToppingObjects.map((t) => t.name).join(' + ')}
                  </div>
                )}
                <div className="text-red-400 text-[11px]">
                  • الحرارة: {selectedSpiceLevel.title}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black py-3.5 px-4 rounded-2xl shadow-lg transition-all text-xs sm:text-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>إرسال الطلب عبر واتساب (WhatsApp)</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyReceipt}
                  className="w-full flex items-center justify-center gap-2 bg-[#2B0D05] hover:bg-[#3D1408] active:scale-95 text-[#FFF8F0] border border-[#5C200E] font-bold py-3 px-4 rounded-2xl transition-all text-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                      <span className="text-emerald-400 font-extrabold">تم نسخ الفاتورة!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#D4C7BA]" />
                      <span>نسخ تفاصيل الفاتورة كنص</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Sticky Bottom CTA */}
        {!orderConfirmed && (
          <div className="p-4 bg-[#4A190B] border-t border-[#5C200E] space-y-3">
            <div className="flex justify-between items-center text-sm font-black text-[#FFF8F0] font-tajawal">
              <span>الإجمالي النهائي:</span>
              <span className="text-xl text-[#FF7A00]">
                {formatDZD(totalPrice)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleConfirmOrder}
              className="w-full flex items-center justify-center gap-2 bg-[#2B0D05] hover:bg-[#3D1408] border border-[#5C200E] active:scale-95 text-white font-black py-3.5 px-4 rounded-2xl shadow-lg transition-all text-sm"
            >
              <span>تأكيد الطلب الآن</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
