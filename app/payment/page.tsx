"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import SukpaNavbar from "@/components/SukpaNavbar";
import SukpaFooter from "@/components/SukpaFooter";
import { PROMPTPAY_CONFIG } from "@/lib/sukpaPricing";
import { getPromptPayQRUrl } from "@/lib/promptpay";
import { saveOrder } from "@/lib/sukpaDb";
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  ArrowRight,
  Upload,
  Truck,
  Phone,
  User,
  AlertCircle,
} from "lucide-react";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderIdParam = searchParams.get("orderId");

  const [order, setOrder] = useState<any>(null);
  const [amount, setAmount] = useState<number>(140);
  const [orderId, setOrderId] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");

  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [copiedAcc, setCopiedAcc] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Real PromptPay credentials from user
  const promptPayNumber = PROMPTPAY_CONFIG.phone;
  const promptPayFormatted = PROMPTPAY_CONFIG.phoneFormatted;
  const accountHolder = PROMPTPAY_CONFIG.accountName;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("current_sukpa_order");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setOrder(parsed);
          setAmount(parsed.total || 140);
          setOrderId(parsed.orderId || orderIdParam || `SP-${Date.now().toString().slice(-6)}`);
          setPhone(parsed.phone || "");
          setCustomerName(parsed.name || "");
          return;
        } catch (e) {
          console.error(e);
        }
      }
      setOrderId(orderIdParam || `SP-${Date.now().toString().slice(-6)}`);
    }
  }, [orderIdParam]);

  // Handle Slip Upload
  const handleSlipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSlipFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Copy account number
  const handleCopyAccount = () => {
    navigator.clipboard.writeText(promptPayNumber);
    setCopiedAcc(true);
    setTimeout(() => setCopiedAcc(false), 2000);
  };

  // Submit payment confirmation
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slipPreview) {
      alert("กรุณาแนบรูปสลิปการโอนเงินก่อนกดยืนยันครับ");
      return;
    }

    const updatedOrder: any = {
      ...(order || {}),
      orderId: orderId || `SP-${Date.now().toString().slice(-6)}`,
      name: customerName || "ลูกค้าบ้านฟ้าปิยรมณ์",
      phone: phone || "08X-XXX-XXXX",
      total: amount,
      paymentMethod: "promptpay",
      slipPreview: slipPreview,
      status: "slip_uploaded",
      statusText: "รับแจ้งชำระเงินแล้ว (รอตรวจสอบ)",
      paidAt: new Date().toISOString(),
    };

    // บันทึกลง Supabase Database + LocalStorage
    await saveOrder(updatedOrder);

    // ยิงแจ้งเตือนเข้า Discord Webhook ว่าแนบสลิปแล้ว
    fetch("/api/notify-discord", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: updatedOrder, type: "slip_uploaded" }),
    }).catch((err) => console.warn("Discord notify error:", err));

    setIsSubmitted(true);
  };

  // Real Dynamic EMVCo QR Code URL
  const qrCodeUrl = getPromptPayQRUrl(promptPayNumber, amount);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SukpaNavbar />

      <main className="flex-1 pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>ชำระเงินสะดวกรวดเร็ว ปลอดภัย</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              สแกนจ่ายผ่าน พร้อมเพย์ (PromptPay)
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1.5">
              สแกน QR Code แล้วแนบสลิปเพื่อยืนยันคิวซัก+อบผ้าได้ทันที
            </p>
          </div>

          {isSubmitted ? (
            /* Success Card with Loyalty 10 Free 1 Stamp Progress */
            <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-emerald-300 shadow-xl shadow-emerald-500/10 text-center max-w-lg mx-auto space-y-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl animate-bounce">
                🎉
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  แจ้งชำระเงินสำเร็จแล้ว!
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-1">
                  รหัสคำสั่งซื้อ: <span className="font-mono font-bold text-sky-600">{orderId}</span>
                </p>
                <p className="text-xs text-slate-500 mt-1.5">
                  ระบบได้บันทึกสลิปเรียบร้อยแล้ว แอดมินจะรีบจัดคิวเข้ารับผ้าตามเวลาที่ระบุครับ
                </p>
              </div>

              {/* 🎁 กล่องสะสมแต้ม 10 ฟรี 1 (ขึ้นหลังโอนเงินเสร็จ) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-200 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🫧</span>
                    <div>
                      <h4 className="font-black text-slate-900 text-xs sm:text-sm">
                        แต้มสะสมได้รับแล้ว: +1 แต้ม!
                      </h4>
                      <p className="text-[11px] text-emerald-700">
                        ผูกกับเบอร์โทร {phone || "-"}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-800 bg-white px-2.5 py-1 rounded-full border border-emerald-200">
                    โปร 10 ฟรี 1
                  </span>
                </div>

                {/* 10 Stamps Preview Visual */}
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 pt-1">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center text-center text-xs font-bold transition-all ${
                        i === 0
                          ? "bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-xs scale-105"
                          : "bg-white border border-emerald-200 text-slate-400"
                      }`}
                    >
                      <span>{i === 0 ? "🫧" : i + 1}</span>
                    </div>
                  ))}
                  <div className="aspect-square rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex flex-col items-center justify-center text-center text-[10px] font-black shadow-xs">
                    <span>🎁</span>
                    <span>ฟรี!</span>
                  </div>
                </div>

                <p className="text-[11px] text-emerald-800 text-center font-medium">
                  ซักอีก 9 ครั้ง รับสิทธิ์ซัก+อบแห้งฟรี 1 ครั้งเต็มๆ!
                </p>
              </div>

              {/* Order Info Summary */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">ยอดที่ชำระ (รวมค่าบริการ):</span>
                  <span className="font-bold text-slate-900">{amount} บาท</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ผู้สั่ง:</span>
                  <span className="font-semibold text-slate-800">{customerName || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">เบอร์โทรศัพท์:</span>
                  <span className="font-semibold text-slate-800">{phone || "-"}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => router.push(`/track?search=${phone || orderId}`)}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-base shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Truck className="w-5 h-5" />
                  <span>ไปหน้าเช็คสถานะผ้า (Track)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  href="/"
                  className="block text-xs text-slate-500 hover:text-slate-700 underline font-medium"
                >
                  กลับสู่หน้าแรก
                </Link>
              </div>
            </div>
          ) : (
            /* Payment Form */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
              {/* QR Code Section (5 cols) */}
              <div className="md:col-span-5 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xl shadow-sky-500/5 text-center">
                {/* PromptPay Brand Header */}
                <div className="bg-[#003d6d] text-white py-2.5 px-4 rounded-2xl mb-4 flex items-center justify-center gap-2 font-bold text-sm tracking-wide shadow-sm">
                  <span className="text-base">💳</span>
                  <span>Thai PromptPay พร้อมเพย์</span>
                </div>

                {/* QR Code Box (Real EMVCo QR Code) */}
                <div className="bg-white p-3 sm:p-4 rounded-2xl border-2 border-dashed border-sky-300 inline-block shadow-inner mb-4 relative group">
                  <div className="w-52 h-52 sm:w-56 sm:h-56 bg-slate-50 rounded-xl flex flex-col items-center justify-center p-2 relative overflow-hidden">
                    <img
                      src={qrCodeUrl}
                      alt="PromptPay QR Code ของจริง"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-2">
                    สแกนผ่านแอปธนาคารได้ทุกธนาคาร
                  </span>
                </div>

                {/* Price Display */}
                <div className="bg-sky-50/80 p-3.5 rounded-2xl border border-sky-100 mb-4">
                  <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
                    ยอดเงินที่ต้องชำระ (รวมค่าบริการ 50.-)
                  </span>
                  <span className="text-3xl font-black text-sky-600">{amount}</span>
                  <span className="text-sm font-bold text-slate-700 ml-1">บาท</span>
                </div>

                {/* Real Bank / Promptpay Info */}
                <div className="space-y-2 text-xs text-left bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">เบอร์พร้อมเพย์:</span>
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className="font-bold text-slate-900 hover:text-sky-600 flex items-center gap-1 cursor-pointer bg-white px-2 py-1 rounded-lg border border-slate-200"
                    >
                      <span>{promptPayFormatted}</span>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">ชื่อบัญชี:</span>
                    <span className="font-bold text-slate-900">{accountHolder}</span>
                  </div>
                </div>

                {copiedAcc && (
                  <p className="text-[11px] text-emerald-600 font-bold mt-2 animate-fadeIn">
                    คัดลอกเบอร์พร้อมเพย์แล้ว! 📋
                  </p>
                )}
              </div>

              {/* Upload Slip Section (7 cols) */}
              <div className="md:col-span-7 bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-xl shadow-sky-500/5">
                <form onSubmit={handleSubmitPayment} className="space-y-4 sm:space-y-5">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-sm">
                      📸
                    </div>
                    <div>
                      <h2 className="font-black text-slate-900 text-base">แนบหลักฐานการโอนเงิน (สลิป)</h2>
                      <p className="text-xs text-slate-500">อัปโหลดรูปภาพสลิปที่แคปเจอร์จากแอปธนาคาร</p>
                    </div>
                  </div>

                  {/* Order Details Preview Inputs (Locked / Read-Only) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700">
                          รหัสออเดอร์:
                        </label>
                        <span className="text-[10px] text-slate-600 flex items-center gap-1 font-semibold">
                          🔒 ล็อกอัตโนมัติ
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={orderId}
                          readOnly
                          className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-slate-100/90 text-slate-700 text-base font-mono font-black cursor-not-allowed select-none shadow-inner"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700">
                          ยอดเงินที่ต้องชำระ:
                        </label>
                        <span className="text-[10px] text-sky-600 font-bold">
                          รวมค่าบริการ 50.-
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={`${amount} บาท`}
                          readOnly
                          className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-slate-100/90 text-sky-700 text-base font-black cursor-not-allowed select-none shadow-inner"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ชื่อ / ผู้แจ้งโอน:
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="ระบุชื่อผู้ติดต่อ"
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-slate-800 text-base focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        เบอร์โทรศัพท์: <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="เบอร์โทรที่ใช้เช็คสถานะ"
                        required
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-slate-800 text-base focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  {/* Drag and Drop File Area */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      อัปโหลดรูปภาพสลิป: <span className="text-rose-500">*</span>
                    </label>

                    {slipPreview ? (
                      /* Preview Box */
                      <div className="relative rounded-2xl border-2 border-emerald-400 bg-emerald-50/30 p-4 text-center">
                        <div className="max-w-xs mx-auto max-h-72 overflow-hidden rounded-xl border border-slate-200 shadow-md">
                          <img
                            src={slipPreview}
                            alt="Slip Preview"
                            className="w-full h-auto object-contain"
                          />
                        </div>
                        <p className="text-xs font-bold text-emerald-700 mt-2 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                          แนบรูปสลิปเรียบร้อยแล้ว
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setSlipFile(null);
                            setSlipPreview(null);
                          }}
                          className="mt-2 text-xs text-rose-600 hover:text-rose-700 underline font-semibold cursor-pointer"
                        >
                          เปลี่ยนรูปสลิปใหม่
                        </button>
                      </div>
                    ) : (
                      /* Upload Input */
                      <label className="border-2 border-dashed border-slate-300 hover:border-sky-400 bg-slate-50 hover:bg-sky-50/50 rounded-2xl p-6 sm:p-7 flex flex-col items-center justify-center cursor-pointer transition-all">
                        <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mb-2">
                          <Upload className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-slate-800 text-sm">
                          คลิกเพื่อเลือกรูปสลิปโอนเงิน
                        </span>
                        <span className="text-xs text-slate-500 mt-1">
                          รองรับไฟล์ JPG, PNG จากแอปธนาคาร
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSlipChange}
                          className="hidden"
                          required
                        />
                      </label>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={!slipPreview}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-sky-600 hover:from-emerald-600 hover:to-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-base shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>ยืนยันการชำระเงิน</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 text-center">
                    🔒 สลิปของคุณจะถูกส่งให้แอดมินตรวจสอบเพื่อจัดคิวรับผ้าทันที
                  </p>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      <SukpaFooter />
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">กำลังโหลด...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
