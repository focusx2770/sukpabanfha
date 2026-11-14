import { supabase } from "@/lib/supabase";

export interface SukpaCustomer {
  phone: string;
  name: string;
  phase: string;
  soi: string;
  address_details: string;
  stamps: number; // 0 - 9
  total_washes: number; // รวมการซักทั้งหมด
  free_rewards_earned: number; // ได้รับสิทธิ์ฟรีสะสม
  free_rewards_remaining: number; // สิทธิ์ฟรีที่ยังไม่ได้ใช้
  created_at?: string;
  updated_at?: string;
}

export interface SukpaOrderData {
  orderId: string;
  phone: string;
  name: string;
  phase: string;
  soi: string;
  addressDetails: string;
  washName?: string;
  washSize?: string;
  waterTemp?: string;
  dryName?: string;
  drySize?: string;
  dryMinutes?: number;
  totalDryMinutes?: number;
  detergentType?: string;
  detergentPrice?: number;
  serviceFee?: number;
  washPrice?: number;
  dryPrice?: number;
  total: number;
  paymentMethod: "promptpay" | "cash_pickup" | "cash_delivery";
  status:
    | "pending"
    | "pending_payment"
    | "cash_pending"
    | "slip_uploaded"
    | "picked_up"
    | "washing"
    | "drying"
    | "delivering"
    | "completed";
  statusText?: string;
  slipPreview?: string;
  slipUrl?: string;
  notes?: string;
  createdAt?: string;
  paidAt?: string;
}

const LOCAL_CUSTOMERS_KEY = "sukpa_customers";
const LOCAL_ORDERS_KEY = "sukpa_orders";

/**
 * แปลงออเดอร์จาก camelCase ให้เข้ากับ schema ของ Supabase (snake_case)
 */
function toSupabaseOrder(o: SukpaOrderData) {
  return {
    order_id: o.orderId,
    phone: (o.phone || "").replace(/[^0-9]/g, ""),
    name: o.name || "",
    phase: o.phase || "",
    soi: o.soi || "",
    address_details: o.addressDetails || "",
    wash_size: o.washName || o.washSize || "",
    water_temp: o.waterTemp || "cold",
    dry_size: o.dryName || o.drySize || "",
    dry_minutes: o.totalDryMinutes || o.dryMinutes || 24,
    detergent_type: o.detergentType || "",
    total_price: o.total || 0,
    payment_method: o.paymentMethod || "promptpay",
    status: o.status || "pending",
    slip_url: o.slipPreview || o.slipUrl || null,
    notes: o.notes || "",
    created_at: o.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * แปลงออเดอร์จาก Supabase (snake_case) ให้เข้ากับ React components (camelCase)
 */
function fromSupabaseOrder(row: any): SukpaOrderData {
  return {
    orderId: row.order_id,
    phone: row.phone,
    name: row.name,
    phase: row.phase,
    soi: row.soi,
    addressDetails: row.address_details,
    washName: row.wash_size,
    waterTemp: row.water_temp,
    dryName: row.dry_size,
    totalDryMinutes: row.dry_minutes,
    total: Number(row.total_price) || 0,
    paymentMethod: row.payment_method,
    status: row.status,
    slipPreview: row.slip_url,
    slipUrl: row.slip_url,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

/**
 * บันทึกออเดอร์ลง Supabase และ LocalStorage พร้อมกัน
 */
export async function saveOrder(order: SukpaOrderData): Promise<SukpaOrderData> {
  const cleanPhone = (order.phone || "").replace(/[^0-9]/g, "");

  // 1. บันทึกลง LocalStorage ทันทีเพื่อความเร็ว
  if (typeof window !== "undefined") {
    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || "[]");
      const foundIdx = existing.findIndex((o: any) => o.orderId === order.orderId);
      if (foundIdx >= 0) {
        existing[foundIdx] = { ...existing[foundIdx], ...order };
      } else {
        existing.unshift(order);
      }
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(existing));
      localStorage.setItem("current_sukpa_order", JSON.stringify(order));
    } catch (e) {
      console.error("Local storage order save error:", e);
    }
  }

  // 2. บันทึกลง Supabase Database
  try {
    const sbPayload = toSupabaseOrder(order);
    const { error } = await supabase.from("sukpa_orders").upsert(sbPayload);
    if (error) {
      console.error("Supabase save order error:", error);
    }
  } catch (err) {
    console.warn("Supabase order upsert failed, offline fallback:", err);
  }

  // 3. บันทึกข้อมูลลูกค้าลงฐานข้อมูลด้วย (ถ้ามีเบอร์โทร)
  if (cleanPhone) {
    try {
      await saveCustomer({
        phone: cleanPhone,
        name: order.name,
        phase: order.phase,
        soi: order.soi,
        address_details: order.addressDetails,
      });
    } catch (e) {
      // ignore
    }
  }

  return order;
}

/**
 * ดึงรายการออเดอร์ทั้งหมด (ดึงจาก Supabase เป็นหลัก, fallback LocalStorage)
 */
export async function getAllOrders(): Promise<SukpaOrderData[]> {
  try {
    const { data, error } = await supabase
      .from("sukpa_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      const mapped = data.map(fromSupabaseOrder);
      // Sync กลับไปเก็บใน LocalStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(mapped));
      }
      return mapped;
    }
  } catch (err) {
    console.warn("Supabase fetch orders error, falling back to LocalStorage:", err);
  }

  // Fallback to LocalStorage
  if (typeof window !== "undefined") {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  return [];
}

/**
 * อัปเดตสถานะออเดอร์
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: SukpaOrderData["status"],
  notes?: string
): Promise<boolean> {
  // 1. LocalStorage
  if (typeof window !== "undefined") {
    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || "[]");
      const foundIdx = existing.findIndex((o: any) => o.orderId === orderId);
      if (foundIdx >= 0) {
        existing[foundIdx].status = newStatus;
        if (notes !== undefined) existing[foundIdx].notes = notes;
        localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(existing));
      }
    } catch (e) {
      console.error("Local storage update error:", e);
    }
  }

  // 2. Supabase
  try {
    const updateData: any = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };
    if (notes !== undefined) updateData.notes = notes;

    const { error } = await supabase
      .from("sukpa_orders")
      .update(updateData)
      .eq("order_id", orderId);

    if (error) {
      console.error("Supabase update status error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase update error:", err);
    return false;
  }
}

/**
 * ลบออเดอร์
 */
export async function deleteOrder(orderId: string): Promise<boolean> {
  if (typeof window !== "undefined") {
    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || "[]");
      const filtered = existing.filter((o: any) => o.orderId !== orderId);
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error("Local storage delete error:", e);
    }
  }

  try {
    const { error } = await supabase.from("sukpa_orders").delete().eq("order_id", orderId);
    return !error;
  } catch (e) {
    return false;
  }
}

/**
 * ดึงข้อมูลแต้มสะสมและโปรไฟล์ลูกค้าด้วยเบอร์โทรศัพท์
 */
export async function getCustomerPoints(phone: string): Promise<SukpaCustomer | null> {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  if (!cleanPhone) return null;

  // 1. ดึงจาก Supabase
  try {
    const { data, error } = await supabase
      .from("sukpa_customers")
      .select("*")
      .eq("phone", cleanPhone)
      .maybeSingle();

    if (!error && data) {
      return data as SukpaCustomer;
    }
  } catch (err) {
    console.warn("Supabase fetch customer error:", err);
  }

  // 2. Fallback ดึงจาก LocalStorage
  if (typeof window !== "undefined") {
    const local = JSON.parse(localStorage.getItem(LOCAL_CUSTOMERS_KEY) || "{}");
    if (local[cleanPhone]) {
      return local[cleanPhone] as SukpaCustomer;
    }

    // คำนวณแต้มเบื้องต้นจากประวัติ sukpa_orders ถ้ามี
    const orders = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || "[]");
    const customerOrders = orders.filter(
      (o: any) => o.phone && o.phone.replace(/[^0-9]/g, "") === cleanPhone
    );

    if (customerOrders.length > 0) {
      const latest = customerOrders[0];
      const completedCount = customerOrders.filter((o: any) => o.status === "completed").length;
      const count = completedCount > 0 ? completedCount : customerOrders.length;
      const stamps = count % 10;
      const freeEarned = Math.floor(count / 10);

      const generated: SukpaCustomer = {
        phone: cleanPhone,
        name: latest.name || "ลูกค้าประจำ",
        phase: latest.phase || "เฟส 1",
        soi: latest.soi || "",
        address_details: latest.addressDetails || "",
        stamps: stamps,
        total_washes: count,
        free_rewards_earned: freeEarned,
        free_rewards_remaining: freeEarned,
        created_at: new Date().toISOString(),
      };
      local[cleanPhone] = generated;
      localStorage.setItem(LOCAL_CUSTOMERS_KEY, JSON.stringify(local));
      return generated;
    }
  }

  return null;
}

/**
 * บันทึกหรืออัปเดตข้อมูลลูกค้า
 */
export async function saveCustomer(customer: Partial<SukpaCustomer> & { phone: string }): Promise<SukpaCustomer> {
  const cleanPhone = customer.phone.replace(/[^0-9]/g, "");
  const payload: SukpaCustomer = {
    phone: cleanPhone,
    name: customer.name || "",
    phase: customer.phase || "เฟส 1",
    soi: customer.soi || "",
    address_details: customer.address_details || "",
    stamps: customer.stamps ?? 0,
    total_washes: customer.total_washes ?? 0,
    free_rewards_earned: customer.free_rewards_earned ?? 0,
    free_rewards_remaining: customer.free_rewards_remaining ?? 0,
    updated_at: new Date().toISOString(),
  };

  // บันทึกลง LocalStorage
  if (typeof window !== "undefined") {
    const local = JSON.parse(localStorage.getItem(LOCAL_CUSTOMERS_KEY) || "{}");
    local[cleanPhone] = { ...(local[cleanPhone] || {}), ...payload };
    localStorage.setItem(LOCAL_CUSTOMERS_KEY, JSON.stringify(local));
  }

  // บันทึกลง Supabase
  try {
    await supabase.from("sukpa_customers").upsert(payload);
  } catch (err) {
    console.warn("Supabase upsert customer error:", err);
  }

  return payload;
}

/**
 * เพิ่มแต้มสะสมเมื่อซักเสร็จสมบูรณ์
 */
export async function addStampToCustomer(phone: string, amount = 1): Promise<SukpaCustomer | null> {
  let customer = await getCustomerPoints(phone);
  if (!customer) {
    customer = {
      phone: phone.replace(/[^0-9]/g, ""),
      name: "ลูกค้า",
      phase: "เฟส 1",
      soi: "",
      address_details: "",
      stamps: 0,
      total_washes: 0,
      free_rewards_earned: 0,
      free_rewards_remaining: 0,
    };
  }

  let newStamps = customer.stamps + amount;
  let newTotal = customer.total_washes + amount;
  let newEarned = customer.free_rewards_earned;
  let newRemaining = customer.free_rewards_remaining;

  // ครบ 10 แต้ม ได้รับสิทธิ์ซักฟรี 1 ครั้ง
  if (newStamps >= 10) {
    const rewardsToAdd = Math.floor(newStamps / 10);
    newEarned += rewardsToAdd;
    newRemaining += rewardsToAdd;
    newStamps = newStamps % 10;
  }

  const updated: SukpaCustomer = {
    ...customer,
    stamps: newStamps,
    total_washes: newTotal,
    free_rewards_earned: newEarned,
    free_rewards_remaining: newRemaining,
    updated_at: new Date().toISOString(),
  };

  return await saveCustomer(updated);
}

/**
 * ใช้สิทธิ์ซักฟรี (Redeem 10 ฟรี 1)
 */
export async function redeemFreeReward(phone: string): Promise<SukpaCustomer | null> {
  const customer = await getCustomerPoints(phone);
  if (!customer || customer.free_rewards_remaining <= 0) {
    return null;
  }

  const updated: SukpaCustomer = {
    ...customer,
    free_rewards_remaining: customer.free_rewards_remaining - 1,
    updated_at: new Date().toISOString(),
  };

  return await saveCustomer(updated);
}
