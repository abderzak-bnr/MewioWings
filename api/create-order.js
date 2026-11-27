import { createClient } from '@supabase/supabase-js';

// Authoritative pricing definitions
const WING_PRICES = {
  3: 350,
  6: 650,
  9: 950,
  12: 1250,
  20: 1950,
};

const FREE_DIPS_ALLOWANCE = {
  3: 1,
  6: 2,
  9: 3,
  12: 4,
  20: 8,
};

function getFreeDipsAllowance(count) {
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  if (count <= 12) return 4;
  return 8;
}

const EXTRA_DIP_PRICE = 30;

const SIDE_PRICES = {
  fries: 200,
  side_fries: 200,
  coleslaw: 220,
  side_coleslaw: 220,
};

const READY_BOX_PRICES = {
  ready_solo: 850,
  box_solo: 850,
  solo: 850,
  ready_double: 1450,
  box_double: 1450,
  double: 1450,
  ready_friends: 2150,
  box_friends: 2150,
  friends: 2150,
  ready_party: 2750,
  box_party: 2750,
  party: 2750,
};

const FALLBACK_NAMES = {
  crispy: 'أجنحة مقرمشة كلاسيك',
  algeria: 'الصوص الجزائرية',
  algerian: 'الصوص الجزائرية',
  bbq: 'باربيكيو مدخن',
  buffalo: 'بافالو حار',
  garlic_mayo: 'مايونيز بالثوم',
  'garlic-mayo': 'مايونيز بالثوم',
  cheddar: 'شيدر دافئة',
  cheese: 'صوص الجبن',
  ranch: 'رانش كلاسيك',
  honey_mustard: 'هوني ماسترد',
  'honey-mustard': 'هوني ماسترد',
  spicy_mayo: 'مايونيز حار',
  'spicy-mayo': 'مايونيز حار',
  ketchup: 'كاتشب',
  fries: 'بطاطا مقلية',
  coleslaw: 'سلطة الكرنب',
};

function resolveItemName(rawId, dbItemsList = []) {
  if (!rawId) return '';
  const strId = String(rawId).trim();
  const normalized = strId.replace(/^(dip_|side_|sauce_|box_)/, '').replace(/-/g, '_');

  if (FALLBACK_NAMES[strId]) return FALLBACK_NAMES[strId];
  if (FALLBACK_NAMES[normalized]) return FALLBACK_NAMES[normalized];

  if (Array.isArray(dbItemsList)) {
    const found = dbItemsList.find((it) => {
      const itId = String(it.id || '').trim();
      const itNorm = itId.replace(/^(dip_|side_|sauce_|box_)/, '').replace(/-/g, '_');
      return (
        itId === strId ||
        itNorm === normalized ||
        itId === `dip_${strId}` ||
        itId === `side_${strId}` ||
        itId === `sauce_${strId}` ||
        itId === `box_${strId}`
      );
    });
    if (found && (found.name_ar || found.name)) {
      return found.name_ar || found.name;
    }
  }

  return strId;
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ error: 'صيغة البيانات غير صحيحة' });
    }
  }

  const { customer_phone, customer_address, notes, items } = body || {};

  // 1. Phone validation (Algerian mobile format: ^0[567]\d{8}$)
  const rawPhone = String(customer_phone || '').trim();
  let cleanPhone = rawPhone.replace(/\D/g, '');
  if (cleanPhone.startsWith('213') && cleanPhone.length === 12) {
    cleanPhone = '0' + cleanPhone.slice(3);
  }
  const algerianMobileRegex = /^0[567]\d{8}$/;
  if (!cleanPhone || !algerianMobileRegex.test(cleanPhone)) {
    return res.status(400).json({
      error: 'رقم هاتف جزائري غير صحيح. يرجى إدخال رقم جوال مكون من 10 أرقام يبدأ بـ 05 أو 06 أو 07',
    });
  }

  // 2. Address validation
  const cleanAddress = String(customer_address || '').trim();
  if (!cleanAddress || cleanAddress.length < 4) {
    return res.status(400).json({
      error: 'يرجى كتابة عنوان التوصيل بالتفصيل (الحي، الشارع، المعلم بالمدية)',
    });
  }

  // 3. Cart items validation
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'سلة طلباتك فارغة! أضف وجبة أولاً.' });
  }
  if (items.length > 50) {
    return res.status(400).json({ error: 'تجاوزت الحد الأقصى للأصناف في طلب واحد' });
  }

  // Supabase client initialization (prefer server-side service role key if available)
  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    'https://pdjklzzxketldcwiywwo.supabase.co';
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    'sb_publishable_fbWK_m98yEfY7VwakFWZ2A_iLLGBZoA';

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 4. Store Open/Closed Enforcement & Delivery Fee from store_settings
  let storeSettings = null;
  try {
    const { data: settingsData } = await supabase
      .from('store_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    storeSettings = settingsData;
  } catch (err) {
    console.warn('Could not read store_settings:', err);
  }

  if (storeSettings && storeSettings.is_open === false) {
    return res.status(403).json({ error: 'المطعم مغلق حالياً ولا يستقبل طلبات' });
  }

  const deliveryFee =
    storeSettings && typeof storeSettings.delivery_fee === 'number'
      ? storeSettings.delivery_fee
      : 200;

  // 5. Fetch dynamic menu_items from DB if available for live price synchronization
  let dbItemsList = [];
  const menuMap = new Map();
  try {
    const { data: dbItems } = await supabase.from('menu_items').select('*');
    if (dbItems && Array.isArray(dbItems)) {
      dbItemsList = dbItems;
      dbItems.forEach((it) => {
        menuMap.set(it.id, it);
      });
    }
  } catch (err) {
    console.warn('Could not query menu_items from database, using authoritative defaults:', err);
  }

  // 6. Server-Side Price & Total Verification
  let verifiedSubtotal = 0;
  const verifiedItems = [];

  for (const item of items) {
    const qty = Math.max(1, Math.min(20, Math.floor(Number(item.qty) || 1)));
    let unitPrice = 0;

    if (item.type === 'custom') {
      // Build Your Own Meal
      let wingsCount = Number(item.wingsCount) || 6;
      if (![3, 6, 9, 12, 20].includes(wingsCount)) {
        wingsCount = 6;
      }

      // Base wings price
      const dbWing = menuMap.get(`wing_${wingsCount}`);
      const baseWingPrice = dbWing && typeof dbWing.price === 'number' ? dbWing.price : (WING_PRICES[wingsCount] || 650);

      // Resolve sauce name
      const resolvedSauce = resolveItemName(item.sauceName || item.sauceId, dbItemsList);

      // Free dips calculation
      const freeAllowance = FREE_DIPS_ALLOWANCE[wingsCount] || getFreeDipsAllowance(wingsCount);
      let totalDipsCount = 0;
      const resolvedDipsList = [];
      if (item.selectedDips && typeof item.selectedDips === 'object') {
        Object.entries(item.selectedDips).forEach(([dId, dq]) => {
          const count = Math.max(0, Math.min(20, Math.floor(Number(dq) || 0)));
          if (count > 0) {
            totalDipsCount += count;
            resolvedDipsList.push({
              id: dId,
              name: resolveItemName(dId, dbItemsList),
              qty: count,
            });
          }
        });
      }
      const extraDipsCount = Math.max(0, totalDipsCount - freeAllowance);
      const extraDipsCost = extraDipsCount * EXTRA_DIP_PRICE;

      // Sides calculation
      let sidesCost = 0;
      const resolvedSidesList = [];
      if (item.selectedSides && typeof item.selectedSides === 'object') {
        Object.entries(item.selectedSides).forEach(([sId, sq]) => {
          const sQuantity = Math.max(0, Math.min(20, Math.floor(Number(sq) || 0)));
          if (sQuantity > 0) {
            const dbSide = menuMap.get(sId) || menuMap.get(`side_${sId}`);
            const sidePrice = dbSide && typeof dbSide.price === 'number' ? dbSide.price : (SIDE_PRICES[sId] || 200);
            sidesCost += sidePrice * sQuantity;
            resolvedSidesList.push({
              id: sId,
              name: resolveItemName(sId, dbItemsList),
              qty: sQuantity,
            });
          }
        });
      }

      unitPrice = baseWingPrice + extraDipsCost + sidesCost;

      verifiedItems.push({
        ...item,
        sauceName: resolvedSauce || item.sauceName,
        dipsBreakdown: {
          items: resolvedDipsList,
          freeAllowance,
          totalDipsCount,
        },
        resolvedSides: resolvedSidesList,
        wingsCount,
        qty,
        unitPrice,
        verifiedLineTotal: unitPrice * qty,
      });
    } else {
      // Ready Box / Ready Meal
      const itemId = String(item.id || item.dbId || '');
      const dbBox = menuMap.get(itemId) || menuMap.get(`box_${itemId.replace('ready_', '')}`);
      if (dbBox && typeof dbBox.price === 'number') {
        unitPrice = dbBox.price;
      } else if (READY_BOX_PRICES[itemId]) {
        unitPrice = READY_BOX_PRICES[itemId];
      } else {
        unitPrice = Math.max(0, Number(item.unitPrice) || 850);
      }

      const resolvedSauce = resolveItemName(item.sauceName || item.sauceId, dbItemsList);

      verifiedItems.push({
        ...item,
        sauceName: resolvedSauce || item.sauceName,
        qty,
        unitPrice,
        verifiedLineTotal: unitPrice * qty,
      });
    }

    verifiedSubtotal += unitPrice * qty;
  }

  const verifiedGrandTotal = verifiedSubtotal + deliveryFee;
  const orderId = Math.floor(100000 + Math.random() * 900000);

  // 7. Insert Order into Supabase
  const orderPayload = {
    customer_phone: cleanPhone,
    customer_address: cleanAddress,
    notes: String(notes || '').trim(),
    items: verifiedItems,
    subtotal: verifiedSubtotal,
    delivery_fee: deliveryFee,
    total: verifiedGrandTotal,
    status: 'new',
  };

  let finalOrderId = orderId;
  let insertError = null;

  try {
    const res = await supabase.from('orders').insert([orderPayload]).select('id').maybeSingle();
    if (res.error) {
      // Fallback for restricted anon RLS where select is forbidden but insert is allowed
      const plainRes = await supabase.from('orders').insert([orderPayload]);
      if (plainRes.error) {
        insertError = plainRes.error;
      }
    } else if (res.data && res.data.id) {
      finalOrderId = res.data.id;
    }
  } catch (err) {
    insertError = err;
  }

  if (insertError) {
    console.error('Supabase order insert error:', insertError);
    return res.status(500).json({
      error: `حدث خطأ أثناء تسجيل طلبك: ${insertError.message || 'يرجى المحاولة مجدداً'}`,
    });
  }

  // 8. Server-Side Telegram Notification Dispatch
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN || storeSettings?.telegram_bot_token;
    const chatId = process.env.TELEGRAM_CHAT_ID || storeSettings?.telegram_chat_id;

    if (botToken && chatId) {
      const cleanToken = String(botToken).trim();
      const cleanChatId = String(chatId).trim();

      if (cleanToken && cleanChatId) {
        let teleText = `🍗 <b>طلب جديد #${finalOrderId}</b>\n`;
        teleText += `━━━━━━━━━━━━━━━━━━━━\n`;
        teleText += `📞 <b>الهاتف:</b> <code>${cleanPhone}</code>\n`;
        teleText += `📍 <b>العنوان:</b> ${escapeHtml(cleanAddress)}\n`;
        if (notes && String(notes).trim()) {
          teleText += `📝 <b>ملاحظات:</b> ${escapeHtml(notes)}\n`;
        }
        teleText += `━━━━━━━━━━━━━━━━━━━━\n`;
        teleText += `📦 <b>الوجبات (${verifiedItems.length}):</b>\n`;

        verifiedItems.forEach((it, idx) => {
          const lTot = it.unitPrice * (it.qty || 1);
          teleText += `• [${idx + 1}] <b>${escapeHtml(it.title)}</b> (×${it.qty || 1}) — ${lTot.toLocaleString('fr-DZ')} دج\n`;
          if (it.type === 'custom') {
            teleText += `   - حرارة: ${escapeHtml(it.spiceTitle || 'غير حار')}\n`;
            if (it.selectedDips && Object.keys(it.selectedDips).length > 0) {
              const freeAllowance = it.freeDipsAllowance || getFreeDipsAllowance(it.wingsCount || 6);
              const dipsList = [];
              for (const [dId, q] of Object.entries(it.selectedDips)) {
                if (q > 0) {
                  const dName = resolveItemName(dId, dbItemsList);
                  dipsList.push(`${escapeHtml(dName)} ×${q}`);
                }
              }
              if (dipsList.length > 0) {
                teleText += `   - الصوصات (${freeAllowance} مجانية): ${dipsList.join('، ')}\n`;
              }
            }
            if (it.selectedSides && Object.keys(it.selectedSides).length > 0) {
              const sidesList = [];
              for (const [sId, q] of Object.entries(it.selectedSides)) {
                if (q > 0) {
                  const sName = resolveItemName(sId, dbItemsList);
                  sidesList.push(`${escapeHtml(sName)} ×${q}`);
                }
              }
              if (sidesList.length > 0) {
                teleText += `   - الإضافات: ${sidesList.join('، ')}\n`;
              }
            }
          } else {
            const sauceDisplay = resolveItemName(it.sauceName || it.sauceId, dbItemsList);
            teleText += `   - صوص: ${escapeHtml(sauceDisplay || '-')} • حرارة: ${escapeHtml(it.spiceTitle || 'عادي')}\n`;
            if (it.includesSummary) {
              teleText += `   - يتضمن: ${escapeHtml(it.includesSummary)}\n`;
            }
          }
        });

        teleText += `━━━━━━━━━━━━━━━━━━━━\n`;
        teleText += `💰 <b>المجموع الفرعي:</b> ${verifiedSubtotal.toLocaleString('fr-DZ')} دج\n`;
        teleText += `🛵 <b>التوصيل:</b> ${deliveryFee} دج\n`;
        teleText += `💵 <b>المجموع النهائي:</b> <b>${verifiedGrandTotal.toLocaleString('fr-DZ')} دج</b>\n`;
        teleText += `⏰ <b>الوقت:</b> ${new Date().toLocaleTimeString('ar-DZ')}\n`;

        const teleRes = await fetch(`https://api.telegram.org/bot${cleanToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: cleanChatId,
            text: teleText,
            parse_mode: 'HTML',
          }),
        });

        const teleJson = await teleRes.json();
        if (!teleJson.ok) {
          console.error('Telegram API response error:', teleJson);
        } else {
          console.log('Server Telegram order notification sent successfully!');
        }
      }
    }
  } catch (teleErr) {
    console.error('Server Telegram notification error:', teleErr);
  }

  // 9. Return verified success response
  return res.status(200).json({
    success: true,
    orderId: finalOrderId,
    total: verifiedGrandTotal,
    subtotal: verifiedSubtotal,
    deliveryFee: deliveryFee,
  });
}
