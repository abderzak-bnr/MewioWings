import React, { useState } from 'react';
import { CheckCircle2, MessageCircle, Copy, Check, RotateCcw, X, MapPin, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { RESTAURANT_INFO, formatDZD } from '../../data/menuData';

export const OrderSuccessModal = ({ orderDetails, isOpen, onClose, onResetOrder }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !orderDetails) return null;

  const { orderId, items, subtotal, kitchenNotes, createdAt } = orderDetails;

  // Format WhatsApp message text
  const generateWhatsAppMessage = () => {
    let msg = `🍗 *طلب جديد من وينغز WINGS* 🍗\n`;
    msg += `رقم الطلب: #${orderId}\n`;
    msg += `الوقت: ${new Date(createdAt).toLocaleTimeString('ar-DZ')}\n`;
    msg += `----------------------------\n`;

    items.forEach((item, idx) => {
      msg += `*${idx + 1}. ${item.title}* (×${item.quantity})\n`;
      if (item.subtitle) msg += `   - الستايل: ${item.subtitle}\n`;
      if (item.coatingSauce) msg += `   - صوص التغطية: ${item.coatingSauce.name}\n`;
      if (item.dips && item.dips.length > 0) {
        const dipNames = item.dips.map((d) => `${d.nameAr} (${d.quantity})`).join(', ');
        msg += `   - الصوصات: ${dipNames}\n`;
      }
      if (item.sides && item.sides.length > 0) {
        const sideNames = item.sides.map((s) => `${s.nameAr} (${s.quantity})`).join(', ');
        msg += `   - إضافات: ${sideNames}\n`;
      }
      if (item.extraSides && item.extraSides.length > 0) {
        const extraNames = item.extraSides.map((s) => `${s.nameAr} (${s.quantity})`).join(', ');
        msg += `   - إضافات: ${extraNames}\n`;
      }
      msg += `   السعر: ${formatDZD(item.unitTotal * item.quantity)}\n\n`;
    });

    if (kitchenNotes) {
      msg += `📝 *ملاحظات المطبخ:* ${kitchenNotes}\n`;
    }

    msg += `----------------------------\n`;
    msg += `💰 *المجموع النهائي: ${formatDZD(subtotal)}*\n`;
    msg += `📍 العنوان: للتسليم / الاستلام\n`;
    msg += `شكراً لاختياركم وينغز WINGS! 🔥`;

    return msg;
  };

  const handleCopyReceipt = () => {
    const text = generateWhatsAppMessage();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(generateWhatsAppMessage());
    const url = `https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="bg-[#FAF9F6] w-full max-w-lg rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col text-right max-h-[90vh] animate-in fade-in zoom-in duration-200"
        role="dialog"
      >
        {/* Header with success badge */}
        <div className="bg-zinc-950 text-white p-5 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 stroke-[2.5]" />
          </div>

          <h3 className="text-xl font-black font-tajawal text-white">
            تم تسجيل طلبك بنجاح! 🎉
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            رقم الطلب: <span className="font-mono font-bold text-brand-400">#{orderId}</span>
          </p>
        </div>

        {/* Order Details Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-zinc-200 space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-500 pb-2 border-b border-zinc-100">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand-600" />
                وقت التحضير التقديري: {RESTAURANT_INFO.estimatedTime}
              </span>
              <span>{new Date(createdAt).toLocaleTimeString('ar-DZ')}</span>
            </div>

            {/* Items list */}
            <div className="space-y-2.5">
              {items.map((item, index) => (
                <div key={index} className="text-xs space-y-0.5">
                  <div className="flex justify-between font-bold text-zinc-900">
                    <span>
                      {item.title} <span className="text-brand-600 font-extrabold">(×{item.quantity})</span>
                    </span>
                    <span>{formatDZD(item.unitTotal * item.quantity)}</span>
                  </div>

                  {item.subtitle && (
                    <div className="text-[11px] text-zinc-500">
                      • {item.subtitle}
                    </div>
                  )}

                  {item.coatingSauce && (
                    <div className="text-[11px] text-orange-700 font-semibold">
                      • صوص التغطية: {item.coatingSauce.name}
                    </div>
                  )}

                  {item.dips && item.dips.length > 0 && (
                    <div className="text-[11px] text-zinc-500">
                      • الصوصات: {item.dips.map((d) => `${d.nameAr} (${d.quantity})`).join(', ')}
                    </div>
                  )}

                  {item.sides && item.sides.length > 0 && (
                    <div className="text-[11px] text-emerald-700 font-medium">
                      • إضافات: {item.sides.map((s) => `${s.nameAr} (${s.quantity})`).join(', ')}
                    </div>
                  )}

                  {item.extraSides && item.extraSides.length > 0 && (
                    <div className="text-[11px] text-emerald-700 font-medium">
                      • إضافات: {item.extraSides.map((s) => `${s.nameAr} (${s.quantity})`).join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {kitchenNotes && (
              <div className="pt-2 border-t border-zinc-100 text-xs">
                <span className="font-bold text-zinc-700">ملاحظاتك للمطبخ: </span>
                <span className="text-zinc-600 italic">{kitchenNotes}</span>
              </div>
            )}

            {/* Total */}
            <div className="pt-3 border-t border-zinc-200 flex justify-between items-center text-sm font-black">
              <span>المجموع النهائي:</span>
              <span className="text-base text-brand-600 font-tajawal">
                {formatDZD(subtotal)}
              </span>
            </div>
          </div>

          {/* Integration Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleSendWhatsApp}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black py-3.5 px-4 rounded-2xl shadow-md transition-all text-xs sm:text-sm"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>إرسال الطلب عبر واتساب (WhatsApp)</span>
            </button>

            <button
              onClick={handleCopyReceipt}
              className="w-full flex items-center justify-center gap-2 bg-zinc-200 hover:bg-zinc-300 active:scale-95 text-zinc-800 font-bold py-3 px-4 rounded-2xl transition-all text-xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span className="text-emerald-700 font-extrabold">تم نسخ تفاصيل الفاتورة!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-zinc-600" />
                  <span>نسخ الفاتورة كنص</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-100 border-t border-zinc-200 text-center">
          <button
            onClick={() => {
              onResetOrder();
              onClose();
            }}
            className="text-xs font-bold text-zinc-600 hover:text-zinc-900 inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>طلب جديد</span>
          </button>
        </div>
      </div>
    </div>
  );
};
