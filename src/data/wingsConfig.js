/**
 * Build Your Wings - صمّم أجنحتك بنفسك
 * Restaurant Location: Médéa, Algeria (المدية، الجزائر) 🇩🇿
 * 
 * Centralized Backend-Ready Configuration:
 * All meal builder options, image layer paths, prices in DZD (دج),
 * sauces, toppings, spice levels, and restaurant metadata.
 */

export const RESTAURANT_INFO = {
  name: "Build Your Wings",
  nameAr: "صمّم أجنحتك بنفسك",
  brandShort: "WINGS MÉDÉA",
  tagline: "أشهى أجنحة دجاج مقرمشة وغارقة بالصوص في المدية",
  taglineSub: "Crispy • Saucy • Made to Order in Médéa",
  city: "المدية",
  cityEn: "Médéa",
  country: "الجزائر",
  countryCode: "DZ",
  fullLocation: "المدية، الجزائر (Médéa, Algeria) 🇩🇿",
  address: "وسط المدينة، قرب ساحة أول نوفمبر، المدية 26000",
  phone: "+213 555 98 76 54",
  whatsappNumber: "213555987654",
  openingHours: "11:30 - 23:00 (كل يوم)",
  isOpen: true,
  estimatedTime: "15 - 25 دقيقة",
  currency: "دج",
  currencyEn: "DZD",
};

// Layer 1: Base Wings & Plate Layer (Dynamic per quantity)
export const WINGS_QUANTITIES = [
  {
    id: "qty_6",
    count: 6,
    title: "6 قطع أجنحة",
    titleEn: "6 Wings",
    price: 600, // DZD
    badge: "وجبة فردية",
    badgeColor: "zinc",
    description: "وجبة فردية خفيفة ومشبعة مقلية ومقرمشة بعناية.",
    image: "/assets/layers/base_wings_6.png",
    recommended: false,
    calories: "approx. 490 kcal",
  },
  {
    id: "qty_12",
    count: 12,
    title: "12 قطعة أجنحة",
    titleEn: "12 Wings",
    price: 1150, // DZD
    badge: "الأكثر طلباً 🔥",
    badgeColor: "orange",
    description: "الحجم المفضل للأكيلة في المدية، مناسب لشخصين أو وجبة دسمة.",
    image: "/assets/layers/base_wings_12.png",
    recommended: true,
    calories: "approx. 980 kcal",
  },
  {
    id: "qty_24",
    count: 24,
    title: "24 قطعة أجنحة",
    titleEn: "24 Wings",
    price: 2200, // DZD
    badge: "وليمة وسهرة أصحاب 👑",
    badgeColor: "gold",
    description: "طبق العائلة والأصدقاء، هرم ضخم من الأجنحة المقرمشة.",
    image: "/assets/layers/base_wings_24.png",
    recommended: false,
    calories: "approx. 1950 kcal",
  },
];

// Layer 2: Sauce Glaze Layer (Transparent PNG overlays with glossy specular sheen)
export const SAUCES = [
  {
    id: "sauce_none",
    name: "مقرمشة بدون صصوص",
    nameEn: "Crispy Plain (No Sauce)",
    price: 0,
    image: null,
    color: "transparent",
    dotColor: "#D97706",
    blendMode: "normal",
    opacity: 1,
    description: "أجنحة ذهبية مقلية فريش بدون أي صوص للحفاظ على أقصى درجات القرمشة.",
    isSignature: false,
  },
  {
    id: "sauce_algeria",
    name: "الصوص الجزائرية 🇩🇿",
    nameEn: "Signature Algeria Sauce",
    price: 0,
    image: "/assets/layers/sauce_algeria.png",
    color: "#EA580C",
    dotColor: "#F97316",
    blendMode: "normal",
    opacity: 0.96,
    description: "وصفة خاصة بالعلامة في المدية: متوازنة بين الحلاوة والحرارة المتبلة بالبصل والبهارات.",
    isSignature: true,
    signatureBadge: "⭐ SIGNATURE",
  },
  {
    id: "sauce_bbq",
    name: "باربكيو مدخن (BBQ)",
    nameEn: "Smokey BBQ Glaze",
    price: 0,
    image: "/assets/layers/sauce_bbq.png",
    color: "#3B1408",
    dotColor: "#78350F",
    blendMode: "normal",
    opacity: 0.95,
    description: "صوص باربكيو داكن وغني بالنكهة المدخنة ولمسة كراميل خفيفة ولامعة.",
    isSignature: false,
  },
  {
    id: "sauce_buffalo",
    name: "بافالو كلاسيك (Buffalo)",
    nameEn: "Zesty Buffalo Glaze",
    price: 0,
    image: "/assets/layers/sauce_buffalo.png",
    color: "#DC2626",
    dotColor: "#EF4444",
    blendMode: "normal",
    opacity: 0.95,
    description: "الصوص الأمريكي الكلاسيكي الأصلي بلون أحمر ناري ونكهة حامضة ولاذعة.",
    isSignature: false,
  },
  {
    id: "sauce_cheese",
    name: "صوص الجبن الذائب (Cheese)",
    nameEn: "Melted Cheddar Cheese",
    price: 50,
    image: "/assets/layers/sauce_cheese.png",
    color: "#F59E0B",
    dotColor: "#FBBF24",
    blendMode: "normal",
    opacity: 0.96,
    description: "صوص شيدر دافئ وناعم يسيل على الأجنحة بطعم غني ودسم.",
    isSignature: false,
  },
  {
    id: "sauce_honey_mustard",
    name: "عسل وخردل (Honey Mustard)",
    nameEn: "Sweet Honey Mustard",
    price: 0,
    image: "/assets/layers/sauce_honey_mustard.png",
    color: "#EAB308",
    dotColor: "#FACC15",
    blendMode: "normal",
    opacity: 0.95,
    description: "توازن رائع يجمع بين حلاوة العسل الصافي ولذعة الخردل الذهبي اللامع.",
    isSignature: false,
  },
  {
    id: "sauce_white",
    name: "الصوص البيضاء (White Sauce)",
    nameEn: "Creamy Garlic Ranch",
    price: 0,
    image: "/assets/layers/sauce_white.png",
    color: "#F1F5F9",
    dotColor: "#E2E8F0",
    blendMode: "normal",
    opacity: 0.96,
    description: "صوص كريمي أبيض بارد وغني بنكهة الثوم الخفيف والأعشاب المنعشة.",
    isSignature: false,
  },
];

// Layer 3: Toppings Layers (Multi-select Stackable transparent PNGs)
export const TOPPINGS = [
  {
    id: "top_extra_cheese",
    name: "جبن إضافي ذائب",
    nameEn: "Extra Melted Cheese",
    price: 70, // DZD
    image: "/assets/layers/topping_extra_cheese.png",
    icon: "🧀",
    badge: "دسم وغني",
    description: "خيوط وقطرات من الشيدر الذهبي الذائب فوق الصوص والأجنحة.",
  },
  {
    id: "top_chili_slices",
    name: "قطع فلفل حار طازجة",
    nameEn: "Fresh Chili Pepper Slices",
    price: 30, // DZD
    image: "/assets/layers/topping_chili_slices.png",
    icon: "🌶️",
    badge: "كرانش حار",
    description: "دوائر فلفل أحمر طازجة ومقرمشة مع البذور للنكهة الحقيقية.",
  },
  {
    id: "top_sesame",
    name: "رشة سمسم محمص",
    nameEn: "Toasted Sesame Seeds",
    price: 20, // DZD
    image: "/assets/layers/topping_sesame.png",
    icon: "✨",
    badge: "لمسة فاخرة",
    description: "حبيبات سمسم ذهبية وأخرى محمصة تمنح نكهة مكسرات ومظهراً احترافياً.",
  },
  {
    id: "top_green_onions",
    name: "بصل أخضر مقطع",
    nameEn: "Chopped Green Onions",
    price: 20, // DZD
    image: "/assets/layers/topping_green_onions.png",
    icon: "🌱",
    badge: "انتعاش فريش",
    description: "حلقات بصل أخضر طازجة مقرمشة تكسر الدسم وتضيف لوناً حيوياً.",
  },
];

// Layer 4: Spice Level Visual Effects Layer (CSS + Animated Overlays)
export const SPICE_LEVELS = [
  {
    id: "spice_mild",
    title: "بدون حار (Mild)",
    titleEn: "Mild & Crispy",
    level: 0,
    price: 0,
    icon: "Shield",
    badge: "هادئ ولذيذ",
    description: "نكهة دجاج مقرمش طبيعية بدون أي حرارة، مناسبة لجميع الأذواق والأطفال.",
    effectType: "none",
  },
  {
    id: "spice_medium",
    title: "حار متوسط (Medium 🌶️)",
    titleEn: "Medium Heat",
    level: 1,
    price: 0,
    icon: "Flame",
    badge: "توهج ممتع",
    description: "حرارة معتدلة وممتعة مع توهج أحمر خفيف حول الطبق ينبض بالحيوية.",
    effectType: "glow",
  },
  {
    id: "spice_extra_hot",
    title: "حار جداً (Extra Hot 🔥🔥)",
    titleEn: "Extra Fiery Hot",
    level: 2,
    price: 0,
    icon: "Zap",
    badge: "تحدي الأكيلة",
    description: "حرارة نارية قوية تطلق أعمدة الدخان/البخار وتوهجاً متوهجاً وجزيئات فلفل متطايرة!",
    effectType: "fire_smoke",
  },
];

// Preload Helper function
export const getAllLayerImageUrls = () => {
  const urls = [];
  WINGS_QUANTITIES.forEach((q) => q.image && urls.push(q.image));
  SAUCES.forEach((s) => s.image && urls.push(s.image));
  TOPPINGS.forEach((t) => t.image && urls.push(t.image));
  return urls;
};

// Price formatter for Algerian Dinar
export const formatDZD = (amount) => {
  return `${amount.toLocaleString("fr-DZ")} ${RESTAURANT_INFO.currency}`;
};
