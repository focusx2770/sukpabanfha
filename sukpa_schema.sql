-- ====================================================================
-- ซักป่ะ? บ้านฟ้าปิยรมณ์ — Supabase SQL Database Schema
-- ระบบจัดการออเดอร์ & ระบบสะสมแต้ม 10 ฟรี 1 (Loyalty Stamp Program)
-- ====================================================================

-- 1. ลบตารางเดิมออกก่อน (ถ้ามี) เพื่อความสะอาด
DROP TABLE IF EXISTS public.sukpa_orders CASCADE;
DROP TABLE IF EXISTS public.sukpa_customers CASCADE;

-- 2. สร้างตารางลูกค้า & แต้มสะสม
CREATE TABLE public.sukpa_customers (
    phone TEXT PRIMARY KEY,
    name TEXT,
    phase TEXT,
    soi TEXT,
    address_details TEXT,
    stamps INTEGER DEFAULT 0,
    total_washes INTEGER DEFAULT 0,
    free_rewards_earned INTEGER DEFAULT 0,
    free_rewards_remaining INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. สร้างตารางออเดอร์ซัก-อบผ้า
CREATE TABLE public.sukpa_orders (
    order_id TEXT PRIMARY KEY,
    phone TEXT,
    name TEXT,
    phase TEXT,
    soi TEXT,
    address_details TEXT,
    wash_size TEXT,
    water_temp TEXT,
    dry_size TEXT,
    dry_minutes INTEGER DEFAULT 24,
    detergent_type TEXT,
    total_price NUMERIC DEFAULT 0,
    payment_method TEXT,
    status TEXT DEFAULT 'pending',
    slip_url TEXT,
    delivery_photo_url TEXT,
    is_free_reward BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Index สำหรับการค้นหาที่รวดเร็ว
CREATE INDEX IF NOT EXISTS idx_sukpa_orders_phone ON public.sukpa_orders(phone);
CREATE INDEX IF NOT EXISTS idx_sukpa_orders_status ON public.sukpa_orders(status);

-- 5. เปิดระบบความปลอดภัย Row Level Security (RLS)
ALTER TABLE public.sukpa_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sukpa_orders ENABLE ROW LEVEL SECURITY;

-- 6. นโยบายอนุญาตให้อ่านและบันทึกข้อมูล
CREATE POLICY "Allow public all customers" ON public.sukpa_customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all orders" ON public.sukpa_orders FOR ALL USING (true) WITH CHECK (true);
