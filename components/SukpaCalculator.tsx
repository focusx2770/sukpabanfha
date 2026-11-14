"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  WASH_OPTIONS,
  DRY_OPTIONS,
  PHASES,
  DETERGENT_OPTIONS,
  calculateOrderPrice,
  formatLineBookingMessage,
  OrderState,
} from "@/lib/sukpaPricing";
import SukpaTermsModal from "@/components/SukpaTermsModal";
import {
  Sparkles,
  Check,
  Copy,
  ArrowRight,
  Plus,
  Minus,
  MapPin,
  Waves,
  Sun,
  Flame,
  CreditCard,
  Lock,
} from "lucide-react";

export default function SukpaCalculator() {
  const router = useRouter();

  // Order state (default 9kg wash + 15kg dry)
  const [orderId, setOrderId] = useState<string>("SP-1001");
  const [washId, setWashId] = useState<string>("9kg");
  const [waterTemp, setWaterTemp] = useState<"cold" | "warm" | "hot">("cold");
  const [dryId, setDryId] = useState<string>("15kg");
  const [extraDrySteps, setExtraDrySteps] = useState<number>(0);
  const [detergentId, setDetergentId] = useState<string>("own");

  // Client-safe order ID
  useEffect(() => {
    setOrderId(`SP-${Math.floor(100000 + Math.random() * 900000)}`);
  }, []);

  // Address & Contact state
  const [phase, setPhase] = useState<string>("เฟส 1");
  const [soi, setSoi] = useState<string>("");
  const [addressDetails, setAddressDetails] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isFreeRewardUsed, setIsFreeRewardUsed] = useState<boolean>(false);
  const [customerProfile, setCustomerProfile] = useState<any>(null);

  // Auto-fetch profile & points when phone is typed (10 digits)
  useEffect(() => {
    const clean = phone.replace(/[^0-9]/g, "");
    if (clean.length === 10) {
      import("@/lib/sukpaDb").then(async ({ getCustomerPoints }) => {
        const profile = await getCustomerPoints(clean);
        if (profile) {
          setCustomerProfile(profile);
          if (!name && profile.name) setName(profile.name);
          if (profile.phase) setPhase(profile.phase);
          if (!soi && profile.soi) setSoi(profile.soi);
          if (!addressDetails && profile.address_details) setAddressDetails(profile.address_details);
        }
      });
    }
  }, [phone]);

  // UI state
  const [copied, setCopied] = useState<boolean>(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState<boolean>(false);

  // Price calculation
  const calc = useMemo(() => {
    return calculateOrderPrice({
      washId,
      waterTemp,
      dryId,
      extraDrySteps,
      detergentId,
    });
  }, [washId, waterTemp, dryId, extraDrySteps, detergentId]);

  // Current order object
  const currentOrder: OrderState = useMemo(() => {
    return {
      orderId,
      name,
      phone,
      phase,
      soi,
      addressDetails,
      washId,
      waterTemp,
      dryId,
      extraDrySteps,
      detergentId,
      notes,
    };
  }, [orderId, name, phone, phase, soi, addressDetails, washId, waterTemp, dryId, extraDrySteps, detergentId, notes]);

  // Copy LINE message
  const handleCopyLine = () => {
    const text = formatLineBookingMessage(currentOrder);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Open the terms modal before going to payment
  const handleOpenPaymentFlow = () => {
    setIsTermsModalOpen(true);
  };

  // Handle final confirmation from Terms Modal
  const handleConfirmedFromModal = (method: "promptpay" | "cash_pickup" | "cash_delivery") => {
    setIsTermsModalOpen(false);

    if (typeof window !== "undefined") {
      const orderPayload = {
        ...currentOrder,
        paymentMethod: method,
        total: calc.total,
        washPrice: calc.washPrice,
        dryPrice: calc.dryPrice,
        detergentPrice: calc.detergentPrice,
        serviceFee: calc.serviceFee,
        totalDryMinutes: calc.totalDryMinutes,
        washName: calc.washOpt.name,
        dryName: calc.dryOpt.name,
        status: method === "promptpay" ? "pending_payment" : "cash_pending",
        statusText:
          method === "promptpay"
            ? "รอชำระเงินผ่านพร้อมเพย์"
            : method === "cash_pickup"
            ? "ชำระเงินสดตอนเริ่มงาน (เข้ารับผ้า)"
            : "ชำระเงินสดหลังเลิกงาน (ส่งผ้าคืน)",
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("current_sukpa_order", JSON.stringify(orderPayload));

      const existing = JSON.parse(localStorage.getItem("sukpa_orders") || "[]");
      existing.unshift(orderPayload);
      localStorage.setItem("sukpa_orders", JSON.stringify(existing));

      if (method === "promptpay") {
        router.push(`/payment?orderId=${currentOrder.orderId}`);
      } else {
        // Cash payment directly goes to tracking
        router.push(`/track?search=${currentOrder.phone || currentOrder.orderId}`);
      }
    }
  };

  return (
    <section id="calculator" className="py-12 sm:py-20 bg-white relative pb-28 sm:pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-2.5">
            <Lock className="w-3.5 h-3.5 text-sky-600" />
            <span>แพ็กเกจซัก+อบ มาตรฐานครบวงจร</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            จัดสเปกซัก+อบ & คำนวณราคาทันที
          </h2>
          <p className="text-slate-600 text-xs sm:text-base mt-2">
            บริการของเราเป็นแบบ **ซักพร้อมอบแห้งสนิท** ไม่ง้อแดด ค่าบริการ 50 บาทครอบคลุมทุกเฟส 1-17 ในบ้านฟ้าปิยรมณ์!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Form: 7 cols */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: ขนาดเครื่องซักผ้า */}
            <div className="bg-slate-50/90 p-4 sm:p-6 rounded-3xl border border-slate-200">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                    ขนาดเครื่องซัก (ราคาตู้มาตรฐาน)
                  </h3>
                </div>
                <span className="text-[11px] text-sky-700 font-bold bg-sky-100 px-2 py-0.5 rounded-full">
                  แยกถังเดี่ยว
                </span>
              </div>

              {/* Grid of Wash Sizes */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {WASH_OPTIONS.map((item) => {
                  const isSelected = washId === item.id;
                  const price = item.prices[waterTemp];
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setWashId(item.id)}
                      className={`p-3 sm:p-4 rounded-2xl text-left border-2 transition-all relative active:scale-[0.98] ${
                        isSelected
                          ? "border-sky-500 bg-sky-50/80 shadow-md shadow-sky-500/10"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-slate-900 text-sm">{item.name}</span>
                        {isSelected && (
                          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{item.desc}</p>
                      <div className="mt-2 text-sky-600 font-black text-sm sm:text-base">
                        {price} บาท
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Water Temperature Selector */}
              <div className="mt-4 pt-3.5 border-t border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  เลือกอุณหภูมิน้ำซักผ้า:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setWaterTemp("cold")}
                    className={`py-2.5 px-2 rounded-xl border text-center transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                      waterTemp === "cold"
                        ? "border-sky-500 bg-sky-100 text-sky-900 font-bold shadow-xs"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Waves className="w-4 h-4 text-sky-500" />
                    <span className="text-xs sm:text-sm">น้ำเย็น</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWaterTemp("warm")}
                    className={`py-2.5 px-2 rounded-xl border text-center transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                      waterTemp === "warm"
                        ? "border-amber-500 bg-amber-100 text-amber-950 font-bold shadow-xs"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span className="text-xs sm:text-sm">น้ำอุ่น</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWaterTemp("hot")}
                    className={`py-2.5 px-2 rounded-xl border text-center transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                      waterTemp === "hot"
                        ? "border-rose-500 bg-rose-100 text-rose-950 font-bold shadow-xs"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Flame className="w-4 h-4 text-rose-500" />
                    <span className="text-xs sm:text-sm">น้ำร้อน</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: ขนาดเครื่องอบผ้า (บังคับอบ) */}
            <div className="bg-slate-50/90 p-4 sm:p-6 rounded-3xl border border-slate-200">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                    เครื่องอบผ้า (ราคาตู้มาตรฐาน)
                  </h3>
                </div>
                <span className="text-[11px] text-blue-700 font-bold bg-blue-100 px-2 py-0.5 rounded-full">
                  อบแห้งสนิท
                </span>
              </div>

              {/* Grid of Dry Sizes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {DRY_OPTIONS.map((item) => {
                  const isSelected = dryId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setDryId(item.id);
                        setExtraDrySteps(0);
                      }}
                      className={`p-3.5 sm:p-4 rounded-2xl text-left border-2 transition-all relative active:scale-[0.98] ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/80 shadow-md shadow-blue-500/10"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                          {item.name}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">{item.desc}</p>
                      <div className="mt-2 text-blue-600 font-black text-sm sm:text-base">
                        เริ่มต้น {item.basePrice} บาท (24 นาที)
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Extra Time Control */}
              <div className="mt-4 pt-3.5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    เวลาอบผ้า: <span className="text-blue-600 text-sm font-black">{calc.totalDryMinutes} นาที</span>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    (เพิ่มเวลาครั้งละ +{calc.dryOpt.addTimeMinutes} นาที / 10 บาท)
                  </span>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setExtraDrySteps(Math.max(0, extraDrySteps - 1))}
                    disabled={extraDrySteps === 0}
                    className="w-10 h-10 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 active:scale-95"
                    aria-label="ลดเวลาอบ"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3.5 py-1.5 bg-sky-50 border border-sky-200 rounded-xl text-xs sm:text-sm font-bold min-w-12 text-center text-sky-800">
                    +{extraDrySteps * calc.dryOpt.addTimeMinutes} นาที
                  </span>
                  <button
                    type="button"
                    onClick={() => setExtraDrySteps(extraDrySteps + 1)}
                    className="w-10 h-10 rounded-xl border border-blue-500 bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-700 active:scale-95"
                    aria-label="เพิ่มเวลาอบ"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3: น้ำยาซักผ้า & ปรับผ้านุ่ม */}
            <div className="bg-slate-50/90 p-4 sm:p-6 rounded-3xl border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-cyan-600 text-white font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  น้ำยาซักผ้า / ปรับผ้านุ่ม
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DETERGENT_OPTIONS.map((item) => {
                  const isSelected = detergentId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setDetergentId(item.id)}
                      className={`p-3.5 rounded-2xl text-left border-2 transition-all flex items-center justify-between active:scale-[0.98] ${
                        isSelected
                          ? "border-cyan-600 bg-cyan-50/80 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">{item.name}</div>
                        <div className="text-[11px] text-slate-500">{item.desc}</div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <span className="text-xs font-black text-cyan-800 block">
                          {item.price === 0 ? "ฟรี" : `+${item.price}฿`}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-cyan-600 ml-auto mt-0.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: จุดรับ-ส่งในบ้านฟ้าปิยรมณ์ (เฟส 1-17 & ซอย & บ้านเลขที่) */}
            <div className="bg-slate-50/90 p-4 sm:p-6 rounded-3xl border border-slate-200">
              <div className="flex items-center gap-2 mb-3.5">
                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  4
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                    ที่อยู่รับ-ส่งในบ้านฟ้าปิยรมณ์
                  </h3>
                  <p className="text-[11px] text-slate-500">ค่าบริการ 50 บาททุกเฟส 1 - 17</p>
                </div>
              </div>

              <div className="space-y-3.5">
                {/* Phase Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    เลือกเฟส (เฟส 1 - 17): <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={phase}
                    onChange={(e) => setPhase(e.target.value)}
                    className="w-full h-12 px-4 rounded-2xl border border-slate-300 bg-white text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 text-base"
                  >
                    {PHASES.map((p) => (
                      <option key={p} value={p}>
                        {p} (บ้านฟ้าปิยรมณ์)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Soi input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ซอย: <span className="text-slate-400 font-normal">(เช่น ซอย 5, ซอย 12/2)</span>
                  </label>
                  <input
                    type="text"
                    value={soi}
                    onChange={(e) => setSoi(e.target.value)}
                    placeholder="ระบุเลขซอย"
                    className="w-full h-12 px-4 rounded-2xl border border-slate-300 bg-white text-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* House No. & details */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    เพิ่มเติม (บ้านเลขที่ / จุดสังเกต): <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addressDetails}
                    onChange={(e) => setAddressDetails(e.target.value)}
                    placeholder="เช่น 123/45 ประตูรั้วสีดำ ข้างป้อมยาม"
                    className="w-full h-12 px-4 rounded-2xl border border-slate-300 bg-white text-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* Customer Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ชื่อ / ชื่อเล่น:
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="เช่น คุณกอล์ฟ"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-sky-500"
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
                      placeholder="08X-XXX-XXXX"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    หมายเหตุเพิ่มเติม (ถ้ามี):
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="เช่น วางถุงผ้าไว้หน้าบ้าน 09:30 น."
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary Box: 5 cols (Desktop Sticky Card) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-gradient-to-b from-sky-50 via-white to-blue-50/60 p-5 sm:p-7 rounded-3xl border-2 border-sky-200 shadow-xl shadow-sky-500/10">
              <div className="flex items-center justify-between pb-3.5 border-b border-sky-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🧾</span>
                  <h3 className="font-black text-slate-900 text-base sm:text-lg">สรุปยอดบิล ซัก+อบ</h3>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  พร้อมรับออเดอร์
                </span>
              </div>

              {/* Order Breakdown */}
              <div className="py-3.5 space-y-2.5 text-xs sm:text-sm border-b border-sky-100">
                <div className="flex justify-between items-center text-slate-700">
                  <span>
                    ค่าซักผ้า ({calc.washOpt.name})
                    <span className="text-[11px] text-slate-500 block">
                      น้ำ: {waterTemp === "cold" ? "น้ำเย็น" : waterTemp === "warm" ? "น้ำอุ่น" : "น้ำร้อน"}
                    </span>
                  </span>
                  <span className="font-bold text-slate-900">{calc.washPrice} ฿</span>
                </div>

                <div className="flex justify-between items-center text-slate-700">
                  <span>
                    ค่าอบแห้ง ({calc.dryOpt.name})
                    <span className="text-[11px] text-slate-500 block">
                      เวลาอบ: {calc.totalDryMinutes} นาที
                    </span>
                  </span>
                  <span className="font-bold text-slate-900">{calc.dryPrice} ฿</span>
                </div>

                <div className="flex justify-between items-center text-slate-700">
                  <span>น้ำยา ({calc.detergentOpt.name})</span>
                  <span className="font-bold text-slate-900">
                    {calc.detergentPrice === 0 ? "ฟรี" : `${calc.detergentPrice} ฿`}
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-700">
                  <div>
                    <span>ค่าบริการดูแล & รับ-ส่ง ({phase})</span>
                    <span className="text-[11px] text-sky-600 font-semibold block">50 บาท ทุกเฟสในโครงการ</span>
                  </div>
                  <span className="font-bold text-sky-700">{calc.serviceFee} ฿</span>
                </div>
              </div>

              {/* Total Price Display */}
              <div className="py-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">
                    ยอดชำระสุทธิ (รวมค่าบริการ)
                  </span>
                  <span className="text-xs text-slate-500">ซัก+อบ แห้งสนิท 100%</span>
                </div>
                <div className="text-right">
                  <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                    {calc.total}
                  </span>
                  <span className="text-sm font-bold text-slate-700 ml-1">บาท</span>
                </div>
              </div>

              {/* Location Snippet */}
              <div className="p-3 rounded-2xl bg-white/90 border border-sky-100 text-xs text-slate-600 mb-4 space-y-0.5">
                <div className="flex items-center gap-1 font-bold text-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-sky-500" />
                  <span>บ้านฟ้าปิยรมณ์ {phase} {soi ? `ซอย ${soi}` : ""}</span>
                </div>
                <p className="pl-4 text-slate-500 truncate text-[11px]">
                  {addressDetails || "ยังไม่ได้กรอกบ้านเลขที่"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleOpenPaymentFlow}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white font-black text-sm sm:text-base shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>ดำเนินการชำระเงิน (QR หรือ เงินสด)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleCopyLine}
                  className="w-full py-3 px-4 rounded-2xl bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "คัดลอกข้อความสำเร็จ! 📋✨" : "คัดลอกสรุปบิลส่งเข้า LINE ร้าน"}</span>
                </button>

                <a
                  href="https://line.me/R/ti/p/@250mxrfh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>💬</span>
                  <span>เปิดห้องแชท LINE ร้าน (@250mxrfh)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📱 Sticky Mobile Bottom Summary Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-slate-500">ยอดรวม:</span>
            <span className="text-2xl font-black text-sky-600">{calc.total}</span>
            <span className="text-xs font-bold text-slate-700">฿</span>
          </div>
          <span className="text-[10px] text-slate-500 block truncate max-w-[140px]">
            ซัก+อบ รวมค่าบริการ 50.-
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLine}
            className="w-10 h-11 rounded-xl bg-[#06C755] text-white flex items-center justify-center shadow-sm active:scale-95"
            aria-label="คัดลอกส่ง LINE"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={handleOpenPaymentFlow}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-xs shadow-md shadow-sky-500/25 active:scale-95 flex items-center gap-1.5"
          >
            <span>ชำระเงิน</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terms & Payment Method Modal */}
      <SukpaTermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        totalAmount={calc.total}
        onConfirmOrder={handleConfirmedFromModal}
      />
    </section>
  );
}
