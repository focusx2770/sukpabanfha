/**
 * Thai PromptPay EMVCo QR Code Payload Generator
 * Supports Mobile number 0661323388 -> 0066661323388
 */

function crc16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    let c = data.charCodeAt(i);
    crc ^= c << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  let hex = (crc & 0xffff).toString(16).toUpperCase();
  while (hex.length < 4) {
    hex = "0" + hex;
  }
  return hex;
}

function f(id: string, value: string): string {
  const len = value.length.toString().padStart(2, "0");
  return `${id}${len}${value}`;
}

export function generatePromptPayPayload(mobileOrId: string, amount?: number): string {
  // Format mobile: 0661323388 -> 0066661323388
  const clean = mobileOrId.replace(/[^0-9]/g, "");
  let target = "";
  if (clean.length === 10 && clean.startsWith("0")) {
    target = "0066" + clean.substring(1);
  } else {
    target = clean;
  }
  const formattedTarget = target.padStart(13, "0");

  // Merchant Account Info (Tag 29)
  const tag00 = f("00", "A000000677010111");
  const tag01 = f("01", formattedTarget);
  const merchantInfo = f("29", tag00 + tag01);

  let raw =
    f("00", "01") + // Payload Format Indicator
    f("01", amount && amount > 0 ? "12" : "11") + // 12 = Dynamic, 11 = Static
    merchantInfo +
    f("53", "764") + // THB
    f("58", "TH");   // Country

  if (amount && amount > 0) {
    raw += f("54", amount.toFixed(2));
  }

  raw += "6304";
  const checksum = crc16(raw);
  return raw + checksum;
}

export function getPromptPayQRUrl(mobile: string, amount: number): string {
  const payload = generatePromptPayPayload(mobile, amount);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(payload)}`;
}
