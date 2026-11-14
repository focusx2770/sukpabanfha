"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  CheckCircle2,
  X,
  CreditCard,
  Banknote,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onConfirmOrder: (paymentMethod: "promptpay" | "cash_pickup" | "cash_delivery") => void;
}

export default function SukpaTermsModal({
  isOpen,
  onClose,
  totalAmount,
  onConfirmOrder,
}: TermsModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [paymentType, setPaymentType] = useState<"promptpay" | "cash">("promptpay");
  const [cashTiming, setCashTiming] = useState<"pickup" | "delivery">("pickup");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!agreed) {
      alert("กรุณาอ่านและติ๊กยอมรับกฎระเบียบและเงื่อนไขก่อนดำเนินการครับ");
      return;
    }
    const finalMethod =
      paymentType === "promptpay"
        ? "promptpay"
        : cashTiming === "pickup"
        ? "cash_pickup"
        : "cash_delivery";

    onConfirmOrder(finalMethod);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg">
              📜
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg">กฎระเบียบ & วิธียืนยันชำระเงิน</h3>
              <p className="text-[11px] text-sky-100 font-medium">โปรดตรวจสอบก่อนเริ่มงาน</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-700 text-xs sm:text-sm">
          {/* Rules Box */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-2.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs sm:text-sm">
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>เงื่อนไขและข้อจำกัดความรับผิดชอบของร้าน:</span>
            </div>

            <ul className="space-y-2 text-[11px] sm:text-xs text-amber-900 leading-relaxed pl-1">
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-amber-700 flex-shrink-0">•</span>
                <span>
                  <strong>สิ่งของตกค้างในกระเป๋า:</strong> ลูกค้าต้องตรวจสอบและนำเงิน เหรียญ กุญแจ ลิปสติก ทิชชู่ หูฟัง ออกจากกระเป๋าทั้งหมด หากตกหล่นหรือละลายเปื้อนผ้า ทางร้านไม่สามารถรับผิดชอบได้
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-amber-700 flex-shrink-0">•</span>
                <span>
                  <strong>ผ้าสีตก / ผ้าบอบบาง:</strong> ลูกค้าต้องแจ้งและแยกถุงผ้าสีตกหรือผ้าที่ต้องระวังเป็นพิเศษ หากไม่แจ้งแล้วเกิดสีตกใส่กัน ทางร้านขอสงวนสิทธิ์ไม่รับผิดชอบ
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-amber-700 flex-shrink-0">•</span>
                <span>
                  <strong>การหดตัวของผ้าจากการอบ:</strong> ผ้าบางชนิดอาจหดตัวตามธรรมชาติจากความร้อนของเครื่องอบมาตรฐาน โปรดตรวจเช็คป้ายสัญลักษณ์ซัก-อบบนเสื้อผ้าก่อนส่ง
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-amber-700 flex-shrink-0">•</span>
                <span>
                  <strong>สภาพผ้าเดิม:</strong> เสื้อผ้าที่มีรอยขาด กระดุมหลุด หรือคราบฝังแน่นมาก่อนหน้า ทางร้านไม่สามารถรับผิดชอบความเสียหายเดิมได้
                </span>
              </li>
            </ul>
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              เลือกวิธีชำระเงิน (ยอดรวม: <span className="text-sky-600 font-black text-sm">{totalAmount} บาท</span>):
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Option 1: QR PromptPay */}
              <button
                type="button"
                onClick={() => setPaymentType("promptpay")}
                className={`p-3 rounded-2xl border-2 text-left transition-all flex flex-col justify-between active:scale-[0.98] ${
                  paymentType === "promptpay"
                    ? "border-sky-500 bg-sky-50 text-sky-950 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg">📱</span>
                  {paymentType === "promptpay" && (
                    <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  )}
                </div>
                <div className="font-bold text-xs sm:text-sm">สแกนจ่าย QR</div>
                <span className="text-[10px] text-slate-500">พร้อมเพย์ / แนบสลิป</span>
              </button>

              {/* Option 2: Cash */}
              <button
                type="button"
                onClick={() => setPaymentType("cash")}
                className={`p-3 rounded-2xl border-2 text-left transition-all flex flex-col justify-between active:scale-[0.98] ${
                  paymentType === "cash"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-950 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg">💵</span>
                  {paymentType === "cash" && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <div className="font-bold text-xs sm:text-sm">ชำระด้วยเงินสด</div>
                <span className="text-[10px] text-slate-500">จ่ายตอนรับ/ส่งผ้า</span>
              </button>
            </div>

            {/* Cash Sub-options */}
            {paymentType === "cash" && (
              <div className="mt-3 p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2 animate-fadeIn">
                <span className="text-xs font-bold text-emerald-900 block">
                  เลือกช่วงเวลาจ่ายเงินสด:
                </span>
                <div className="space-y-1.5 pl-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                    <input
                      type="radio"
                      name="cash_timing"
                      checked={cashTiming === "pickup"}
                      onChange={() => setCashTiming("pickup")}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>จ่ายตอนเริ่มงาน (ตอนไรเดอร์เข้ารับผ้าที่บ้าน)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                    <input
                      type="radio"
                      name="cash_timing"
                      checked={cashTiming === "delivery"}
                      onChange={() => setCashTiming("delivery")}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>จ่ายหลังเลิกงาน (ตอนไรเดอร์นำส่งผ้าคืนถึงบ้าน)</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Mandatory Agreement Checkbox */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 rounded text-sky-600 focus:ring-sky-500 mt-0.5 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-800 leading-snug">
                ข้าพเจ้าได้อ่าน เข้าใจ และยอมรับกฎกติกาและเงื่อนไขการใช้บริการของร้าน ซักป่ะ? เรียบร้อยแล้ว <span className="text-rose-500">*</span>
              </span>
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <div className="text-left w-full sm:w-auto">
            <span className="text-[11px] text-slate-400 block">ยอดรวมทั้งสิ้น</span>
            <span className="text-xl font-black text-sky-600">{totalAmount} บาท</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-semibold w-1/3 sm:w-auto"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!agreed}
              className="py-3 px-5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-500/25 flex-1 sm:flex-initial flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>
                {paymentType === "promptpay" ? "ไปหน้าสแกน QR" : "ยืนยันสั่งซัก (จ่ายเงินสด)"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
