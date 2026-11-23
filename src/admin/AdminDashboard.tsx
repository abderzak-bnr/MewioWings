import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  ShoppingBag,
  Clock,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Plus,
  Trash2,
  Settings,
  LogOut,
  ExternalLink,
  DollarSign,
  TrendingUp,
  Package,
  Layers,
  Send,
  MessageCircle,
  Check,
  Eye,
  EyeOff,
  Pencil,
  X
} from 'lucide-react';

// Play crisp audio chime when new order arrives
function playOrderChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch (e) {
    console.warn('Audio notification unavailable', e);
  }
}

// Categories mapping and configuration
interface MenuCategory {
  key: string;
  label: string;
  legacyKeys?: string[];
}

const MENU_CATEGORIES: MenuCategory[] = [
  { key: 'wing_size', label: 'أحجام الأجنحة', legacyKeys: ['wings_count'] },
  { key: 'coating_sauce', label: 'صوصات الأجنحة' },
  { key: 'dip', label: 'الصوصات الجانبية', legacyKeys: ['dips'] },
  { key: 'side', label: 'الإضافات', legacyKeys: ['sides'] },
  { key: 'ready_box', label: 'الوجبات الجاهزة', legacyKeys: ['ready_boxes'] },
];

const CATEGORY_LABELS: Record<string, string> = {
  wing_size: 'أحجام الأجنحة',
  wings_count: 'أحجام الأجنحة',
  coating_sauce: 'صوصات الأجنحة',
  dip: 'الصوصات الجانبية',
  dips: 'الصوصات الجانبية',
  side: 'الإضافات',
  sides: 'الإضافات',
  ready_box: 'الوجبات الجاهزة',
  ready_boxes: 'الوجبات الجاهزة',
};

export default function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'settings'>('orders');

  // Auth States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // Menu State
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [itemFormName, setItemFormName] = useState('');
  const [itemFormCategory, setItemFormCategory] = useState('wing_size');
  const [itemFormPrice, setItemFormPrice] = useState(0);
  const [itemFormImage, setItemFormImage] = useState('');

  // Settings State
  const [settings, setSettings] = useState<any>({
    id: 1,
    is_open: true,
    delivery_fee: 200,
    telegram_bot_token: '',
    telegram_chat_id: '',
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState('');
  const [telegramTestMsg, setTelegramTestMsg] = useState('');

  // Check auth session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch data when session changes
  useEffect(() => {
    if (session) {
      fetchOrders();
      fetchMenuItems();
      fetchSettings();

      // Subscribe to Realtime Orders
      const channel = supabase
        .channel('admin-live-orders')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'orders' },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              playOrderChime();
              setOrders((prev) => [payload.new, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
              setOrders((prev) =>
                prev.map((o) => (o.id === payload.new.id ? payload.new : o))
              );
            } else if (payload.eventType === 'DELETE') {
              setOrders((prev) => prev.filter((o) => o.id === payload.old.id));
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session]);

  // Auth Handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMsg('');
    setAuthLoading(true);

    try {
      if (isSignUp) {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        if (data.session) {
          setSession(data.session);
        } else {
          setAuthSuccessMsg('تم إنشاء الحساب بنجاح! إذا طُلب تأكيد البريد، يرجى تفعيله ثم تسجيل الدخول.');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setAuthError(err.message || 'حدث خطأ في عملية تسجيل الدخول');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // Orders Functions
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      if (!error) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  // Menu Functions
  const fetchMenuItems = async () => {
    setMenuLoading(true);
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data) {
        setMenuItems(data);
      }
    } catch (err) {
      console.error('Error fetching menu items:', err);
    } finally {
      setMenuLoading(false);
    }
  };

  // Seed / Sync Menu Items from standard defaults using .upsert(rows, { onConflict: 'id' })
  const handleSeedMenu = async () => {
    setMenuLoading(true);
    try {
      const defaultItems = [
        // أحجام الأجنحة (wing_size)
        { id: 'wing_3', category: 'wing_size', name_ar: '3 قطع أجنحة', price: 350, image_url: '/images/wings-crispy-3.png', is_available: true, sort_order: 1 },
        { id: 'wing_6', category: 'wing_size', name_ar: '6 قطع أجنحة', price: 650, image_url: '/images/wings-crispy-6.png', is_available: true, sort_order: 2 },
        { id: 'wing_9', category: 'wing_size', name_ar: '9 قطع أجنحة', price: 950, image_url: '/images/wings-crispy-9.png', is_available: true, sort_order: 3 },
        { id: 'wing_12', category: 'wing_size', name_ar: '12 قطعة أجنحة', price: 1250, image_url: '/images/wings-crispy-12.png', is_available: true, sort_order: 4 },
        { id: 'wing_20', category: 'wing_size', name_ar: '20 قطعة أجنحة (دلو عائلي)', price: 1950, image_url: '/images/wings-crispy-20.png', is_available: true, sort_order: 5 },

        // صوصات الأجنحة (coating_sauce)
        { id: 'sauce_crispy', category: 'coating_sauce', name_ar: 'كريسبي (بدون صوص)', price: 0, image_url: '/images/wings-crispy-6.png', is_available: true, sort_order: 10 },
        { id: 'sauce_algeria', category: 'coating_sauce', name_ar: 'الصوص الجزائرية', price: 0, image_url: '/images/wings-algeria-6.png', is_available: true, sort_order: 11 },
        { id: 'sauce_bbq', category: 'coating_sauce', name_ar: 'باربكيو', price: 0, image_url: '/images/wings-bbq-6.png', sort_order: 12 },
        { id: 'sauce_buffalo', category: 'coating_sauce', name_ar: 'بافالو', price: 0, image_url: '/images/wings-buffalo-6.png', sort_order: 13 },

        // الصوصات الجانبية (dip)
        { id: 'dip_buffalo', category: 'dip', name_ar: 'بافالو', price: 30, image_url: '/images/dip-buffalo.png', is_available: true, sort_order: 20 },
        { id: 'dip_honey_mustard', category: 'dip', name_ar: 'هوني ماسترد', price: 30, image_url: '/images/dip-honey-mustard.png', is_available: true, sort_order: 21 },
        { id: 'dip_ranch', category: 'dip', name_ar: 'رانش', price: 30, image_url: '/images/dip-ranch.png', is_available: true, sort_order: 22 },
        { id: 'dip_cheese', category: 'dip', name_ar: 'صوص الجبن', price: 30, image_url: '/images/dip-cheese.png', is_available: true, sort_order: 23 },
        { id: 'dip_bbq', category: 'dip', name_ar: 'باربكيو', price: 30, image_url: '/images/dip-bbq.png', is_available: true, sort_order: 24 },
        { id: 'dip_ketchup', category: 'dip', name_ar: 'كاتشب', price: 30, image_url: '/images/dip-ketchup.png', is_available: true, sort_order: 25 },

        // الإضافات (side)
        { id: 'side_fries', category: 'side', name_ar: 'بطاطا مقلية', price: 200, image_url: '/images/side-fries.png?v=2', is_available: true, sort_order: 30 },
        { id: 'side_coleslaw', category: 'side', name_ar: 'سلطة الكرنب', price: 220, image_url: '/images/side-coleslaw.png', is_available: true, sort_order: 31 },

        // الوجبات الجاهزة (ready_box)
        { id: 'box_solo', category: 'ready_box', name_ar: 'سولو بوكس (SOLO BOX)', price: 850, image_url: '/images/wings-crispy-6.png', is_available: true, sort_order: 40 },
        { id: 'box_double', category: 'ready_box', name_ar: 'دابل بوكس (DOUBLE BOX)', price: 1450, image_url: '/images/wings-bbq-12.png', is_available: true, sort_order: 41 },
        { id: 'box_friends', category: 'ready_box', name_ar: 'فريندز بوكس (FRIENDS BOX)', price: 2150, image_url: '/images/wings-buffalo-12.png', is_available: true, sort_order: 42 },
        { id: 'box_party', category: 'ready_box', name_ar: 'بارتي بوكس (PARTY BOX)', price: 2750, image_url: '/images/wings-algeria-20.png', sort_order: 43 },
      ];

      const { error } = await supabase.from('menu_items').upsert(defaultItems, { onConflict: 'id' });
      if (error) {
        console.error('Menu bulk upsert error:', error);
        alert('تعذر استيراد المنيو: ' + (error.message || JSON.stringify(error)));
      } else {
        await fetchMenuItems();
      }
    } catch (err: any) {
      console.error('Menu sync exception:', err);
      alert('خطأ أثناء المزامنة: ' + (err.message || String(err)));
    } finally {
      setMenuLoading(false);
    }
  };

  const handleToggleItemAvailability = async (item: any) => {
    const updatedVal = !item.is_available;
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_available: updatedVal })
        .eq('id', item.id);
      if (error) {
        console.error('Toggle availability error:', error);
        alert('تعذر تعديل التوفر: ' + error.message);
      } else {
        setMenuItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, is_available: updatedVal } : i))
        );
      }
    } catch (err: any) {
      console.error('Error toggling availability:', err);
    }
  };

  const handleDeleteMenuItem = async (item: any) => {
    if (!confirm(`هل أنت متأكد من حذف الصنف "${item.name_ar}" من المنيو؟`)) return;
    try {
      const { error } = await supabase.from('menu_items').delete().eq('id', item.id);
      if (error) {
        console.error('Delete item error:', error);
        alert('تعذر حذف الصنف: ' + error.message);
      } else {
        setMenuItems((prev) => prev.filter((i) => i.id !== item.id));
      }
    } catch (err: any) {
      console.error('Error deleting menu item:', err);
      alert('خطأ: ' + err.message);
    }
  };

  const handleOpenAddModal = (catKey: string = 'wing_size') => {
    setEditingItem(null);
    setItemFormName('');
    setItemFormCategory(catKey);
    setItemFormPrice(0);
    setItemFormImage('');
    setIsItemModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setEditingItem(item);
    setItemFormName(item.name_ar || '');
    setItemFormCategory(item.category || 'wing_size');
    setItemFormPrice(item.price || 0);
    setItemFormImage(item.image_url || '');
    setIsItemModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemFormName.trim()) return;

    try {
      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from('menu_items')
          .update({
            name_ar: itemFormName.trim(),
            category: itemFormCategory,
            price: Number(itemFormPrice) || 0,
            image_url: itemFormImage.trim() || null,
          })
          .eq('id', editingItem.id);

        if (error) {
          console.error('Update item error:', error);
          alert('تعذر تحديث الصنف: ' + error.message);
        } else {
          setMenuItems((prev) =>
            prev.map((i) =>
              i.id === editingItem.id
                ? {
                    ...i,
                    name_ar: itemFormName.trim(),
                    category: itemFormCategory,
                    price: Number(itemFormPrice) || 0,
                    image_url: itemFormImage.trim() || null,
                  }
                : i
            )
          );
          setIsItemModalOpen(false);
        }
      } else {
        // Insert new item with clean string ID
        const newId = `${itemFormCategory}_${Date.now()}`;
        const payload = {
          id: newId,
          name_ar: itemFormName.trim(),
          category: itemFormCategory,
          price: Number(itemFormPrice) || 0,
          image_url: itemFormImage.trim() || null,
          is_available: true,
          sort_order: menuItems.length + 1,
        };

        const { error } = await supabase.from('menu_items').insert([payload]);
        if (error) {
          console.error('Add item error:', error);
          alert('تعذر إضافة الصنف: ' + error.message);
        } else {
          await fetchMenuItems();
          setIsItemModalOpen(false);
        }
      }
    } catch (err: any) {
      console.error('Save item error:', err);
      alert('خطأ: ' + err.message);
    }
  };

  // Settings Functions
  const fetchSettings = async () => {
    setSettingsLoading(true);
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 1)
        .single();
      if (!error && data) {
        setSettings(data);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSavedMsg('');
    try {
      const { error } = await supabase
        .from('store_settings')
        .update({
          is_open: settings.is_open,
          delivery_fee: Number(settings.delivery_fee) || 200,
          telegram_bot_token: settings.telegram_bot_token || '',
          telegram_chat_id: settings.telegram_chat_id || '',
        })
        .eq('id', 1);

      if (!error) {
        setSettingsSavedMsg('تم حفظ الإعدادات بنجاح!');
        setTimeout(() => setSettingsSavedMsg(''), 3000);
      }
    } catch (err: any) {
      alert('خطأ في حفظ الإعدادات: ' + err.message);
    }
  };

  const handleTestTelegram = async () => {
    if (!settings.telegram_bot_token || !settings.telegram_chat_id) {
      alert('يرجى كتابة توكن البوت ومعرف المحادثة أولاً');
      return;
    }
    setTelegramTestMsg('جارٍ الإرسال...');
    try {
      const text = `اختبار تنبيهات مطعم WINGS (المدية)!\nاتصال ناجح بنظام الإشعارات الفورية.`;
      const res = await fetch(
        `https://api.telegram.org/bot${settings.telegram_bot_token}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: settings.telegram_chat_id,
            text,
          }),
        }
      );
      const data = await res.json();
      if (data.ok) {
        setTelegramTestMsg('تم إرسال الرسالة التجريبية إلى تيليجرام بنجاح!');
      } else {
        setTelegramTestMsg('فشل الإرسال: ' + (data.description || 'تأكد من التوكن والـ Chat ID'));
      }
    } catch (err: any) {
      setTelegramTestMsg('خطأ في الاتصال بتيليجرام: ' + err.message);
    }
  };

  // Calculations for Stats Strip
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayOrders = orders.filter(
    (o) => new Date(o.created_at).getTime() >= todayStart.getTime()
  );
  const todayRevenue = todayOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingCount = orders.filter(
    (o) => o.status === 'new' || o.status === 'preparing'
  ).length;

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  // Loading Screen
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0B1221', color: '#FFFFFF', fontFamily: "'Cairo', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <RefreshCw className="animate-spin" size={32} style={{ color: '#F94E1E', margin: '0 auto 12px' }} />
          <div>جارٍ تحميل لوحة الإدارة...</div>
        </div>
      </div>
    );
  }

  // 1. LOGIN / SIGNUP SCREEN
  if (!session) {
    return (
      <div dir="rtl" style={{ minHeight: '100vh', backgroundColor: '#0B1221', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', fontFamily: "'Cairo', sans-serif" }}>
        <div style={{ width: '100%', maxWidth: '420px', backgroundColor: '#131E33', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '32px 24px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '18px', backgroundColor: 'rgba(249,78,30,0.12)', border: '1px solid rgba(249,78,30,0.3)', marginBottom: '14px' }}>
              <Package size={28} style={{ color: '#F94E1E' }} />
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', marginBottom: '6px' }}>WINGS — لوحة الإدارة</h1>
            <p style={{ fontSize: '13px', color: '#8E9BAE' }}>سجّل الدخول لإدارة الطلبات والمنيو والإعدادات</p>
          </div>

          {authError && (
            <div style={{ backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '12px', padding: '10px 14px', color: '#FCA5A5', fontSize: '13px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{authError}</span>
            </div>
          )}

          {authSuccessMsg && (
            <div style={{ backgroundColor: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '12px', padding: '10px 14px', color: '#86EFAC', fontSize: '13px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} />
              <span>{authSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                style={{ width: '100%', height: '46px', padding: '0 14px', backgroundColor: '#0B1221', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', color: '#FFFFFF', fontSize: '14px', fontFamily: "'Cairo', sans-serif", outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>كلمة المرور</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', height: '46px', padding: '0 14px', backgroundColor: '#0B1221', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', color: '#FFFFFF', fontSize: '14px', fontFamily: "'Cairo', sans-serif", outline: 'none' }}
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              style={{ width: '100%', height: '48px', backgroundColor: '#F94E1E', border: 'none', borderRadius: '14px', color: '#FFFFFF', fontSize: '15px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s', marginTop: '6px' }}
            >
              {authLoading ? (
                <RefreshCw className="animate-spin" size={18} />
              ) : (
                <span>{isSignUp ? 'إنشاء حساب مدير' : 'تسجيل الدخول'}</span>
              )}
            </button>
          </form>

          {/* Toggle between Login and Signup */}
          <div style={{ marginTop: '18px', textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setAuthError('');
                setAuthSuccessMsg('');
              }}
              style={{ background: 'transparent', border: 'none', color: '#8E9BAE', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {isSignUp ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'ليس لديك حساب؟ إنشاء حساب مدير جديد'}
            </button>
          </div>

          {/* Return to Store Link */}
          <div style={{ marginTop: '22px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', textAlign: 'center' }}>
            <a href="/" style={{ color: '#F94E1E', fontSize: '13px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span>العودة لمتجر WINGS</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 2. DASHBOARD SHELL
  return (
    <div dir="rtl" style={{ minHeight: '100vh', backgroundColor: '#0B1221', color: '#FFFFFF', fontFamily: "'Cairo', sans-serif", paddingBottom: '60px' }}>
      
      {/* Top Navigation Bar */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(11, 18, 33, 0.94)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#F94E1E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '18px', color: '#FFFFFF' }}>
            W
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 900, lineHeight: 1.2 }}>WINGS لوحة الإدارة</div>
            <div style={{ fontSize: '11px', color: '#8E9BAE' }}>{session.user?.email}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '9999px', color: '#FFFFFF', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}
          >
            <span>معاينة المتجر</span>
            <ExternalLink size={13} />
          </a>

          <button
            onClick={handleLogout}
            title="تسجيل الخروج"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', backgroundColor: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '50%', color: '#EF4444', cursor: 'pointer' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '16px' }}>

        {/* Tab Switcher */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', backgroundColor: '#131E33', padding: '5px', borderRadius: '16px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '10px 8px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeTab === 'orders' ? '#F94E1E' : 'transparent',
              color: activeTab === 'orders' ? '#FFFFFF' : '#8E9BAE',
              fontSize: '13px',
              fontWeight: 800,
              fontFamily: "'Cairo', sans-serif",
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <ShoppingBag size={16} />
            <span>الطلبات الحية</span>
            {pendingCount > 0 && (
              <span style={{ backgroundColor: activeTab === 'orders' ? '#FFFFFF' : '#F94E1E', color: activeTab === 'orders' ? '#F94E1E' : '#FFFFFF', fontSize: '10px', fontWeight: 900, padding: '1px 6px', borderRadius: '9999px' }}>
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            style={{
              padding: '10px 8px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeTab === 'menu' ? '#F94E1E' : 'transparent',
              color: activeTab === 'menu' ? '#FFFFFF' : '#8E9BAE',
              fontSize: '13px',
              fontWeight: 800,
              fontFamily: "'Cairo', sans-serif",
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <Layers size={16} />
            <span>إدارة المنيو</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '10px 8px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeTab === 'settings' ? '#F94E1E' : 'transparent',
              color: activeTab === 'settings' ? '#FFFFFF' : '#8E9BAE',
              fontSize: '13px',
              fontWeight: 800,
              fontFamily: "'Cairo', sans-serif",
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <Settings size={16} />
            <span>الإعدادات</span>
          </button>
        </div>

        {/* ==============================================================
            TAB 1: LIVE ORDERS
            ============================================================== */}
        {activeTab === 'orders' && (
          <div>
            {/* Top Stats Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '18px' }}>
              <div style={{ backgroundColor: '#131E33', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#8E9BAE', fontWeight: 700, marginBottom: '4px' }}>طلبات اليوم</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#F94E1E' }}>{todayOrders.length}</div>
              </div>

              <div style={{ backgroundColor: '#131E33', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#8E9BAE', fontWeight: 700, marginBottom: '4px' }}>مبيعات اليوم</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#10B981' }}>{todayRevenue.toLocaleString('fr-DZ')} دج</div>
              </div>

              <div style={{ backgroundColor: '#131E33', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#8E9BAE', fontWeight: 700, marginBottom: '4px' }}>قيد التحضير</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#F59E0B' }}>{pendingCount}</div>
              </div>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '14px' }}>
              {[
                { id: 'all', label: 'الكل' },
                { id: 'new', label: 'جديد' },
                { id: 'preparing', label: 'قيد التحضير' },
                { id: 'delivering', label: 'في التوصيل' },
                { id: 'completed', label: 'مكتمل' },
                { id: 'cancelled', label: 'ملغى' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    fontFamily: "'Cairo', sans-serif",
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    border: '1px solid',
                    backgroundColor: statusFilter === f.id ? '#F94E1E' : 'rgba(255,255,255,0.05)',
                    borderColor: statusFilter === f.id ? '#F94E1E' : 'rgba(255,255,255,0.1)',
                    color: statusFilter === f.id ? '#FFFFFF' : '#8E9BAE',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Orders List */}
            {ordersLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#8E9BAE' }}>
                <RefreshCw className="animate-spin" size={24} style={{ margin: '0 auto 8px', color: '#F94E1E' }} />
                <div>جارٍ تحميل الطلبات...</div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div style={{ backgroundColor: '#131E33', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '40px 20px', textAlign: 'center' }}>
                <ShoppingBag size={40} style={{ color: '#8E9BAE', margin: '0 auto 12px', opacity: 0.5 }} />
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>لا توجد طلبات في هذا القسم</div>
                <div style={{ fontSize: '12px', color: '#8E9BAE' }}>ستظهر الطلبات الجديدة هنا فور تقديمها من قِبل الزبائن</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {filteredOrders.map((order) => {
                  const itemsList = Array.isArray(order.items) ? order.items : [];
                  const orderDate = new Date(order.created_at);
                  const timeStr = orderDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

                  // Status badge styling
                  let statusLabel = 'جديد';
                  let statusBg = 'rgba(249,78,30,0.15)';
                  let statusColor = '#F94E1E';
                  if (order.status === 'preparing') {
                    statusLabel = 'قيد التحضير';
                    statusBg = 'rgba(245,158,11,0.15)';
                    statusColor = '#F59E0B';
                  } else if (order.status === 'delivering') {
                    statusLabel = 'في التوصيل';
                    statusBg = 'rgba(168,85,247,0.15)';
                    statusColor = '#C084FC';
                  } else if (order.status === 'completed') {
                    statusLabel = 'مكتمل';
                    statusBg = 'rgba(16,185,129,0.15)';
                    statusColor = '#10B981';
                  } else if (order.status === 'cancelled') {
                    statusLabel = 'ملغى';
                    statusBg = 'rgba(239,68,68,0.15)';
                    statusColor = '#EF4444';
                  }

                  const cleanPhone = (order.customer_phone || '').replace(/[\s\-\.\(\)]/g, '');
                  const waUrl = `https://wa.me/213${cleanPhone.replace(/^0/, '')}?text=${encodeURIComponent(
                    `مرحباً! تم تأكيد طلبك رقم #${order.order_number || order.id} من مطعم WINGS (المدية) وجارٍ تحضيره الآن.`
                  )}`;

                  return (
                    <div
                      key={order.id}
                      style={{
                        backgroundColor: '#131E33',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '20px',
                        padding: '16px',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                      }}
                    >
                      {/* Order Card Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '15px', fontWeight: 900, color: '#FFFFFF' }}>
                            طلب #{order.order_number || order.id}
                          </span>
                          <span style={{ fontSize: '11px', color: '#8E9BAE', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={11} />
                            <span>{timeStr}</span>
                          </span>
                        </div>

                        <span style={{ padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 800, backgroundColor: statusBg, color: statusColor }}>
                          {statusLabel}
                        </span>
                      </div>

                      {/* Items List */}
                      <div style={{ backgroundColor: 'rgba(11,18,33,0.6)', borderRadius: '12px', padding: '10px 12px', marginBottom: '12px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: '#8E9BAE', marginBottom: '6px' }}>محتويات الوجبة:</div>
                        {itemsList.map((it: any, idx: number) => {
                          let dipsInfo = '';
                          if (it.selectedDips) {
                            const arr = Object.keys(it.selectedDips).filter((k) => it.selectedDips[k] > 0);
                            if (arr.length > 0) {
                              dipsInfo = 'صوصات: ' + arr.map((k) => `${k} (×${it.selectedDips[k]})`).join(', ');
                            }
                          }
                          let sidesInfo = '';
                          if (it.selectedSides) {
                            const arr = Object.keys(it.selectedSides).filter((k) => it.selectedSides[k] > 0);
                            if (arr.length > 0) {
                              sidesInfo = 'إضافات: ' + arr.map((k) => `${k} (×${it.selectedSides[k]})`).join(', ');
                            }
                          }

                          return (
                            <div key={idx} style={{ fontSize: '12px', marginBottom: '4px', paddingBottom: '4px', borderBottom: idx < itemsList.length - 1 ? '1px dashed rgba(255,255,255,0.06)' : 'none' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                                <span>{it.title || it.boxCode || 'وجبة'} ×{it.qty || 1}</span>
                                <span style={{ color: '#F94E1E' }}>{((it.unitPrice || it.price || 0) * (it.qty || 1)).toLocaleString('fr-DZ')} دج</span>
                              </div>
                              {it.sauceName && <div style={{ fontSize: '11px', color: '#8E9BAE' }}>صوص: {it.sauceName} {it.spiceTitle ? `• ${it.spiceTitle}` : ''}</div>}
                              {dipsInfo && <div style={{ fontSize: '11px', color: '#8E9BAE' }}>{dipsInfo}</div>}
                              {sidesInfo && <div style={{ fontSize: '11px', color: '#8E9BAE' }}>{sidesInfo}</div>}
                            </div>
                          );
                        })}
                      </div>

                      {/* Customer Details */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '12px', marginBottom: '12px' }}>
                        <div>
                          <span style={{ color: '#8E9BAE' }}>الهاتف: </span>
                          <span style={{ fontWeight: 800, direction: 'ltr', display: 'inline-block' }}>{order.customer_phone}</span>
                        </div>
                        <div>
                          <span style={{ color: '#8E9BAE' }}>المجموع: </span>
                          <span style={{ fontWeight: 900, color: '#F94E1E' }}>{(order.total || 0).toLocaleString('fr-DZ')} دج</span>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <span style={{ color: '#8E9BAE' }}>العنوان: </span>
                          <span style={{ fontWeight: 700 }}>{order.customer_address}</span>
                        </div>
                        {order.notes && (
                          <div style={{ gridColumn: 'span 2', color: '#F59E0B', fontSize: '11px' }}>
                            <span>ملاحظة: </span>
                            <span>{order.notes}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                        {order.status === 'new' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                            style={{ flex: 1, padding: '8px 12px', backgroundColor: '#F59E0B', border: 'none', borderRadius: '10px', color: '#000000', fontSize: '12px', fontWeight: 900, cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}
                          >
                            قبول وبدء التحضير
                          </button>
                        )}

                        {order.status === 'preparing' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'delivering')}
                            style={{ flex: 1, padding: '8px 12px', backgroundColor: '#A855F7', border: 'none', borderRadius: '10px', color: '#FFFFFF', fontSize: '12px', fontWeight: 900, cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}
                          >
                            تسليم للموصّل
                          </button>
                        )}

                        {order.status === 'delivering' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                            style={{ flex: 1, padding: '8px 12px', backgroundColor: '#10B981', border: 'none', borderRadius: '10px', color: '#FFFFFF', fontSize: '12px', fontWeight: 900, cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}
                          >
                            تم التوصيل بنجاح
                          </button>
                        )}

                        {order.status !== 'completed' && order.status !== 'cancelled' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                            style={{ padding: '8px 12px', backgroundColor: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', color: '#EF4444', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}
                          >
                            إلغاء
                          </button>
                        )}

                        {/* WhatsApp Button */}
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '8px 12px', backgroundColor: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.35)', borderRadius: '10px', color: '#25D366', fontSize: '12px', fontWeight: 800, textDecoration: 'none' }}
                        >
                          <MessageCircle size={14} />
                          <span>واتساب</span>
                        </a>

                        {/* Call Button */}
                        <a
                          href={`tel:${cleanPhone}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '8px 12px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: '#FFFFFF', fontSize: '12px', fontWeight: 800, textDecoration: 'none' }}
                        >
                          <Phone size={14} />
                          <span>اتصال</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==============================================================
            TAB 2: MENU MANAGER
            ============================================================== */}
        {activeTab === 'menu' && (
          <div>
            {/* Header with Add Button and Seed/Sync Option */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF' }}>إدارة المنيو والأصناف</h2>
                <div style={{ fontSize: '12px', color: '#8E9BAE' }}>تحكم بالأسعار، توفر الأصناف، وتعديل القائمة لحظياً</div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleSeedMenu}
                  disabled={menuLoading}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: '12px', color: '#F59E0B', fontSize: '12px', fontWeight: 800, cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}
                >
                  <RefreshCw size={14} className={menuLoading ? 'animate-spin' : ''} />
                  <span>مزامنة واستيراد المنيو</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenAddModal('wing_size')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#F94E1E', border: 'none', borderRadius: '12px', color: '#FFFFFF', fontSize: '13px', fontWeight: 900, cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}
                >
                  <Plus size={16} />
                  <span>صنف جديد</span>
                </button>
              </div>
            </div>

            {/* Seed Notice if empty */}
            {menuItems.length === 0 && !menuLoading && (
              <div style={{ backgroundColor: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: '18px', padding: '24px 20px', textAlign: 'center', marginBottom: '20px' }}>
                <Layers size={36} style={{ color: '#F59E0B', margin: '0 auto 10px' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#FFFFFF', marginBottom: '6px' }}>قاعدة بيانات المنيو فارغة</h3>
                <p style={{ fontSize: '12px', color: '#8E9BAE', marginBottom: '16px' }}>
                  يمكنك استيراد جميع أصناف المنيو الحالية (الأحجام، الصوصات، الإضافات، والبوكسات الجاهزة) بضغطة زر واحدة!
                </p>
                <button
                  type="button"
                  onClick={handleSeedMenu}
                  style={{ padding: '10px 20px', backgroundColor: '#F59E0B', border: 'none', borderRadius: '12px', color: '#000000', fontSize: '13px', fontWeight: 900, cursor: 'pointer', fontFamily: "'Cairo', sans-serif", display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <RefreshCw size={16} />
                  <span>مزامنة واستيراد المنيو الحالي إلى Supabase</span>
                </button>
              </div>
            )}

            {/* Items by Category */}
            {menuLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#8E9BAE' }}>
                <RefreshCw className="animate-spin" size={24} style={{ margin: '0 auto 8px', color: '#F94E1E' }} />
                <div>جارٍ تحميل المنيو...</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {MENU_CATEGORIES.map((cat) => {
                  const itemsInCat = menuItems.filter(
                    (it) => it.category === cat.key || (cat.legacyKeys && cat.legacyKeys.includes(it.category))
                  );

                  return (
                    <div
                      key={cat.key}
                      style={{
                        backgroundColor: '#131E33',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '20px',
                        padding: '18px 20px',
                      }}
                    >
                      {/* Category Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '15px', fontWeight: 900, color: '#FFFFFF' }}>{cat.label}</span>
                          <span style={{ fontSize: '11px', fontWeight: 800, backgroundColor: 'rgba(249,78,30,0.18)', color: '#F94E1E', padding: '2px 8px', borderRadius: '9999px', border: '1px solid rgba(249,78,30,0.3)' }}>
                            {itemsInCat.length}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenAddModal(cat.key)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '6px 12px',
                            backgroundColor: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: '10px',
                            color: '#FFFFFF',
                            fontSize: '12px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            fontFamily: "'Cairo', sans-serif",
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <Plus size={14} style={{ color: '#F94E1E' }} />
                          <span>إضافة</span>
                        </button>
                      </div>

                      {/* Items List */}
                      {itemsInCat.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '16px', color: '#8E9BAE', fontSize: '12px', backgroundColor: '#0B1221', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.08)' }}>
                          لا توجد أصناف في هذا القسم حالياً
                        </div>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '10px' }}>
                          {itemsInCat.map((item) => (
                            <div
                              key={item.id}
                              style={{
                                backgroundColor: '#0B1221',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '14px',
                                padding: '12px 14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '12px',
                                opacity: item.is_available ? 1 : 0.65,
                                transition: 'all 0.2s ease',
                              }}
                            >
                              {/* Item Info & Image */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                                {item.image_url ? (
                                  <img
                                    src={item.image_url}
                                    alt={item.name_ar}
                                    style={{ width: '42px', height: '42px', objectFit: 'contain', borderRadius: '10px', backgroundColor: '#131E33', padding: '3px', flexShrink: 0 }}
                                    onError={(e: any) => { e.target.style.display = 'none'; }}
                                  />
                                ) : (
                                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#131E33', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F94E1E', flexShrink: 0 }}>
                                    <Package size={18} />
                                  </div>
                                )}

                                <div style={{ minWidth: 0 }}>
                                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {item.name_ar}
                                  </div>
                                  <div style={{ fontSize: '12px', fontWeight: 900, color: '#F94E1E', marginTop: '2px' }}>
                                    {(item.price || 0).toLocaleString('fr-DZ')} دج
                                  </div>
                                </div>
                              </div>

                              {/* Controls: Availability Toggle, Edit, Delete */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                                {/* Instant Availability Toggle Switch */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleItemAvailability(item)}
                                  title={item.is_available ? 'تعطيل التوفر' : 'تفعيل التوفر'}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    padding: '5px 10px',
                                    borderRadius: '20px',
                                    border: item.is_available ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(239,68,68,0.4)',
                                    backgroundColor: item.is_available ? 'rgba(16,185,129,0.16)' : 'rgba(239,68,68,0.16)',
                                    color: item.is_available ? '#10B981' : '#EF4444',
                                    fontSize: '11px',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    fontFamily: "'Cairo', sans-serif",
                                    transition: 'all 0.15s ease',
                                  }}
                                >
                                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: item.is_available ? '#10B981' : '#EF4444' }}></span>
                                  <span>{item.is_available ? 'متوفر' : 'غير متوفر'}</span>
                                </button>

                                {/* Edit Button */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModal(item)}
                                  title="تعديل الصنف"
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    backgroundColor: 'rgba(255,255,255,0.04)',
                                    color: '#8E9BAE',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                  }}
                                  onMouseEnter={(e: any) => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
                                  onMouseLeave={(e: any) => { e.currentTarget.style.color = '#8E9BAE'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
                                >
                                  <Pencil size={14} />
                                </button>

                                {/* Delete Button */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMenuItem(item)}
                                  title="حذف الصنف"
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(239,68,68,0.2)',
                                    backgroundColor: 'rgba(239,68,68,0.08)',
                                    color: '#EF4444',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                  }}
                                  onMouseEnter={(e: any) => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.2)'; }}
                                  onMouseLeave={(e: any) => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'; }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Modal: Add or Edit Menu Item */}
            {isItemModalOpen && (
              <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                <div style={{ width: '100%', maxWidth: '440px', backgroundColor: '#131E33', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#FFFFFF' }}>
                      {editingItem ? 'تعديل الصنف' : 'إضافة صنف جديد إلى المنيو'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsItemModalOpen(false)}
                      style={{ background: 'transparent', border: 'none', color: '#8E9BAE', cursor: 'pointer' }}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveItem} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>اسم الصنف بالعربية</label>
                      <input
                        type="text"
                        required
                        value={itemFormName}
                        onChange={(e) => setItemFormName(e.target.value)}
                        placeholder="مثال: صوص رانش حار"
                        style={{ width: '100%', height: '42px', padding: '0 12px', backgroundColor: '#0B1221', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: '#FFFFFF', fontSize: '13px', fontFamily: "'Cairo', sans-serif" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>القسم</label>
                      <select
                        value={itemFormCategory}
                        onChange={(e) => setItemFormCategory(e.target.value)}
                        style={{ width: '100%', height: '42px', padding: '0 12px', backgroundColor: '#0B1221', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: '#FFFFFF', fontSize: '13px', fontFamily: "'Cairo', sans-serif" }}
                      >
                        <option value="wing_size">أحجام الأجنحة (wing_size)</option>
                        <option value="coating_sauce">صوصات الأجنحة (coating_sauce)</option>
                        <option value="dip">الصوصات الجانبية (dip)</option>
                        <option value="side">الإضافات (side)</option>
                        <option value="ready_box">الوجبات الجاهزة (ready_box)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>السعر (دج)</label>
                      <input
                        type="number"
                        required
                        value={itemFormPrice}
                        onChange={(e) => setItemFormPrice(Number(e.target.value))}
                        placeholder="250"
                        style={{ width: '100%', height: '42px', padding: '0 12px', backgroundColor: '#0B1221', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: '#FFFFFF', fontSize: '13px', fontFamily: "'Cairo', sans-serif" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>مسار / رابط الصورة</label>
                      <input
                        type="text"
                        value={itemFormImage}
                        onChange={(e) => setItemFormImage(e.target.value)}
                        placeholder="/images/dip-buffalo.png"
                        style={{ width: '100%', height: '42px', padding: '0 12px', backgroundColor: '#0B1221', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: '#FFFFFF', fontSize: '13px', fontFamily: "'Cairo', sans-serif" }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                      <button
                        type="submit"
                        style={{ flex: 1, height: '46px', backgroundColor: '#F94E1E', border: 'none', borderRadius: '12px', color: '#FFFFFF', fontSize: '14px', fontWeight: 900, cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}
                      >
                        {editingItem ? 'حفظ التعديلات' : 'إضافة الصنف للمنيو'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsItemModalOpen(false)}
                        style={{ padding: '0 18px', height: '46px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#8E9BAE', fontSize: '13px', fontWeight: 800, cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}
                      >
                        إلغاء
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==============================================================
            TAB 3: SETTINGS
            ============================================================== */}
        {activeTab === 'settings' && (
          <div style={{ backgroundColor: '#131E33', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF', marginBottom: '16px' }}>إعدادات المتجر والإشعارات</h2>

            {settingsSavedMsg && (
              <div style={{ backgroundColor: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '12px', padding: '10px 14px', color: '#86EFAC', fontSize: '13px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} />
                <span>{settingsSavedMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Store Status Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', backgroundColor: '#0B1221', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>حالة استقبال الطلبات بالمطعم</div>
                  <div style={{ fontSize: '12px', color: '#8E9BAE' }}>
                    {settings.is_open ? 'المطعم مفتوح ويستقبل طلبات الزبائن حالياً' : 'المطعم مغلق حالياً (سيظهر شريط تنبيه للزبائن)'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSettings((s: any) => ({ ...s, is_open: !s.is_open }))}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    border: 'none',
                    backgroundColor: settings.is_open ? '#10B981' : '#EF4444',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    fontFamily: "'Cairo', sans-serif",
                  }}
                >
                  {settings.is_open ? 'مفتوح' : 'مغلق'}
                </button>
              </div>

              {/* Delivery Fee */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  سعر التوصيل داخل ولاية المدية (دج)
                </label>
                <input
                  type="number"
                  value={settings.delivery_fee}
                  onChange={(e) => setSettings((s: any) => ({ ...s, delivery_fee: Number(e.target.value) }))}
                  style={{ width: '100%', height: '44px', padding: '0 14px', backgroundColor: '#0B1221', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', color: '#FFFFFF', fontSize: '14px', fontFamily: "'Cairo', sans-serif" }}
                />
              </div>

              {/* Telegram Bot Token */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  توكن بوت تيليجرام (Telegram Bot Token)
                </label>
                <input
                  type="text"
                  value={settings.telegram_bot_token || ''}
                  onChange={(e) => setSettings((s: any) => ({ ...s, telegram_bot_token: e.target.value }))}
                  placeholder="123456789:ABCdefGHIjklMNOpqrSTUvwxYZ"
                  style={{ width: '100%', height: '44px', padding: '0 14px', backgroundColor: '#0B1221', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', color: '#FFFFFF', fontSize: '13px', fontFamily: 'monospace' }}
                />
                <div style={{ fontSize: '11px', color: '#8E9BAE', marginTop: '4px' }}>
                  يُنشأ من @BotFather على تيليجرام لاستقبال الطلبات فورياً على هاتفك
                </div>
              </div>

              {/* Telegram Chat ID */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  معرّف المحادثة أو المجموعة (Telegram Chat ID)
                </label>
                <input
                  type="text"
                  value={settings.telegram_chat_id || ''}
                  onChange={(e) => setSettings((s: any) => ({ ...s, telegram_chat_id: e.target.value }))}
                  placeholder="987654321 أو -100123456789"
                  style={{ width: '100%', height: '44px', padding: '0 14px', backgroundColor: '#0B1221', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', color: '#FFFFFF', fontSize: '13px', fontFamily: 'monospace' }}
                />
              </div>

              {/* Telegram Test Message */}
              {telegramTestMsg && (
                <div style={{ fontSize: '12px', color: '#F59E0B', backgroundColor: 'rgba(245,158,11,0.1)', padding: '8px 12px', borderRadius: '8px' }}>
                  {telegramTestMsg}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="submit"
                  style={{ flex: 1, height: '46px', backgroundColor: '#F94E1E', border: 'none', borderRadius: '12px', color: '#FFFFFF', fontSize: '14px', fontWeight: 900, cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}
                >
                  حفظ الإعدادات
                </button>

                <button
                  type="button"
                  onClick={handleTestTelegram}
                  style={{ padding: '0 16px', height: '46px', backgroundColor: 'rgba(0,136,204,0.18)', border: '1px solid rgba(0,136,204,0.4)', borderRadius: '12px', color: '#0088CC', fontSize: '13px', fontWeight: 800, cursor: 'pointer', fontFamily: "'Cairo', sans-serif", display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Send size={15} />
                  <span>اختبار تيليجرام</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
