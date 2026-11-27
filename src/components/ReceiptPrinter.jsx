import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, ArrowRight, MessageCircle } from 'lucide-react';

/**
 * 20-step printing keyframes simulating mechanical thermal paper feeding over 1.75s
 */
const printingTransformKeyframes = [
  "translateY(-100%)",
  "translateY(-95%)",
  "translateY(-90%)",
  "translateY(-84%)",
  "translateY(-78%)",
  "translateY(-71%)",
  "translateY(-65%)",
  "translateY(-58%)",
  "translateY(-52%)",
  "translateY(-45%)",
  "translateY(-39%)",
  "translateY(-33%)",
  "translateY(-27%)",
  "translateY(-21%)",
  "translateY(-16%)",
  "translateY(-11%)",
  "translateY(-7%)",
  "translateY(-4%)",
  "translateY(-1%)",
  "translateY(0%)"
];

const printingKeyframeTimes = [
  0, 0.05, 0.1, 0.16, 0.22, 0.28, 0.35, 0.41, 0.48, 0.54, 0.61, 0.67, 0.74, 0.8, 0.86, 0.91, 0.95, 0.97, 0.99, 1
];

/**
 * Generates exact serrated bottom edge (40 teeth, 4px depth)
 */
function createSerratedClipPath(teeth = 40, depthPx = 4) {
  const points = ["0% 0%", "100% 0%"];
  const step = 100 / teeth;
  for (let i = 0; i < teeth; i++) {
    const x0 = 100 - i * step;
    const xMid = 100 - (i + 0.5) * step;
    points.push(`${x0.toFixed(2)}% calc(100% - ${depthPx}px)`);
    points.push(`${xMid.toFixed(2)}% 100%`);
  }
  points.push(`0% calc(100% - ${depthPx}px)`);
  return `polygon(${points.join(", ")})`;
}

export default function ReceiptPrinter({
  isOpen = false,
  stage = "processing", // "processing" | "printing" | "complete"
  orderData = null,
  onClose = () => {}
}) {
  const serratedClip = useMemo(() => createSerratedClipPath(40, 4), []);

  if (!isOpen) return null;

  const {
    orderId = "10001",
    date = new Date().toLocaleDateString("ar-DZ", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    phone = "",
    address = "",
    notes = "",
    items = [],
    subtotal = 0,
    deliveryFee = 200,
    total = 0,
    whatsappUrl = ""
  } = orderData || {};

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.82)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          WebkitOverflowScrolling: "touch"
        }}
        dir="rtl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[340px] my-6 flex flex-col items-center select-none"
        >
          {/* ========================================================
              PRINTER MACHINE HOUSING
              ======================================================== */}
          <div 
            className="w-full rounded-3xl p-5 relative z-20 shadow-2xl"
            style={{
              background: "linear-gradient(180deg, #241A16 0%, #17110E 100%)",
              border: "1.5px solid #3D1408",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.85), inset 0 1px 1px rgba(255, 255, 255, 0.12)"
            }}
          >
            {/* Top Vent / Brand Indicator */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
              </div>
              <div className="text-[11px] font-black tracking-wider text-orange-400/80 uppercase">
                WINGO! POS-400
              </div>
              <div className="flex items-center gap-1">
                <span 
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    stage === "complete" 
                      ? "bg-emerald-500 shadow-[0_0_8px_#10B981]" 
                      : stage === "printing"
                      ? "bg-amber-400 shadow-[0_0_8px_#FBBF24] animate-pulse"
                      : "bg-orange-500 shadow-[0_0_8px_#F97316] animate-ping"
                  }`}
                />
              </div>
            </div>

            {/* Recessed Status Screen */}
            <div 
              className="rounded-xl px-4 py-3 flex items-center justify-between"
              style={{
                backgroundColor: "#0A0706",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                boxShadow: "inset 0 2px 6px rgba(0, 0, 0, 0.85), 0 1px 0 rgba(255, 255, 255, 0.05)"
              }}
            >
              <div className="flex items-center gap-3">
                {stage === "processing" && (
                  <Loader2 className="w-4 h-4 text-orange-400 animate-spin flex-shrink-0" />
                )}
                {stage === "printing" && (
                  <div className="w-4 h-4 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin flex-shrink-0" />
                )}
                {stage === "complete" && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 animate-bounce" />
                )}
                <div className="text-[13px] font-bold text-[#FFF8F0]">
                  {stage === "processing" && "جاري إرسال طلبك..."}
                  {stage === "printing" && "جاري طباعة الوصل..."}
                  {stage === "complete" && "تم تأكيد طلبك بنجاح"}
                </div>
              </div>
              <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                {stage === "complete" ? "READY" : "BUSY"}
              </div>
            </div>

            {/* Bottom Paper Exit Slot */}
            <div 
              className="mt-4 h-2 rounded-full w-full relative"
              style={{
                backgroundColor: "#050403",
                boxShadow: "inset 0 3px 5px rgba(0, 0, 0, 0.95), 0 1px 0 rgba(255, 255, 255, 0.06)"
              }}
            />
          </div>

          {/* ========================================================
              PAPER FEEDER VIEWPORT (Clips paper as it emerges)
              ======================================================== */}
          <div className="w-[94%] overflow-hidden relative -mt-1 z-10">
            <motion.div
              initial={{ translateY: "-100%" }}
              animate={
                stage === "printing" || stage === "complete"
                  ? { translateY: printingTransformKeyframes }
                  : { translateY: "-100%" }
              }
              transition={
                stage === "printing"
                  ? {
                      duration: 1.75,
                      times: printingKeyframeTimes,
                      ease: "linear"
                    }
                  : { duration: 0 }
              }
              style={{
                clipPath: serratedClip,
                backgroundColor: "#FFFDF9",
                color: "#1C1411",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.45)"
              }}
              className="p-5 pt-6 pb-8 text-right font-sans"
            >
              {/* Receipt Header */}
              <div className="text-center pb-3">
                <div className="text-2xl font-black tracking-tight text-[#3D1408]">
                  WINGO!
                </div>
                <div className="text-[11px] font-extrabold text-neutral-500 mt-0.5">
                  وصل طلب زبون إلكتروني
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5 font-medium">
                  المدية، الجزائر • خدمة التوصيل السريع
                </div>
              </div>

              {/* Dashed Divider */}
              <div className="border-b border-dashed border-neutral-300 my-2.5" />

              {/* Order Meta */}
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between items-center text-neutral-600">
                  <span className="font-bold">رقم الطلب:</span>
                  <span className="font-mono font-black text-neutral-900">#{orderId}</span>
                </div>
                <div className="flex justify-between items-center text-neutral-600">
                  <span className="font-bold">التاريخ:</span>
                  <span className="font-medium text-neutral-800">{date}</span>
                </div>
                {phone && (
                  <div className="flex justify-between items-center text-neutral-600">
                    <span className="font-bold">الهاتف:</span>
                    <span className="font-mono font-bold text-neutral-900" dir="ltr">{phone}</span>
                  </div>
                )}
                {address && (
                  <div className="flex justify-between items-start text-neutral-600 gap-2">
                    <span className="font-bold flex-shrink-0">العنوان:</span>
                    <span className="font-medium text-neutral-800 text-left line-clamp-2">{address}</span>
                  </div>
                )}
                {notes && (
                  <div className="flex justify-between items-start text-neutral-600 gap-2 pt-0.5">
                    <span className="font-bold flex-shrink-0">ملاحظات:</span>
                    <span className="font-medium text-neutral-700 text-left line-clamp-2">{notes}</span>
                  </div>
                )}
              </div>

              {/* Dashed Divider */}
              <div className="border-b border-dashed border-neutral-300 my-2.5" />

              {/* Items List */}
              <div className="space-y-2 my-2">
                <div className="text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-1">
                  الوجبات المطلوبة
                </div>
                {items && items.length > 0 ? (
                  items.map((it, idx) => {
                    const lineTotal = (it.unitPrice || 0) * (it.qty || 1);
                    return (
                      <div key={idx} className="text-[11.5px] leading-tight pb-1 border-b border-neutral-100 last:border-none">
                        <div className="flex justify-between items-baseline font-bold text-neutral-900">
                          <span>{it.title || "وجبة أجنحة"} <span className="text-neutral-500 font-normal">×{it.qty || 1}</span></span>
                          <span className="font-mono font-black text-neutral-900">{lineTotal.toLocaleString("fr-DZ")} دج</span>
                        </div>
                        {it.spiceTitle && (
                          <div className="text-[10px] text-neutral-500 mt-0.5">
                            الحرارة: {it.spiceTitle}
                          </div>
                        )}
                        {it.sauceName && (
                          <div className="text-[10px] text-neutral-500">
                            الصوص: {it.sauceName}
                          </div>
                        )}
                        {it.includesSummary && (
                          <div className="text-[10px] text-neutral-500">
                            {it.includesSummary}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-[11px] text-neutral-500">وجبة أجنحة مقرمشة</div>
                )}
              </div>

              {/* Dashed Divider */}
              <div className="border-b border-dashed border-neutral-300 my-2.5" />

              {/* Totals */}
              <div className="space-y-1.5 text-[11.5px]">
                <div className="flex justify-between items-center text-neutral-600">
                  <span className="font-bold">المجموع الفرعي:</span>
                  <span className="font-mono font-medium">{subtotal.toLocaleString("fr-DZ")} دج</span>
                </div>
                <div className="flex justify-between items-center text-neutral-600">
                  <span className="font-bold">التوصيل (المدية):</span>
                  <span className="font-mono font-medium">{deliveryFee} دج</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-neutral-200 text-sm font-black text-[#3D1408]">
                  <span>الإجمالي للدفع:</span>
                  <span className="font-mono text-base font-black text-orange-600">
                    {total.toLocaleString("fr-DZ")} دج
                  </span>
                </div>
              </div>

              {/* Dashed Divider */}
              <div className="border-b border-dashed border-neutral-300 my-3" />

              {/* Payment & Barcode Footer */}
              <div className="text-center pt-1">
                <div className="inline-block px-2.5 py-1 bg-neutral-100 rounded-md text-[10.5px] font-extrabold text-neutral-700 mb-2">
                  طريقة الدفع: الدفع نقداً عند الاستلام (COD)
                </div>

                {/* SVG Barcode Visual */}
                <div className="w-full my-2 flex flex-col items-center opacity-85">
                  <svg className="w-full h-8" viewBox="0 0 200 32" preserveAspectRatio="none">
                    <rect x="0" y="0" width="2" height="32" fill="#1C1411"/>
                    <rect x="4" y="0" width="1" height="32" fill="#1C1411"/>
                    <rect x="7" y="0" width="3" height="32" fill="#1C1411"/>
                    <rect x="12" y="0" width="1" height="32" fill="#1C1411"/>
                    <rect x="15" y="0" width="2" height="32" fill="#1C1411"/>
                    <rect x="19" y="0" width="4" height="32" fill="#1C1411"/>
                    <rect x="25" y="0" width="1" height="32" fill="#1C1411"/>
                    <rect x="28" y="0" width="3" height="32" fill="#1C1411"/>
                    <rect x="33" y="0" width="2" height="32" fill="#1C1411"/>
                    <rect x="37" y="0" width="1" height="32" fill="#1C1411"/>
                    <rect x="40" y="0" width="3" height="32" fill="#1C1411"/>
                    <rect x="45" y="0" width="2" height="32" fill="#1C1411"/>
                    <rect x="49" y="0" width="1" height="32" fill="#1C1411"/>
                    <rect x="52" y="0" width="4" height="32" fill="#1C1411"/>
                    <rect x="58" y="0" width="2" height="32" fill="#1C1411"/>
                    <rect x="62" y="0" width="1" height="32" fill="#1C1411"/>
                    <rect x="65" y="0" width="3" height="32" fill="#1C1411"/>
                    <rect x="70" y="0" width="1" height="32" fill="#1C1411"/>
                    <rect x="73" y="0" width="2" height="32" fill="#1C1411"/>
                    <rect x="77" y="0" width="4" height="32" fill="#1C1411"/>
                    <rect x="83" y="0" width="1" height="32" fill="#1C1411"/>
                    <rect x="86" y="0" width="3" height="32" fill="#1C1411"/>
                    <rect x="91" y="0" width="2" height="32" fill="#1C1411"/>
                    <rect x="95" y="0" width="1" height="32" fill="#1C1411"/>
                    <rect x="98" y="0" width="3" height="32" fill="#1C1411"/>
                    <rect x="103" y="0" width="1" height="32" fill="#1C1411"/>
                    <rect x="106" y="0" width="4" height="32" fill="#1C1411"/>
                    <rect x="112" y="0" width="2" height="32" fill="#1C1411"/>
                    <rect x="116" y="0" width="1" height="32" fill="#1C1411"/>
                    <rect x="119" y="0" width="3" height="32" fill="#1C1411"/>
                    <rect x="124" y="0" width="2" height="32" fill="#1C1411"/>
                    <rect x="128" y="0" width="1" height="32" fill="#1C1411"/>
                    <rect x="131" y="0" width="4" height="32" fill="#1C1411"/>
                    <rect x="137" y="0" width="2" height="32" fill="#1C1411"/>
                    <rect x="141" y="0" width="1" height="32" fill="#1C1411"/>
                    <rect x="144" y="0" width="3" height="32" fill="#1C1411"/>
                    <rect x="149" y="0" width="1" height="32" fill="#1C1411"/>
                    <rect x="152" y="0" width="3" height="32" fill="#1C1411"/>
                    <rect x="157" y="0" width="2" height="32" fill="#1C1411"/>
                    <rect x="161" y="0" width="4" height="32" fill="#1C1411"/>
                    <rect x="167" y="0" width="1" height="32" fill="#1C1411"/>
                    <rect x="170" y="0" width="3" height="32" fill="#1C1411"/>
                    <rect x="175" y="0" width="2" height="32" fill="#1C1411"/>
                    <rect x="179" y="0" width="1" height="32" fill="#1C1411"/>
                    <rect x="182" y="0" width="4" height="32" fill="#1C1411"/>
                    <rect x="188" y="0" width="2" height="32" fill="#1C1411"/>
                    <rect x="192" y="0" width="1" height="32" fill="#1C1411"/>
                    <rect x="195" y="0" width="3" height="32" fill="#1C1411"/>
                  </svg>
                  <div className="text-[9.5px] font-mono tracking-widest text-neutral-400 mt-1">
                    * WINGO-ORD-{orderId} *
                  </div>
                </div>

                <div className="text-[11px] font-bold text-neutral-600 mt-2">
                  شكراً لطلبك من WINGO! ❤️
                </div>
              </div>
            </motion.div>
          </div>

          {/* ========================================================
              BOTTOM ACTION BUTTONS (Smoothly appears on complete)
              ======================================================== */}
          {stage === "complete" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.25 }}
              className="w-full mt-4 flex flex-col gap-2 z-20"
            >
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 px-6 rounded-full font-black text-sm text-white flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all"
                style={{
                  background: "linear-gradient(135deg, #FF7A00 0%, #EA580C 100%)",
                  boxShadow: "0 8px 20px rgba(249, 115, 22, 0.4)"
                }}
              >
                <span>العودة للقائمة</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>

              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-full text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center gap-2 hover:bg-emerald-900/40 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>متابعة الطلب عبر واتساب</span>
                </a>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
