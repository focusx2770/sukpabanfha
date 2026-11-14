"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SukpaNavbar from "@/components/SukpaNavbar";
import SukpaFooter from "@/components/SukpaFooter";
import { getAllOrders } from "@/lib/sukpaDb";
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Waves,
  Sun,
  MapPin,
  Phone,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

const STAGES = [
  { id: "pending", label: "รับออเดอร์แล้ว", desc: "รอไรเดอร์เข้ารับผ้าตามนัด", icon: "📋" },
  { id: "picked_up", label: "เข้ารับผ้าแล้ว", desc: "ผ้าถึงร้าน แยกถังเดี่ยวพร้อมซัก", icon: "🛵" },
  { id: "washing", label: "กำลังซักผ้า", desc: "ซักสะอาด แยกถัง 1 คิว 1 เครื่อง 100%", icon: "🧼" },
  { id: "drying", label: "กำลังอบผ้า", desc: "อบแห้งสนิท ไม่ง้อแดด หอมฟุ้ง", icon: "💨" },
  { id: "delivering", label: "กำลังนำส่งคืน", desc: "ไรเดอร์กำลังมุ่งหน้าไปส่งถึงหน้าบ้าน", icon: "🚚" },
  { id: "completed", label: "ส่งเรียบร้อยแล้ว", desc: "ส่งมอบผ้าหอมสะอาดถึงมือคุณ", icon: "🎉" },
];

function TrackContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [query, setQuery] = useState<string>(initialSearch);
  const [searchedOrder, setSearchedOrder] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [allOrders, setAllOrders] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const orders = await getAllOrders();
      setAllOrders(orders);

      if (initialSearch) {
        doSearch(initialSearch, orders);
      } else if (orders.length > 0) {
        setSearchedOrder(orders[0]);
        setHasSearched(true);
      }
    }
    loadData();
  }, [initialSearch]);

  const doSearch = (term: string, list = allOrders) => {
    const clean = term.trim().toLowerCase();
    if (!clean) return;

    const found = list.find(
      (o: any) =>
        (o.orderId && o.orderId.toLowerCase().includes(clean)) ||
        (o.phone && o.phone.replace(/[^0-9]/g, "").includes(clean.replace(/[^0-9]/g, "")))
    );

    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(query);
  };

  // Determine stage index
  const getStageIndex = (status: string) => {
    switch (status) {
      case "pending":
      case "pending_payment":
      case "cash_pending":
        return 0;
      case "slip_uploaded":
      case "picked_up":
        return 1;
      case "washing":
        return 2;
      case "drying":
        return 3;
      case "delivering":
        return 4;
      case "completed":
        return 5;
      default:
        return 0;
    }
  };

  const currentStageIndex = searchedOrder ? getStageIndex(searchedOrder.status) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SukpaNavbar />

      <main className="flex-1 pt-24 pb-16 sm:pt-28 sm:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold mb-3">
              <Truck className="w-4 h-4 text-sky-600" />
              <span>ติดตามสถานะผ้า Real-Time</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              เช็คสถานะผ้า ซักป่ะ?
            </h1>
            <p className="text-slate-600 text-sm mt-1.5">
              ค้นหาด้วยเบอร์โทรศัพท์ หรือรหัสคำสั่งซื้อ (Order ID)
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto mb-10">
            <div className="relative flex items-center shadow-lg shadow-sky-500/5 rounded-2xl bg-white border-2 border-sky-200 p-1.5">
              <Search className="w-5 h-5 text-slate-400 ml-3 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="กรอกเบอร์โทร หรือ Order ID (เช่น 0891234567)"
                className="w-full px-3 py-2.5 text-sm sm:text-base text-slate-800 bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex-shrink-0 cursor-pointer"
              >
                ค้นหา
              </button>
            </div>
          </form>

          {/* Result Display */}
          {hasSearched && !searchedOrder ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-3xl">
                🔎
              </div>
              <h3 className="font-bold text-slate-800 text-lg">ไม่พบข้อมูลคำสั่งซื้อ</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                กรุณาตรวจสอบเบอร์โทรศัพท์ หรือเลขคำสั่งซื้ออีกครั้ง หรือสอบถามเจ้าหน้าที่ทาง LINE ได้เลยครับ
              </p>
              <Link
                href="/#calculator"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 text-white font-semibold text-xs mt-2"
              >
                <span>สั่งซักใหม่ทันที</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : searchedOrder ? (
            <div className="space-y-6">
              {/* Order Status Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xl shadow-sky-500/5">
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-mono font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
                      {searchedOrder.orderId || "SP-SAMPLE"}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                      สถานะ: {STAGES[currentStageIndex]?.label}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {STAGES[currentStageIndex]?.desc}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block">ยอดชำระสุทธิ</span>
                    <span className="text-2xl font-black text-slate-900">
                      {searchedOrder.total || 0} บาท
                    </span>
                    {searchedOrder.paymentMethod && (
                      <span className="text-[11px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full block mt-1">
                        {searchedOrder.paymentMethod === "promptpay"
                          ? "📱 สแกน QR พร้อมเพย์"
                          : searchedOrder.paymentMethod === "cash_pickup"
                          ? "💵 เงินสด (จ่ายตอนรับผ้า)"
                          : "💵 เงินสด (จ่ายตอนส่งผ้าคืน)"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Visual Timeline Stepper (Responsive Mobile Scroll) */}
                <div className="py-6 sm:py-8 overflow-x-auto">
                  <div className="relative min-w-[460px] sm:min-w-0 px-2">
                    {/* Connecting Bar */}
                    <div className="absolute top-5 left-4 right-4 sm:left-6 sm:right-6 h-1 bg-slate-200 -z-0" />
                    <div
                      className="absolute top-5 left-4 sm:left-6 h-1 bg-gradient-to-r from-sky-500 to-blue-600 -z-0 transition-all duration-700"
                      style={{
                        width: `${(currentStageIndex / (STAGES.length - 1)) * 90}%`,
                      }}
                    />

                    {/* Stage Nodes */}
                    <div className="grid grid-cols-6 relative z-10 text-center gap-1">
                      {STAGES.map((st, idx) => {
                        const isDone = idx < currentStageIndex;
                        const isCurrent = idx === currentStageIndex;

                        return (
                          <div key={st.id} className="flex flex-col items-center">
                            <div
                              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-sm sm:text-lg transition-all shadow-sm ${
                                isCurrent
                                  ? "bg-gradient-to-tr from-sky-500 to-blue-600 text-white ring-4 ring-sky-200 scale-110 font-bold"
                                  : isDone
                                  ? "bg-emerald-500 text-white font-bold"
                                  : "bg-white border-2 border-slate-300 text-slate-400"
                              }`}
                            >
                              {isDone ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : st.icon}
                            </div>
                            <span
                              className={`text-[10px] sm:text-xs mt-2 font-bold line-clamp-1 ${
                                isCurrent
                                  ? "text-sky-600 font-extrabold"
                                  : isDone
                                  ? "text-emerald-700"
                                  : "text-slate-400"
                              }`}
                            >
                              {st.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Order Breakdown Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <span className="font-bold text-slate-800 text-sm block">🧺 รายละเอียดผ้า</span>
                    <div className="flex justify-between text-slate-600">
                      <span>บริการซัก:</span>
                      <span className="font-semibold text-slate-800">
                        {searchedOrder.washName || "เครื่องซักผ้ามาตรฐาน"}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>บริการอบ:</span>
                      <span className="font-semibold text-slate-800">
                        {searchedOrder.dryName || "เครื่องอบผ้า 15 kg"} ({searchedOrder.totalDryMinutes || 24} นาที)
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>การแยกถัง:</span>
                      <span className="font-semibold text-emerald-600">แยก 1 คิว 1 เครื่อง 100%</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <span className="font-bold text-slate-800 text-sm block">🏡 ที่อยู่จัดส่ง</span>
                    <div className="flex justify-between text-slate-600">
                      <span>จุดส่ง:</span>
                      <span className="font-semibold text-slate-800">
                        บ้านฟ้าปิยรมณ์ {searchedOrder.phase || "เฟส 1"} {searchedOrder.soi ? `ซอย ${searchedOrder.soi}` : ""}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>รายละเอียด:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[180px]">
                        {searchedOrder.addressDetails || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>ผู้ติดต่อ:</span>
                      <span className="font-semibold text-slate-800">
                        {searchedOrder.name || "-"} ({searchedOrder.phone || "-"})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Loyalty 10 Free 1 Card in Tracking */}
                <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🎁</span>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">
                          บัตรสะสมแต้มดิจิทัล: ซักครบ 10 ฟรี 1!
                        </h4>
                        <p className="text-[11px] text-emerald-700">
                          ผูกกับเบอร์โทร {searchedOrder.phone || "-"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-800 bg-white px-2.5 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
                      สะสมแล้ว 1/10 ครั้ง
                    </span>
                  </div>

                  {/* Stamp circles */}
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 pt-1">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className={`aspect-square rounded-xl flex flex-col items-center justify-center text-center text-xs font-bold transition-all ${
                          i === 0
                            ? "bg-emerald-500 text-white shadow-xs scale-105"
                            : "bg-white/80 border border-emerald-200 text-slate-400"
                        }`}
                      >
                        <span>{i === 0 ? "🫧" : i + 1}</span>
                      </div>
                    ))}
                    <div className="aspect-square rounded-xl bg-amber-400 text-white flex flex-col items-center justify-center text-center text-[10px] font-black shadow-xs">
                      <span>🎁</span>
                      <span>ฟรี</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 text-center">
                    ซักอีก 9 ครั้ง รับสิทธิ์ซัก+อบแห้งฟรี 1 ครั้งทันที!
                  </p>
                </div>

                {/* Footer status notice & LINE OA Link */}
                <div className="mt-6 p-3.5 rounded-2xl bg-sky-50 border border-sky-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-sky-800">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    <span>หากต้องการแจ้งเลื่อนเวลา หรือส่งรูปพิกัดบ้าน ทักหาแอดมินได้เลยครับ</span>
                  </span>
                  <a
                    href="https://line.me/R/ti/p/@250mxrfh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-xs shadow-xs transition-transform active:scale-95 flex-shrink-0"
                  >
                    <span>💬</span>
                    <span>LINE @250mxrfh</span>
                  </a>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>

      <SukpaFooter />
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">กำลังโหลด...</div>}>
      <TrackContent />
    </Suspense>
  );
}
