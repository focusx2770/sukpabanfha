const WEBHOOK_URL =
  process.env.DISCORD_WEBHOOK_URL ||
  "https://discord.com/api/webhooks/1571245245708898469/_JrLpalb0UBUrvh1bAUOJ4lBkgD7J1q-bkZ15ZmItlxY9JcGdqWDCxiBOsYljhxbIh9h";

interface OrderNotifyPayload {
  orderId: string;
  name: string;
  phone: string;
  phase: string;
  soi?: string;
  addressDetails?: string;
  washName?: string;
  waterTemp?: string;
  dryName?: string;
  totalDryMinutes?: number;
  detergentPrice?: number;
  total: number;
  paymentMethod: string;
  status?: string;
  slipPreview?: string;
  notes?: string;
}

export async function sendDiscordOrderNotification(
  order: OrderNotifyPayload,
  type: "new_order" | "slip_uploaded" | "status_change" = "new_order"
) {
  if (!WEBHOOK_URL) return;

  const isPromptPay = order.paymentMethod === "promptpay";
  const isCashPickup = order.paymentMethod === "cash_pickup";
  const isCashDelivery = order.paymentMethod === "cash_delivery";

  let payLabel = "พร้อมเพย์ (PromptPay QR)";
  let payStatusNote = isPromptPay ? "รอสแกนโอนเงิน" : "เก็บเงินสด";
  if (isCashPickup) payLabel = "💵 เก็บเงินสดตอนเข้ารับผ้า";
  if (isCashDelivery) payLabel = "💵 เก็บเงินสดตอนส่งผ้าคืน";

  let title = "🧺 มีออเดอร์ใหม่เข้ามา!";
  let color = 0x0284c7; // sky-600
  let description = "มีลูกค้าสั่งจองคิวซัก-อบผ้าใหม่ในโครงการบ้านฟ้าปิยรมณ์";

  if (type === "slip_uploaded") {
    title = "📸 ลูกค้าแนบสลิปโอนเงินแล้ว (พร้อมเพย์)!";
    color = 0x10b981; // emerald-500
    description = "ลูกค้าโอนเงินและแนบหลักฐานสลิปเรียบร้อยแล้ว แอดมินโปรดตรวจยอดเงิน";
  }

  const fields = [
    {
      name: "📋 รหัสออเดอร์",
      value: `**${order.orderId}**`,
      inline: true,
    },
    {
      name: "👤 ลูกค้า",
      value: `${order.name || "ลูกค้า"} (${order.phone || "ไม่ระบุเบอร์"})`,
      inline: true,
    },
    {
      name: "💵 ยอดเงินรวม",
      value: `**฿${(Number(order.total) || 0).toLocaleString()} บาท**\n(${payLabel})`,
      inline: true,
    },
    {
      name: "🛵 พิกัดเข้ารับผ้า (สำหรับไรเดอร์/คนขับ)",
      value: `📍 **${order.phase || "บ้านฟ้าปิยรมณ์"}** ${order.soi ? `(ซอย ${order.soi})` : ""}\n🏠 ${
        order.addressDetails || "ดูรายละเอียดหน้าบ้าน"
      }\n📞 โทร: [${order.phone}](tel:${order.phone})`,
      inline: false,
    },
    {
      name: "🧺 รายการซัก & อบ",
      value: `• ซัก: ${order.washName || "เครื่องซัก"} (${order.waterTemp === "hot" ? "น้ำร้อน" : order.waterTemp === "warm" ? "น้ำอุ่น" : "น้ำอุณหภูมิปกติ"})\n• อบ: ${
        order.dryName || "เครื่องอบ"
      } (${order.totalDryMinutes || 24} นาที)`,
      inline: false,
    },
  ];

  // ถ้าเป็นเก็บเงินสด ไฮไลต์ให้คนขับเห็นชัดๆ
  if (!isPromptPay) {
    fields.push({
      name: "⚠️ เตือนไรเดอร์เก็บเงินสด",
      value: `🚨 **คนขับต้องเก็บเงินสดจากลูกค้า: ฿${(Number(order.total) || 0).toLocaleString()} บาท** (${
        isCashPickup ? "ตอนรับผ้า" : "ตอนส่งผ้า"
      })`,
      inline: false,
    });
  }

  const embed: any = {
    title,
    description,
    color,
    fields,
    footer: {
      text: "ระบบแจ้งเตือนอัตโนมัติ ซักป่ะ? บ้านฟ้าปิยรมณ์ • https://sukpa.vercel.app/admin",
    },
    timestamp: new Date().toISOString(),
  };

  // ถ้ามีสลิปและเป็น URL รูปภาพ
  if (order.slipPreview && order.slipPreview.startsWith("http")) {
    embed.image = { url: order.slipPreview };
  }

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🔔 **[แจ้งเตือนซักป่ะ?]** ออเดอร์ **${order.orderId}** (${order.phase})`,
        embeds: [embed],
      }),
    });
  } catch (error) {
    console.error("Failed to send Discord notification:", error);
  }
}
