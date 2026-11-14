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

const LOCAL_CUSTOMERS_KEY = "sukpa_customers";

/**
 * ดึงข้อมูลแต้มสะสมและโปรไฟล์ลูกค้าด้วยเบอร์โทรศัพท์
 */
export async function getCustomerPoints(phone: string): Promise<SukpaCustomer | null> {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  if (!cleanPhone) return null;

  // 1. ลองดึงจาก Supabase
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
    const orders = JSON.parse(localStorage.getItem("sukpa_orders") || "[]");
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
 * เพิ่มแต้มสะสมเมื่อซักเสร็จสมบูรณ์ (หรือแอดมินกดให้แต้ม)
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
