"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SukpaNavbar from "@/components/SukpaNavbar";
import SukpaFooter from "@/components/SukpaFooter";
import SukpaFloatingLine from "@/components/SukpaFloatingLine";
import { getCustomerPoints, SukpaCustomer } from "@/lib/sukpaDb";
import {
  Gift,
  Search,
  Sparkles,
  Phone,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  MapPin,
  MessageCircle,
} from "lucide-react";

function PointsContent() {
  const searchParams = useSearchParams();
  const phoneParam = searchParams.get("phone") || "";

  const [phoneInput, setPhoneInput] = useState<string>(phoneParam);
  const [customer, setCustomer] = useState<SukpaCustomer | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (phoneParam) {
      handleSearch(phoneParam);
    }
  }, [phoneParam]);

  const handleSearch = async (phoneToSearch?: string) => {
    const target = phoneToSearch || phoneInput;
    const clean = target.replace(/[^0-9]/g, "");
    if (!clean) return;

    setLoading(true);
    setHasSearched(true);
    const result = await getCustomerPoints(clean);
    setCustomer(result);
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const stamps = customer?.stamps || 0;
  const freeRemaining = customer?.free_rewards_remaining || 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <SukpaNavbar />

      <main className="flex-1 pt-24 pb-16 sm:pt-28 sm:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
              <Gift className="w-4 h-4 text-emerald-600" />
              <span>โปรโมชั่นชาวบ้านฟ้าปิยรมณ์</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              เช็คแต้มสะสม ซัก 10 ฟรี 1
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1.5">
              เพียงกรอกเบอร์โทรศัพท์ ตรวจสอบแต้มสะสมและสิทธิ์ซักฟรีได้ทันที
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-8">
            <div className="relative flex items-center shadow-lg shadow-emerald-500/5 rounded-2xl bg-white border-2 border-emerald-300 p-1.5">
              <Phone className="w-5 h-5 text-emerald-500 ml-3 flex-shrink-0" />
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="กรอกเบอร์โทรศัพท์ (เช่น 0812345678)"
                className="w-full px-3 py-2.5 text-base text-slate-800 bg-transparent focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex-shrink-0 cursor-pointer disabled:opacity-50"
              >
                {loading ? "กำลังค้นหา..." : "เช็คแต้ม"}
              </button>
            </div>
          </form>

          {/* Results Display */}
          {hasSearched && !customer ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-3xl">
                🔎
              </div>
              <h3 className="font-bold text-slate-800 text-lg">ยังไม่พบประวัติแต้มสะสม</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                เบอร์นี้อาจยังไม่เคยใช้บริการกับ ซักป่ะ? สามารถเริ่มสั่งซักครั้งแรกเพื่อเริ่มสะสมแต้ม 10 ฟรี 1 ได้ทันทีครับ!
              </p>
              <Link
                href="/#calculator"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-semibold text-xs mt-2"
              >
                <span>สั่งซักครั้งแรกเพื่อเริ่มสะสมแต้ม</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : customer ? (
            <div className="space-y-6">
              {/* Digital Stamp Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-xl shadow-emerald-500/10 relative overflow-hidden">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      สมาชิกคนพิเศษบ้านฟ้าปิยรมณ์
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                      {customer.name || "ลูกค้าประจำ"} ({customer.phone})
                    </h2>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-sky-500" />
                      <span>{customer.phase} {customer.soi ? `ซอย ${customer.soi}` : ""} {customer.address_details}</span>
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block">ประวัติซักรวมทั้งหมด</span>
                    <span className="text-2xl font-black text-emerald-700">
                      {customer.total_washes} <span className="text-xs font-normal text-slate-500">ครั้ง</span>
                    </span>
                  </div>
                </div>

                {/* Free Reward Banner (If has reward) */}
                {freeRemaining > 0 && (
                  <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg shadow-orange-500/20 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
                        🎁
                      </div>
                      <div>
                        <h4 className="font-black text-base">ยินดีด้วย! คุณมีสิทธิ์ซัก+อบ ฟรี {freeRemaining} ครั้ง</h4>
                        <p className="text-xs text-orange-100">สามารถใช้สิทธิ์นี้ได้ทันทีในการสั่งซักครั้งต่อไป</p>
                      </div>
                    </div>
                    <Link
                      href="/#calculator"
                      className="px-4 py-2 rounded-xl bg-white text-orange-600 font-bold text-xs hover:bg-orange-50 transition-colors self-start sm:self-auto flex-shrink-0"
                    >
                      ใช้สิทธิ์ฟรีทันที ↗
                    </Link>
                  </div>
                )}

                {/* 10 Stamp Slots Visual */}
                <div className="py-6 sm:py-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-800">
                      ความคืบหน้า: สะสมแล้ว <span className="text-emerald-600 text-sm font-black">{stamps}/10</span> ครั้ง
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      ขาดอีก <span className="text-orange-500 font-bold">{10 - stamps}</span> ครั้งรับฟรี 1 ครั้ง!
                    </span>
                  </div>

                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-3">
                    {Array.from({ length: 9 }).map((_, idx) => {
                      const isStamped = idx < stamps;
                      return (
                        <div
                          key={idx}
                          className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 text-center transition-all ${
                            isStamped
                              ? "bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20 scale-105"
                              : "bg-slate-50 border-2 border-dashed border-slate-200 text-slate-400"
                          }`}
                        >
                          <span className="text-lg sm:text-xl">{isStamped ? "🫧" : idx + 1}</span>
                          <span className="text-[10px] font-bold mt-0.5">
                            {isStamped ? "สำเร็จ" : `ดวงที่ ${idx + 1}`}
                          </span>
                        </div>
                      );
                    })}

                    {/* 10th Slot */}
                    <div
                      className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 text-center transition-all ${
                        stamps === 10
                          ? "bg-gradient-to-tr from-amber-400 to-orange-500 text-white shadow-md shadow-orange-500/30 scale-105 animate-bounce"
                          : "bg-amber-50/80 border-2 border-dashed border-amber-300 text-amber-800"
                      }`}
                    >
                      <span className="text-lg sm:text-xl">🎁</span>
                      <span className="text-[10px] font-black uppercase">ฟรี 1 คิว!</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>แต้มจะเพิ่มอัตโนมัติเมื่อไรเดอร์จัดส่งผ้าสำเร็จเรียบร้อย</span>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link
                      href="/#calculator"
                      className="flex-1 sm:flex-initial text-center py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-xs shadow-sm hover:scale-105 active:scale-95 transition-all"
                    >
                      สั่งซักสะสมแต้มเพิ่ม
                    </Link>
                    <a
                      href="https://line.me/R/ti/p/@250mxrfh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial text-center py-2.5 px-4 rounded-xl bg-[#06C755] text-white font-bold text-xs shadow-sm hover:scale-105 active:scale-95 transition-all"
                    >
                      ทัก LINE ร้าน
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>

      <SukpaFooter />
      <SukpaFloatingLine />
    </div>
  );
}

export default function PointsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">กำลังโหลด...</div>}>
      <PointsContent />
    </Suspense>
  );
}
