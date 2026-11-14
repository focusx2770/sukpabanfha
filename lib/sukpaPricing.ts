export interface WashOption {
  id: string;
  name: string;
  capacity: string;
  desc: string;
  prices: {
    cold: number; // น้ำเย็น
    warm: number; // น้ำอุ่น
    hot: number;  // น้ำร้อน
  };
}

export interface DryOption {
  id: string;
  name: string;
  capacity: string;
  baseMinutes: number;
  basePrice: number;
  addTimeMinutes: number;
  addTimePrice: number;
  desc: string;
}

// ข้อมูลพร้อมเพย์จริงของเจ้าของร้าน
export const PROMPTPAY_CONFIG = {
  phone: "0661323388",
  phoneFormatted: "066-132-3388",
  accountName: "นายธนกร ชูวงศ์วาลย์",
  serviceFee: 50, // ค่าบริการ 50 บาททุกเฟส
};

// ข้อมูล LINE OA ทางการของร้าน
export const LINE_OA_CONFIG = {
  url: "https://line.me/R/ti/p/@250mxrfh",
  id: "@250mxrfh",
  name: "ซักป่ะ? บ้านฟ้าปิยรมณ์",
  qrImage: "/images/sukpa-logo.jpg",
};

// ราคาตามตู้ซักมาตรฐาน
export const WASH_OPTIONS: WashOption[] = [
  {
    id: "9kg",
    name: "เครื่องซัก 9 kg",
    capacity: "9 กิโลกรัม",
    desc: "ผ้าประจำวัน 10-15 ชิ้น",
    prices: { cold: 40, warm: 50, hot: 60 },
  },
  {
    id: "14kg",
    name: "เครื่องซัก 14 kg",
    capacity: "14 กิโลกรัม",
    desc: "ผ้าทั่วไป 15-25 ชิ้น",
    prices: { cold: 60, warm: 70, hot: 80 },
  },
  {
    id: "18kg",
    name: "เครื่องซัก 18 kg",
    capacity: "18 กิโลกรัม",
    desc: "ผ้ากองโต หรือชุดเครื่องนอน",
    prices: { cold: 70, warm: 80, hot: 90 },
  },
  {
    id: "28kg",
    name: "เครื่องซัก 28 kg",
    capacity: "28 กิโลกรัม",
    desc: "ผ้านวมหนา / ไซส์จัมโบ้พิเศษ",
    prices: { cold: 100, warm: 120, hot: 140 },
  },
];

export const DRY_OPTIONS: DryOption[] = [
  {
    id: "15kg",
    name: "เครื่องอบ 15 kg",
    capacity: "15 กิโลกรัม",
    baseMinutes: 24,
    basePrice: 50,
    addTimeMinutes: 6,
    addTimePrice: 10,
    desc: "เหมาะกับผ้าทั่วไป แห้งสนิท 24 นาที (ต่อเวลา +6 นาที / 10฿)",
  },
  {
    id: "25kg",
    name: "เครื่องอบ 25 kg",
    capacity: "25 กิโลกรัม",
    baseMinutes: 24,
    basePrice: 70,
    addTimeMinutes: 5,
    addTimePrice: 10,
    desc: "เหมาะกับผ้านวมหนา ผ้ากองใหญ่ อบแห้ง 24 นาที (ต่อเวลา +5 นาที / 10฿)",
  },
];

export const PHASES = Array.from({ length: 17 }, (_, i) => `เฟส ${i + 1}`);

export const DETERGENT_OPTIONS = [
  {
    id: "own",
    name: "นำน้ำยามาเอง",
    desc: "วางคู่กับถุงผ้าหน้าบ้าน",
    price: 0,
  },
  {
    id: "shop",
    name: "ร้านจัดเตรียมให้",
    desc: "น้ำยาซัก + ปรับผ้านุ่มสูตรหอมสะอาด",
    price: 15,
  },
];

export interface OrderState {
  orderId?: string;
  name: string;
  phone: string;
  phase: string;
  soi: string;
  addressDetails: string;
  washId: string;
  waterTemp: "cold" | "warm" | "hot";
  dryId: string;
  extraDrySteps: number;
  detergentId: string;
  paymentMethod?: "promptpay" | "cash_pickup" | "cash_delivery";
  notes: string;
}

export function calculateOrderPrice(state: {
  washId: string;
  waterTemp: "cold" | "warm" | "hot";
  dryId: string;
  extraDrySteps: number;
  detergentId: string;
}) {
  const washOpt = WASH_OPTIONS.find((w) => w.id === state.washId) || WASH_OPTIONS[0];
  const dryOpt = DRY_OPTIONS.find((d) => d.id === state.dryId) || DRY_OPTIONS[0];
  const detergentOpt = DETERGENT_OPTIONS.find((det) => det.id === state.detergentId) || DETERGENT_OPTIONS[0];

  const washPrice = washOpt.prices[state.waterTemp] || 40;
  const dryPrice = dryOpt.basePrice + (state.extraDrySteps * dryOpt.addTimePrice);
  const totalDryMinutes = dryOpt.baseMinutes + (state.extraDrySteps * dryOpt.addTimeMinutes);
  const detergentPrice = detergentOpt.price;
  
  // ค่าบริการ 50 บาททุกเฟสในบ้านฟ้าปิยรมณ์
  const serviceFee = PROMPTPAY_CONFIG.serviceFee;
  const total = washPrice + dryPrice + detergentPrice + serviceFee;

  return {
    washOpt,
    dryOpt,
    detergentOpt,
    washPrice,
    dryPrice,
    totalDryMinutes,
    detergentPrice,
    serviceFee,
    total,
  };
}

export function formatLineBookingMessage(order: OrderState) {
  const calc = calculateOrderPrice({
    washId: order.washId,
    waterTemp: order.waterTemp,
    dryId: order.dryId,
    extraDrySteps: order.extraDrySteps,
    detergentId: order.detergentId,
  });

  const tempNameMap = {
    cold: "น้ำเย็น",
    warm: "น้ำอุ่น",
    hot: "น้ำร้อน",
  };

  const paymentTextMap = {
    promptpay: "สแกนจ่าย QR พร้อมเพย์",
    cash_pickup: "เงินสด (จ่ายตอนเริ่มงาน / เข้ารับผ้า)",
    cash_delivery: "เงินสด (จ่ายหลังเลิกงาน / ส่งผ้าคืน)",
  };

  const paymentDesc = order.paymentMethod ? paymentTextMap[order.paymentMethod] : "ระบุตอนยืนยัน";

  return (
    `🧺 แจ้งจองคิวซัก+อบผ้า — ซักป่ะ? บ้านฟ้าปิยรมณ์ 🫧\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `👤 ชื่อผู้จอง: ${order.name || "(ไม่ได้ระบุ)"}\n` +
    `📞 เบอร์โทร: ${order.phone || "(ไม่ได้ระบุ)"}\n` +
    `🏡 ที่อยู่: บ้านฟ้าปิยรมณ์ ${order.phase} ${order.soi ? `ซอย ${order.soi}` : ""}\n` +
    `📍 บ้านเลขที่ / จุดสังเกต: ${order.addressDetails || "-"}\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `🧼 รายการบริการ (บังคับซัก+อบ):\n` +
    `  • ซักผ้า: ${calc.washOpt.name} (${tempNameMap[order.waterTemp]}) - ${calc.washPrice} ฿\n` +
    `  • อบผ้า: ${calc.dryOpt.name} (${calc.totalDryMinutes} นาที) - ${calc.dryPrice} ฿\n` +
    `  • น้ำยา: ${calc.detergentOpt.name} (${calc.detergentPrice > 0 ? `+${calc.detergentPrice}฿` : "ฟรี"})\n` +
    `  • ค่าบริการรับ-ส่งดูแล: 50 ฿ (ทุกเฟส)\n` +
    `💳 รูปแบบชำระเงิน: ${paymentDesc}\n` +
    (order.notes ? `📝 หมายเหตุ: ${order.notes}\n` : "") +
    `━━━━━━━━━━━━━━━━━━\n` +
    `💰 รวมยอดชำระสุทธิ: ${calc.total} บาท\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `🎁 ซักครบ 10 ครั้ง ฟรี 1 ครั้งทันที!\n` +
    `✅ ลูกค้ายอมรับกฎและเงื่อนไขการให้บริการเรียบร้อยแล้ว\n` +
    `🫧 ซักสะอาด อบแห้งสนิท 100% ส่งถึงหน้าบ้าน ขอบคุณครับ/ค่ะ 🙏`
  );
}

// แบบฟอร์มสั้นๆ สำหรับคนไม่ถนัดใช้เว็บ สั่งผ่าน LINE ได้ง่ายๆ
export const EASY_LINE_ORDER_TEMPLATE = 
`🧺 สั่งซักผ้า — ซักป่ะ? บ้านฟ้าปิยรมณ์ 🫧
1. ชื่อ - เบอร์โทร : 
2. ที่อยู่ : บ้านฟ้าปิยรมณ์ เฟส...... ซอย...... บ้านเลขที่......
3. รายละเอียดผ้า : (เช่น เสื้อผ้า 1 ตะกร้า / ผ้านวม 1 ผืน)
4. เวลาที่สะดวกให้เข้ารับ : 
5. วิธีชำระเงิน : (พร้อมเพย์ / เงินสดตอนรับผ้า / เงินสดตอนส่งผ้า)
----------------------------------
* โปรโมชั่น ซัก 10 ครั้ง ฟรี 1 ครั้ง! 🎁`;
