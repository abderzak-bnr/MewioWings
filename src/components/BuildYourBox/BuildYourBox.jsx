import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  ShoppingBag, 
  RotateCcw, 
  CheckCircle2, 
  Flame, 
  Sparkles,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  WINGS_COUNTS, 
  WINGS_STYLES, 
  COATING_SAUCES, 
  DIP_SAUCES, 
  SIDES_AND_EXTRAS, 
  MENU_RULES, 
  formatDZD 
} from '../../data/menuData';
import { useCart } from '../../context/CartContext';
import { Step1WingsCount } from './Step1WingsCount';
import { Step2WingsStyle } from './Step2WingsStyle';
import { Step3CoatingSauce } from './Step3CoatingSauce';
import { Step4Dips } from './Step4Dips';
import { Step5Sides } from './Step5Sides';

export const BuildYourBox = () => {
  const { addToCart } = useCart();

  // Builder States (defaults to the most popular choice: 6 wings, saucy, algeria sauce)
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedWings, setSelectedWings] = useState(WINGS_COUNTS[1]); // Default 6 wings
  const [selectedStyle, setSelectedStyle] = useState(WINGS_STYLES[1]); // Default saucy
  const [selectedCoatingSauce, setSelectedCoatingSauce] = useState(COATING_SAUCES[0]); // Default Algeria Sauce 🇩🇿
  const [selectedDips, setSelectedDips] = useState({ [DIP_SAUCES[0].id]: 1 }); // Default 1 dip
  const [selectedSides, setSelectedSides] = useState({});
  const [boxQuantity, setBoxQuantity] = useState(1);
  const [showSummaryCard, setShowSummaryCard] = useState(true);

  // Is saucy style active?
  const isSaucy = selectedStyle?.id === 'saucy';

  // Calculate pricing breakdown
  const basePrice = selectedWings ? selectedWings.price : 0;
  const freeDipsCount = selectedWings ? selectedWings.freeDips : 1;

  const totalDipsSelected = useMemo(() => {
    return Object.values(selectedDips).reduce((acc, qty) => acc + (qty || 0), 0);
  }, [selectedDips]);

  const extraDipsCount = Math.max(0, totalDipsSelected - freeDipsCount);
  const extraDipsPrice = extraDipsCount * MENU_RULES.extraDipPrice;

  const sidesPrice = useMemo(() => {
    return Object.entries(selectedSides).reduce((acc, [id, qty]) => {
      const item = SIDES_AND_EXTRAS.find((s) => s.id === id);
      return acc + (item ? item.price * (qty || 0) : 0);
    }, 0);
  }, [selectedSides]);

  const unitTotal = basePrice + extraDipsPrice + sidesPrice;
  const grandTotal = unitTotal * boxQuantity;

  // Handlers for selection
  const handleSelectWings = (wings) => {
    setSelectedWings(wings);
    // If the new wings count has more or less free dips, retain current dips or adjust smoothly
  };

  const handleSelectStyle = (style) => {
    setSelectedStyle(style);
    if (style.id === 'crispy') {
      setSelectedCoatingSauce(null);
    } else if (!selectedCoatingSauce) {
      setSelectedCoatingSauce(COATING_SAUCES[0]); // default to signature
    }
  };

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

  const handleUpdateSideQuantity = (sideId, qty) => {
    setSelectedSides((prev) => {
      const next = { ...prev };
      if (qty <= 0) {
        delete next[sideId];
      } else {
        next[sideId] = qty;
      }
      return next;
    });
  };

  // Step Navigation logic
  const goToNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (isSaucy) {
        setCurrentStep(3);
      } else {
        setCurrentStep(4); // Skip Step 3 for crispy!
      }
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    } else if (currentStep === 5) {
      handleFinalAddToCart();
    }
  };

  const goToPrevStep = () => {
    if (currentStep === 5) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (isSaucy) {
        setCurrentStep(3);
      } else {
        setCurrentStep(2); // Skip Step 3 back for crispy
      }
    } else if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  // Reset customizer
  const handleReset = () => {
    setSelectedWings(WINGS_COUNTS[1]);
    setSelectedStyle(WINGS_STYLES[1]);
    setSelectedCoatingSauce(COATING_SAUCES[0]);
    setSelectedDips({ [DIP_SAUCES[0].id]: 1 });
    setSelectedSides({});
    setCurrentStep(1);
    setBoxQuantity(1);
  };

  // Add customized box to Cart
  const handleFinalAddToCart = () => {
    // Collect details
    const dipsList = Object.entries(selectedDips).map(([id, qty]) => {
      const dipObj = DIP_SAUCES.find((d) => d.id === id);
      return {
        id,
        name: dipObj ? dipObj.name : id,
        nameAr: dipObj ? dipObj.nameAr : id,
        quantity: qty,
      };
    });

    const sidesList = Object.entries(selectedSides).map(([id, qty]) => {
      const sideObj = SIDES_AND_EXTRAS.find((s) => s.id === id);
      return {
        id,
        name: sideObj ? sideObj.name : id,
        nameAr: sideObj ? sideObj.nameAr : id,
        price: sideObj ? sideObj.price : 0,
        quantity: qty,
      };
    });

    const customBoxItem = {
      type: 'custom_box',
      title: `بوكس مخصص: ${selectedWings.title}`,
      subtitle: `${selectedStyle.nameAr} ${selectedCoatingSauce ? `• ${selectedCoatingSauce.name}` : ''}`,
      wingsCount: selectedWings,
      style: selectedStyle,
      coatingSauce: isSaucy ? selectedCoatingSauce : null,
      dips: dipsList,
      sides: sidesList,
      basePrice,
      extraDipsCount,
      extraDipsPrice,
      sidesPrice,
      unitTotal,
      quantity: boxQuantity,
    };

    addToCart(customBoxItem);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#ea580c', '#f59e0b', '#10b981'],
      });
    } catch (e) {
      // ignore in environments without canvas
    }
  };

  // Determine active steps based on style
  const stepsList = [
    { number: 1, label: 'الأجنحة', active: currentStep === 1, done: currentStep > 1 },
    { number: 2, label: 'الستايل', active: currentStep === 2, done: currentStep > 2 },
    { 
      number: 3, 
      label: 'الصوص', 
      active: currentStep === 3, 
      done: currentStep > 3,
      disabled: !isSaucy,
      skippedText: !isSaucy ? '(تخطي)' : ''
    },
    { number: 4, label: 'الديب', active: currentStep === 4, done: currentStep > 4 },
    { number: 5, label: 'الإضافات', active: currentStep === 5, done: currentStep > 5 },
  ];

  return (
    <div className="space-y-6 pb-28">
      {/* Hero Banner for Build Your Box */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 text-white p-5 sm:p-6 shadow-xl border border-zinc-800">
        <div className="absolute top-0 left-0 w-64 h-64 bg-brand-600/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-xs font-black border border-brand-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              صمم وجبتك قطعة بقطعة حسب ذوقك
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-tajawal tracking-tight">
              اصنع بوكس الأجنحة الخاص بك 🍗
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-xl leading-relaxed">
              اختر عدد الأجنحة، طريقة القرمشة، غطّسها بالصوص الساخن، وحدد صوصات الديب والإضافات المقرمشة.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="self-end sm:self-center flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 px-3 py-2 rounded-xl transition-all border border-zinc-700/60"
            title="إعادة ضبط الاختيارات"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة البدء</span>
          </button>
        </div>

        {/* Step Progress Bar & Indicators */}
        <div className="mt-6 pt-5 border-t border-zinc-800/90">
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {stepsList.map((step) => {
              const isCurrent = currentStep === step.number;
              const isDone = currentStep > step.number;
              const isDisabled = step.disabled;

              return (
                <button
                  key={step.number}
                  disabled={isDisabled}
                  onClick={() => {
                    if (!isDisabled) setCurrentStep(step.number);
                  }}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all text-center ${
                    isCurrent
                      ? 'bg-brand-600 text-white font-black shadow-md ring-2 ring-brand-400/40'
                      : isDone
                      ? 'bg-zinc-800/90 text-emerald-400 hover:bg-zinc-800'
                      : isDisabled
                      ? 'bg-zinc-900/40 text-zinc-600 cursor-not-allowed opacity-50'
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex items-center gap-1 mb-1">
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="text-[11px] font-bold">
                        {step.number}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold leading-tight">
                    {step.label}
                  </span>
                  {step.skippedText && (
                    <span className="text-[9px] text-zinc-500 font-normal">
                      {step.skippedText}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Configuration Floating Summary Card */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 p-4 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-base">📦</span>
            <span className="text-xs font-bold text-zinc-500">معاينة البوكس الحالي:</span>
          </div>
          <span className="text-base font-black text-brand-600">
            {formatDZD(unitTotal)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Wings */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-800 font-bold border border-zinc-200">
            🍗 {selectedWings.title} ({formatDZD(selectedWings.price)})
          </span>

          {/* Style */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-800 font-bold border border-zinc-200">
            {isSaucy ? '🔥 مغرقة بالصوص' : '✨ مقرمشة (Crispy)'}
          </span>

          {/* Coating sauce if saucy */}
          {isSaucy && selectedCoatingSauce && (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold border ${
              selectedCoatingSauce.isSignature 
                ? 'bg-amber-100 text-amber-900 border-amber-300' 
                : 'bg-orange-50 text-orange-800 border-orange-200'
            }`}>
              {selectedCoatingSauce.name}
            </span>
          )}

          {/* Dips count */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 font-medium border border-zinc-200">
            🥣 {totalDipsSelected} صوص ({freeDipsCount} مجاني {extraDipsCount > 0 ? `+ ${extraDipsCount} إضافي` : ''})
          </span>

          {/* Sides if selected */}
          {Object.keys(selectedSides).length > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
              🍟 {Object.values(selectedSides).reduce((a, b) => a + b, 0)} إضافات جانبية (+{formatDZD(sidesPrice)})
            </span>
          )}
        </div>
      </div>

      {/* Step Content Area */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-zinc-200 shadow-sm min-h-[380px]">
        {currentStep === 1 && (
          <Step1WingsCount
            selectedWings={selectedWings}
            onSelectWings={handleSelectWings}
          />
        )}

        {currentStep === 2 && (
          <Step2WingsStyle
            selectedStyle={selectedStyle}
            onSelectStyle={handleSelectStyle}
          />
        )}

        {currentStep === 3 && (
          <Step3CoatingSauce
            selectedSauce={selectedCoatingSauce}
            onSelectSauce={setSelectedCoatingSauce}
            isCrispyStyle={!isSaucy}
          />
        )}

        {currentStep === 4 && (
          <Step4Dips
            freeDipsCount={freeDipsCount}
            selectedDips={selectedDips}
            onUpdateDipQuantity={handleUpdateDipQuantity}
          />
        )}

        {currentStep === 5 && (
          <Step5Sides
            selectedSides={selectedSides}
            onUpdateSideQuantity={handleUpdateSideQuantity}
          />
        )}
      </div>

      {/* Step Navigation Controls (Prev / Next / Add to Cart) */}
      <div className="flex items-center justify-between gap-3 pt-2">
        {currentStep > 1 ? (
          <button
            onClick={goToPrevStep}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold text-sm transition-all active:scale-95"
          >
            <ArrowRight className="w-4 h-4" />
            <span>السابق</span>
          </button>
        ) : (
          <div />
        )}

        {currentStep < 5 ? (
          <button
            onClick={goToNextStep}
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-600 text-white font-extrabold text-sm shadow-md transition-all active:scale-95"
          >
            <span>الخطوة التالية</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleFinalAddToCart}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>أضف البوكس إلى السلة ({formatDZD(unitTotal)})</span>
          </button>
        )}
      </div>
    </div>
  );
};
