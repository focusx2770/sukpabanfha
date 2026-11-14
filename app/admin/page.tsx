"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Lock,
  Unlock,
  Truck,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  Search,
  Filter,
  Eye,
  Trash2,
  DollarSign,
  Package,
  Sparkles,
  ArrowRight,
  X,
  CreditCard,
  Banknote,
  LogOut,
  RefreshCw,
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar,
  Wallet,
  Users,
} from "lucide-react";
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  saveOrder,
  addStampToCustomer,
  getCustomerPoints,
  redeemFreeReward,
  saveCustomer,
} from "@/lib/sukpaDb";

interface SukpaOrder {
  orderId: string;
  name: string;
  phone: string;
  phase: string;
  soi: string;
  addressDetails: string;
  washName: string;
  waterTemp: string;
  dryName: string;
  totalDryMinutes: number;
  detergentPrice: number;
  serviceFee: number;
  total: number;
  paymentMethod: "promptpay" | "cash_pickup" | "cash_delivery";
  status: "pending" | "pending_payment" | "cash_pending" | "slip_uploaded" | "picked_up" | "washing" | "drying" | "delivering" | "completed";
  slipPreview?: string;
  createdAt: string;
  notes?: string;
}

const STATUS_CONFIG: {
  [key: string]: { label: string; bg: string; text: string; icon: string };
} = {
  pending: { label: "รอเข้ารับผ้า", bg: "bg-amber-100", text: "text-amber-800", icon: "📋" },
  pending_payment: { label: "รอชำระพร้อมเพย์", bg: "bg-orange-100", text: "text-orange-800", icon: "💳" },
  cash_pending: { label: "รอเก็บเงินสด", bg: "bg-emerald-100", text: "text-emerald-800", icon: "💵" },
  slip_uploaded: { label: "แนบสลิปแล้ว (รอตรวจ)", bg: "bg-blue-100", text: "text-blue-800", icon: "📸" },
  picked_up: { label: "เข้ารับผ้าแล้ว", bg: "bg-sky-100", text: "text-sky-800", icon: "🛵" },
  washing: { label: "กำลังซักผ้า", bg: "bg-cyan-100", text: "text-cyan-800", icon: "🧼" },
  drying: { label: "กำลังอบผ้า", bg: "bg-indigo-100", text: "text-indigo-800", icon: "💨" },
  delivering: { label: "กำลังนำส่งคืน", bg: "bg-purple-100", text: "text-purple-800", icon: "🚚" },
  completed: { label: "จัดส่งสำเร็จ", bg: "bg-emerald-100", text: "text-emerald-800", icon: "🎉" },
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pin, setPin] = useState<string>("");
  const [pinError, setPinError] = useState<string>("");

  const [orders, setOrders] = useState<SukpaOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPhase, setFilterPhase] = useState<string>("all");

  const [viewingSlip, setViewingSlip] = useState<string | null>(null);

  // Quick Order Modal from LINE
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState<boolean>(false);
  const [quickPhone, setQuickPhone] = useState<string>("");
  const [quickName, setQuickName] = useState<string>("");
  const [quickPhase, setQuickPhase] = useState<string>("เฟส 1");
  const [quickSoi, setQuickSoi] = useState<string>("");
  const [quickAddress, setQuickAddress] = useState<string>("");
  const [quickWash, setQuickWash] = useState<string>("เครื่องซัก 9 kg");
  const [quickDry, setQuickDry] = useState<string>("เครื่องอบ 15 kg (24 นาที)");
  const [quickTotal, setQuickTotal] = useState<number>(140);
  const [quickPayMethod, setQuickPayMethod] = useState<"promptpay" | "cash_pickup" | "cash_delivery">("promptpay");
  const [quickNotes, setQuickNotes] = useState<string>("สั่งผ่าน LINE OA");

  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(false);

  // Check login session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = sessionStorage.getItem("sukpa_admin_auth");
      if (auth === "true") {
        setIsAuthenticated(true);
      }
      loadOrders();
    }
  }, []);

  const loadOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const liveOrders = await getAllOrders();
      setOrders(liveOrders as any);
    } catch (e) {
      console.error("Failed to load orders:", e);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // PIN Admin: 141069
    if (pin === "141069" || pin === "0661323388") {
      setIsAuthenticated(true);
      sessionStorage.setItem("sukpa_admin_auth", "true");
      setPinError("");
      loadOrders();
    } else {
      setPinError("รหัสผ่านไม่ถูกต้อง (PIN 6 หลัก)");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("sukpa_admin_auth");
  };

  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "loyalty">("dashboard");
  const [revenueTimeRange, setRevenueTimeRange] = useState<"all" | "today" | "week" | "month">("all");
  const [loyaltySearch, setLoyaltySearch] = useState<string>("");
  const [loyaltyCustomer, setLoyaltyCustomer] = useState<any>(null);
  const [loyaltyMsg, setLoyaltyMsg] = useState<string>("");

  // Update order status & automatically award stamp if completed
  const handleUpdateStatus = async (orderId: string, newStatus: any) => {
    const updated = orders.map((o) => {
      if (o.orderId === orderId) {
        // If changing to completed, add 1 stamp to customer
        if (newStatus === "completed" && o.status !== "completed" && o.phone) {
          addStampToCustomer(o.phone, 1);
        }
        return { ...o, status: newStatus };
      }
      return o;
    });
    setOrders(updated);
    await updateOrderStatus(orderId, newStatus);
  };

  const handleSearchLoyalty = async (phoneToFind?: string) => {
    const query = phoneToFind || loyaltySearch;
    const clean = query.replace(/[^0-9]/g, "");
    if (!clean) return;

    const found = await getCustomerPoints(clean);
    setLoyaltyCustomer(found);
  };

  const handleAdminAdjustStamp = async (amount: number) => {
    if (!loyaltyCustomer) return;
    const updated = await addStampToCustomer(loyaltyCustomer.phone, amount);
    setLoyaltyCustomer(updated);
    setLoyaltyMsg(`อัปเดตแต้มของ ${loyaltyCustomer.phone} เรียบร้อยแล้ว`);
    setTimeout(() => setLoyaltyMsg(""), 3000);
  };

  const handleAdminRedeemFree = async () => {
    if (!loyaltyCustomer) return;
    const updated = await redeemFreeReward(loyaltyCustomer.phone);
    if (updated) {
      setLoyaltyCustomer(updated);
      setLoyaltyMsg(`ใช้สิทธิ์ซักฟรีของ ${loyaltyCustomer.phone} เรียบร้อย`);
    } else {
      alert("ลูกค้ารายนี้ยังไม่มีสิทธิ์ซักฟรีคงเหลือครับ");
    }
    setTimeout(() => setLoyaltyMsg(""), 3000);
  };

  // Create Quick Order from LINE
  const handleCreateQuickOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPhone) {
      alert("กรุณากรอกเบอร์โทรศัพท์ลูกค้า");
      return;
    }

    const newOrderId = `SP-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: any = {
      orderId: newOrderId,
      name: quickName || "ลูกค้า LINE",
      phone: quickPhone.replace(/[^0-9]/g, ""),
      phase: quickPhase,
      soi: quickSoi,
      addressDetails: quickAddress,
      washName: quickWash,
      waterTemp: "cold",
      dryName: quickDry,
      totalDryMinutes: 24,
      detergentPrice: 0,
      serviceFee: 50,
      total: Number(quickTotal) || 140,
      paymentMethod: quickPayMethod,
      status: quickPayMethod === "promptpay" ? "slip_uploaded" : "cash_pending",
      createdAt: new Date().toISOString(),
      notes: quickNotes,
    };

    setOrders([newOrder, ...orders]);

    // บันทึกลง Supabase Database ทันที
    await saveOrder(newOrder);
    await addStampToCustomer(newOrder.phone, 1);

    // ยิงเข้า Discord Webhook ทันที
    fetch("/api/notify-discord", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: newOrder, type: "new_order" }),
    }).catch((err) => console.warn("Discord notify error:", err));

    alert(`สร้างออเดอร์ ${newOrderId} และบันทึกลงระบบสำเร็จแล้ว!`);
    setIsQuickOrderOpen(false);
    // reset form
    setQuickPhone("");
    setQuickName("");
    setQuickAddress("");
    setQuickSoi("");
  };

  // Delete order
  const handleDeleteOrder = async (orderId: string) => {
    if (confirm(`คุณต้องการลบออเดอร์ ${orderId} ใช่หรือไม่?`)) {
      const updated = orders.filter((o) => o.orderId !== orderId);
      setOrders(updated);
      await deleteOrder(orderId);
    }
  };

  // แชร์งานรับ-ส่งผ้าให้คนขับ/ไรเดอร์ ผ่าน LINE
  const handleShareToRiderLine = (order: SukpaOrder) => {
    const isPromptPay = order.paymentMethod === "promptpay";
    const payText = isPromptPay
      ? "ชำระผ่านพร้อมเพย์แล้ว (ตรวจสลิปแล้ว)"
      : `⚠️ คนขับต้องเก็บเงินสด ฿${order.total} บาท (${order.paymentMethod === "cash_pickup" ? "ตอนรับผ้า" : "ตอนส่งผ้า"})`;

    const text = `🛵 งานรับ-ส่งผ้า ซักป่ะ? บ้านฟ้าปิยรมณ์
━━━━━━━━━━━━━━━━━━
📋 รหัสออเดอร์: ${order.orderId}
👤 ลูกค้า: ${order.name || "ลูกค้า"}
📞 โทร: ${order.phone || "-"}
📍 พิกัด: ${order.phase} ${order.soi ? `ซอย ${order.soi}` : ""}
🏠 ที่อยู่: ${order.addressDetails || "-"}
━━━━━━━━━━━━━━━━━━
🧺 รายการผ้า:
• ซัก: ${order.washName || "เครื่องซัก"}
• อบ: ${order.dryName || "เครื่องอบ"} (${order.totalDryMinutes || 24} นาที)
💰 การชำระเงิน: ${payText}
${order.notes ? `📝 หมายเหตุ: ${order.notes}\n` : ""}━━━━━━━━━━━━━━━━━━
🔗 ลิงก์อัปเดตงาน: https://sukpa.vercel.app/track?search=${order.orderId}`;

    const lineShareUrl = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
    window.open(lineShareUrl, "_blank");
  };

  // Calculate statistics
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const activeOrdersCount = orders.filter(
    (o) => o.status !== "completed" && o.status !== "pending_payment"
  ).length;
  const completedOrdersCount = orders.filter((o) => o.status === "completed").length;

  // Time-filtered orders for revenue analysis
  const timeFilteredOrders = orders.filter((o) => {
    if (revenueTimeRange === "all") return true;
    const orderDate = new Date(o.createdAt || Date.now());
    const now = new Date();

    if (revenueTimeRange === "today") {
      return (
        orderDate.getFullYear() === now.getFullYear() &&
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getDate() === now.getDate()
      );
    }
    if (revenueTimeRange === "week") {
      const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
      return diffDays <= 7;
    }
    if (revenueTimeRange === "month") {
      const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
      return diffDays <= 30;
    }
    return true;
  });

  // Calculate detailed financial metrics
  const periodTotalRevenue = timeFilteredOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const periodPromptPayRevenue = timeFilteredOrders
    .filter((o) => o.paymentMethod === "promptpay")
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const periodCashRevenue = timeFilteredOrders
    .filter((o) => o.paymentMethod && o.paymentMethod.startsWith("cash"))
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const avgOrderTicket =
    timeFilteredOrders.length > 0
      ? Math.round(periodTotalRevenue / timeFilteredOrders.length)
      : 0;

  // Wash size breakdown
  const washCounts: { [key: string]: number } = {};
  timeFilteredOrders.forEach((o) => {
    const key = o.washName || "ไม่ระบุ";
    washCounts[key] = (washCounts[key] || 0) + 1;
  });

  // Dry size breakdown
  const dryCounts: { [key: string]: number } = {};
  timeFilteredOrders.forEach((o) => {
    const key = o.dryName || "ไม่ระบุ";
    dryCounts[key] = (dryCounts[key] || 0) + 1;
  });

  // Phase breakdown
  const phaseStats: { [key: string]: { count: number; revenue: number } } = {};
  timeFilteredOrders.forEach((o) => {
    const p = o.phase || "อื่นๆ";
    if (!phaseStats[p]) phaseStats[p] = { count: 0, revenue: 0 };
    phaseStats[p].count += 1;
    phaseStats[p].revenue += Number(o.total) || 0;
  });

  const topPhases = Object.entries(phaseStats)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 5);

  // Group by date for daily revenue table
  const dailyStats: { [key: string]: { count: number; promptpay: number; cash: number; total: number } } = {};
  timeFilteredOrders.forEach((o) => {
    const dateStr = o.createdAt ? o.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10);
    if (!dailyStats[dateStr]) {
      dailyStats[dateStr] = { count: 0, promptpay: 0, cash: 0, total: 0 };
    }
    dailyStats[dateStr].count += 1;
    const amt = Number(o.total) || 0;
    dailyStats[dateStr].total += amt;
    if (o.paymentMethod === "promptpay") {
      dailyStats[dateStr].promptpay += amt;
    } else {
      dailyStats[dateStr].cash += amt;
    }
  });

  const dailyRows = Object.entries(dailyStats)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 10);

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      searchTerm === "" ||
      (o.orderId && o.orderId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.phone && o.phone.includes(searchTerm)) ||
      (o.name && o.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.addressDetails && o.addressDetails.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    const matchPhase = filterPhase === "all" || o.phase === filterPhase;

    return matchSearch && matchStatus && matchPhase;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto text-3xl shadow-inner">
            <Lock className="w-8 h-8 text-sky-600" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-slate-900">
              เข้าสู่ระบบหลังบ้าน ซักป่ะ?
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              ระบบจัดการออเดอร์ & ติดตามผ้า บ้านฟ้าปิยรมณ์
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="กรอก PIN 6 หลัก"
                className="w-full h-12 px-4 rounded-2xl border-2 border-slate-200 focus:border-sky-500 text-center text-lg font-bold tracking-widest focus:outline-none"
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-rose-500 font-bold mt-1.5">{pinError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 active:scale-95 transition-all"
            >
              เข้าสู่แดชบอร์ด
            </button>

            <Link
              href="/"
              className="block text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              ← กลับสู่หน้าเว็บหลัก
            </Link>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-sky-50 flex-shrink-0">
              <Image
                src="/images/sukpa-logo.jpg"
                alt="ซักป่ะ? โลโก้"
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-base">ระบบหลังบ้าน ซักป่ะ?</span>
                <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">
                  Admin Panel
                </span>
              </div>
              <p className="text-[11px] text-slate-500">บ้านฟ้าปิยรมณ์ คลอง 6</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => loadOrders()}
              disabled={isLoadingOrders}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="รีเฟรชข้อมูลจากระบบ"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-sky-600 ${isLoadingOrders ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">{isLoadingOrders ? "กำลังโหลด..." : "รีเฟรชข้อมูล"}</span>
            </button>
            <Link
              href="/"
              target="_blank"
              className="text-xs text-sky-600 hover:underline font-bold hidden sm:inline"
            >
              เปิดหน้าเว็บ ↗
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 font-semibold">ยอดขายรวม</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                ฿
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {totalRevenue.toLocaleString()} <span className="text-xs font-normal text-slate-500">บาท</span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 font-semibold">ออเดอร์ทั้งหมด</span>
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                📦
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {orders.length} <span className="text-xs font-normal text-slate-500">รายการ</span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 font-semibold">กำลังดำเนินการ</span>
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
                🧼
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-sky-600">
              {activeOrdersCount} <span className="text-xs font-normal text-slate-500">คิว</span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 font-semibold">ส่งสำเร็จแล้ว</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                🎉
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">
              {completedOrdersCount} <span className="text-xs font-normal text-slate-500">คิว</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              <span>📊 แดชบอร์ดรายได้ & สถิติ</span>
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "orders"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              <span>📦 รายการออเดอร์</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">{orders.length}</span>
            </button>
            <button
              onClick={() => setActiveTab("loyalty")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "loyalty"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              <span>🎁 แต้มสะสม 10 ฟรี 1</span>
            </button>
          </div>

          {/* Quick Add Order from LINE button */}
          <button
            onClick={() => setIsQuickOrderOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all self-start sm:self-auto cursor-pointer whitespace-nowrap"
          >
            <span>💬 + บันทึกออเดอร์จาก LINE</span>
          </button>
        </div>

        {activeTab === "dashboard" ? (
          /* Revenue & Analytics Dashboard Tab */
          <div className="space-y-6 animate-fadeIn">
            {/* Time Range Selector & Header */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>📊 แดชบอร์ดวิเคราะห์ยอดรายได้</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  ภาพรวมรายรับ ช่องทางการชำระเงิน และสถิติการใช้งานบริการซักป่ะ?
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl self-start sm:self-auto text-xs font-bold">
                {[
                  { id: "all", label: "ทั้งหมด" },
                  { id: "today", label: "วันนี้" },
                  { id: "week", label: "7 วันล่าสุด" },
                  { id: "month", label: "30 วันล่าสุด" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setRevenueTimeRange(t.id as any)}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      revenueTimeRange === t.id
                        ? "bg-white text-sky-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Financial Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl p-5 text-white shadow-lg shadow-sky-500/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-sky-100 font-bold uppercase tracking-wider">รายได้รวมช่วงนี้</span>
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg">💰</div>
                </div>
                <div className="text-3xl font-black">{periodTotalRevenue.toLocaleString()} <span className="text-sm font-normal text-sky-100">บาท</span></div>
                <div className="mt-2 text-[11px] text-sky-100 flex items-center gap-1.5">
                  <span>จาก {timeFilteredOrders.length} ออเดอร์</span>
                  <span>•</span>
                  <span>เฉลี่ย ฿{avgOrderTicket}/คิว</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">โอนพร้อมเพย์ (QR)</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">📱</div>
                </div>
                <div className="text-3xl font-black text-slate-900">{periodPromptPayRevenue.toLocaleString()} <span className="text-sm font-normal text-slate-400">บาท</span></div>
                <div className="mt-2 text-[11px] text-slate-500">
                  {periodTotalRevenue > 0 ? Math.round((periodPromptPayRevenue / periodTotalRevenue) * 100) : 0}% ของรายได้ทั้งหมด
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">เก็บเงินสด (Cash)</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">💵</div>
                </div>
                <div className="text-3xl font-black text-slate-900">{periodCashRevenue.toLocaleString()} <span className="text-sm font-normal text-slate-400">บาท</span></div>
                <div className="mt-2 text-[11px] text-slate-500">
                  {periodTotalRevenue > 0 ? Math.round((periodCashRevenue / periodTotalRevenue) * 100) : 0}% ของรายได้ทั้งหมด
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">อัตราจัดส่งสำเร็จ</span>
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">🎯</div>
                </div>
                <div className="text-3xl font-black text-purple-600">
                  {timeFilteredOrders.length > 0 ? Math.round((completedOrdersCount / timeFilteredOrders.length) * 100) : 0}%
                </div>
                <div className="mt-2 text-[11px] text-slate-500">
                  ส่งสำเร็จ {completedOrdersCount} จาก {timeFilteredOrders.length} คิว
                </div>
              </div>
            </div>

            {/* Analytics Grid: Machines & Top Phases */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Popular Machines Breakdown */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <span>🫧 สถิติขนาดเครื่องซักยอดนิยม</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium">{timeFilteredOrders.length} ครั้ง</span>
                </div>

                <div className="space-y-3">
                  {Object.entries(washCounts).length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">ยังไม่มีข้อมูลในช่วงเวลานี้</p>
                  ) : (
                    Object.entries(washCounts).map(([name, count]) => {
                      const pct = Math.round((count / (timeFilteredOrders.length || 1)) * 100);
                      return (
                        <div key={name} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-700">{name}</span>
                            <span className="text-slate-500 font-bold">{count} ครั้ง ({pct}%)</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Top Phases Breakdown */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <span>🏘️ 5 อันดับเฟสที่สร้างรายได้สูงสุด</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium">บ้านฟ้าปิยรมณ์</span>
                </div>

                <div className="space-y-3">
                  {topPhases.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">ยังไม่มีข้อมูลในช่วงเวลานี้</p>
                  ) : (
                    topPhases.map(([phaseName, data], idx) => {
                      const pct = periodTotalRevenue > 0 ? Math.round((data.revenue / periodTotalRevenue) * 100) : 0;
                      return (
                        <div key={phaseName} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 font-black text-xs flex items-center justify-center">
                              #{idx + 1}
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 text-xs block">{phaseName}</span>
                              <span className="text-[11px] text-slate-500">{data.count} ออเดอร์</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-slate-900 text-sm block">฿{data.revenue.toLocaleString()}</span>
                            <span className="text-[10px] text-slate-400 font-semibold">{pct}% ของยอดรวม</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Daily Revenue Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-slate-900 text-sm">📅 สรุปรายได้แยกตามวัน (Daily Revenue)</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">สรุปยอดเงินสด พร้อมเพย์ และจำนวนคิวในแต่ละวัน</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">วันที่</th>
                      <th className="py-3 px-4 text-center">จำนวนคิว</th>
                      <th className="py-3 px-4 text-right">ยอดพร้อมเพย์</th>
                      <th className="py-3 px-4 text-right">ยอดเงินสด</th>
                      <th className="py-3 px-4 text-right">รวมรายได้สุทธิ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dailyRows.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          ยังไม่มีประวัติรายได้ในช่วงเวลานี้
                        </td>
                      </tr>
                    ) : (
                      dailyRows.map(([dateStr, row]) => (
                        <tr key={dateStr} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-800">{dateStr}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
                              {row.count} คิว
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-semibold text-blue-600">
                            ฿{row.promptpay.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-right font-semibold text-emerald-600">
                            ฿{row.cash.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-right font-black text-slate-900 text-sm">
                            ฿{row.total.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : activeTab === "loyalty" ? (
          /* Loyalty Customer Management Tab */
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">ค้นหาและจัดการแต้มสะสมลูกค้า</h3>
                <p className="text-xs text-slate-500">กรอกเบอร์โทรศัพท์เพื่อตรวจสอบแต้ม ปรับแต้ม หรือแลกสิทธิ์ซักฟรี</p>
              </div>

              <div className="flex gap-2 max-w-md">
                <input
                  type="tel"
                  value={loyaltySearch}
                  onChange={(e) => setLoyaltySearch(e.target.value)}
                  placeholder="กรอกเบอร์โทรศัพท์ลูกค้า..."
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => handleSearchLoyalty()}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                >
                  ค้นหา
                </button>
              </div>

              {loyaltyMsg && (
                <p className="text-xs text-emerald-700 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 inline-block animate-fadeIn">
                  ✅ {loyaltyMsg}
                </p>
              )}
            </div>

            {loyaltyCustomer && (
              <div className="bg-white p-6 rounded-3xl border-2 border-emerald-300 shadow-md space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      สมาชิก
                    </span>
                    <h4 className="text-xl font-black text-slate-900 mt-1">
                      {loyaltyCustomer.name || "ลูกค้า"} ({loyaltyCustomer.phone})
                    </h4>
                    <p className="text-xs text-slate-500">
                      {loyaltyCustomer.phase} {loyaltyCustomer.soi ? `ซอย ${loyaltyCustomer.soi}` : ""} | {loyaltyCustomer.address_details}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <span className="text-xs text-slate-400 block">แต้มปัจจุบัน</span>
                      <span className="text-2xl font-black text-emerald-600">{loyaltyCustomer.stamps}/10</span>
                    </div>
                    <div className="text-center">
                      <span className="text-xs text-slate-400 block">สิทธิ์ซักฟรี</span>
                      <span className="text-2xl font-black text-amber-500">{loyaltyCustomer.free_rewards_remaining} ครั้ง</span>
                    </div>
                  </div>
                </div>

                {/* 10 Stamps Visual */}
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-2">บัตรสะสมแต้มปัจจุบัน:</span>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className={`aspect-square rounded-xl flex items-center justify-center font-bold text-xs ${
                          i < loyaltyCustomer.stamps
                            ? "bg-emerald-500 text-white shadow-xs"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {i < loyaltyCustomer.stamps ? "🫧" : i + 1}
                      </div>
                    ))}
                    <div
                      className={`aspect-square rounded-xl flex items-center justify-center font-black text-[10px] ${
                        loyaltyCustomer.stamps === 10
                          ? "bg-amber-400 text-white"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      🎁 ฟรี
                    </div>
                  </div>
                </div>

                {/* Admin Quick Stamp Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 mr-2">จัดการแต้ม:</span>
                  <button
                    type="button"
                    onClick={() => handleAdminAdjustStamp(1)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    + เพิ่ม 1 แต้ม (ซักแล้ว)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdminAdjustStamp(-1)}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs"
                  >
                    - ลบ 1 แต้ม
                  </button>
                  <button
                    type="button"
                    onClick={handleAdminRedeemFree}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs"
                  >
                    🎁 ใช้สิทธิ์ซักฟรี (Redeem 1 ครั้ง)
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Orders Tab */
          <>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาด้วยชื่อ, เบอร์โทร, หรือรหัสออเดอร์..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="pending">รอเข้ารับผ้า</option>
              <option value="slip_uploaded">แนบสลิปแล้ว</option>
              <option value="cash_pending">รอเก็บเงินสด</option>
              <option value="picked_up">เข้ารับผ้าแล้ว</option>
              <option value="washing">กำลังซักผ้า</option>
              <option value="drying">กำลังอบผ้า</option>
              <option value="delivering">กำลังนำส่งคืน</option>
              <option value="completed">จัดส่งสำเร็จ</option>
            </select>

            <select
              value={filterPhase}
              onChange={(e) => setFilterPhase(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
            >
              <option value="all">ทุกเฟส (1-17)</option>
              {Array.from({ length: 17 }, (_, i) => `เฟส ${i + 1}`).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <button
              onClick={loadOrders}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 flex-shrink-0"
              title="รีเฟรชข้อมูล"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Order Cards List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 text-slate-400">
            <Package className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-slate-700">ไม่พบรายการออเดอร์</p>
            <p className="text-xs text-slate-400 mt-1">ยังไม่มีออเดอร์ตรงกับเงื่อนไขที่ค้นหา</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const currentStatus = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              return (
                <div
                  key={order.orderId}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    {/* Order ID & Customer */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sky-700 text-sm bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
                          {order.orderId}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${currentStatus.bg} ${currentStatus.text}`}
                        >
                          <span>{currentStatus.icon}</span>
                          <span>{currentStatus.label}</span>
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(order.createdAt).toLocaleTimeString("th-TH", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          น.
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <span className="font-bold text-slate-900 text-base">
                          {order.name || "(ไม่ระบุชื่อ)"}
                        </span>
                        <a
                          href={`tel:${order.phone}`}
                          className="inline-flex items-center gap-1 text-xs text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md hover:underline font-bold"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{order.phone || "-"}</span>
                        </a>
                      </div>

                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                        <span>
                          บ้านฟ้าปิยรมณ์ <strong>{order.phase}</strong> {order.soi ? `ซอย ${order.soi}` : ""} | {order.addressDetails}
                        </span>
                      </div>
                    </div>

                    {/* Price & Payment Method */}
                    <div className="flex lg:flex-col items-center lg:items-end justify-between gap-1 flex-shrink-0">
                      <div className="text-2xl font-black text-slate-900">
                        {order.total} <span className="text-xs font-normal text-slate-500">บาท</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-600">
                          {order.paymentMethod === "promptpay"
                            ? "📱 พร้อมเพย์"
                            : order.paymentMethod === "cash_pickup"
                            ? "💵 เงินสด (ตอนรับผ้า)"
                            : "💵 เงินสด (ตอนส่งผ้า)"}
                        </span>

                        {order.slipPreview && (
                          <button
                            type="button"
                            onClick={() => setViewingSlip(order.slipPreview || null)}
                            className="text-xs text-sky-600 hover:text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>ตรวจสลิป</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Specs & Action Buttons */}
                  <div className="pt-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    {/* Laundry Specs */}
                    <div className="space-y-1 text-slate-600">
                      <div>
                        🧼 <strong>ซัก:</strong> {order.washName} (น้ำ: {order.waterTemp === "cold" ? "น้ำเย็น" : order.waterTemp === "warm" ? "น้ำอุ่น" : "น้ำร้อน"}) | 💨 <strong>อบ:</strong> {order.dryName} ({order.totalDryMinutes} นาที)
                      </div>
                      {order.notes && (
                        <div className="text-amber-700 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                          📝 <strong>หมายเหตุ:</strong> {order.notes}
                        </div>
                      )}
                    </div>

                    {/* Quick Status Update Selector */}
                    <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
                      {/* Button to share job to rider via LINE */}
                      <button
                        type="button"
                        onClick={() => handleShareToRiderLine(order)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
                        title="แชร์ใบงานนี้ให้ไรเดอร์/คนขับผ่าน LINE"
                      >
                        <span>🛵</span>
                        <span>ส่งงานให้ไรเดอร์</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          fetch("/api/notify-discord", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ order, type: "new_order" }),
                          }).then(() => alert("ยิงแจ้งเตือนเข้า Discord สำเร็จ!"));
                        }}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors border border-indigo-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        title="กดส่งแจ้งเตือนเข้าห้อง Discord อีกครั้ง"
                      >
                        <span>📢</span>
                        <span className="hidden sm:inline">Discord</span>
                      </button>

                      <span className="text-[11px] text-slate-400 font-bold ml-1">เปลี่ยนสถานะ:</span>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.orderId, e.target.value)}
                        className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
                      >
                        <option value="pending">📋 รอเข้ารับผ้า</option>
                        <option value="picked_up">🛵 เข้ารับผ้าแล้ว</option>
                        <option value="washing">🧼 กำลังซักผ้า</option>
                        <option value="drying">💨 กำลังอบผ้า</option>
                        <option value="delivering">🚚 กำลังนำส่งคืน</option>
                        <option value="completed">🎉 จัดส่งสำเร็จ</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(order.orderId)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                        title="ลบออเดอร์นี้"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </>
        )}
      </main>

      {/* Quick Order Modal from LINE */}
      {isQuickOrderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">💬</span>
                <div>
                  <h3 className="font-black text-slate-900 text-base">บันทึกออเดอร์จาก LINE ด่วน</h3>
                  <p className="text-[11px] text-slate-500">สำหรับลูกค้าที่ทักสั่งและส่งสลิปในแชท LINE</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsQuickOrderOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateQuickOrder} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    เบอร์โทรศัพท์ลูกค้า: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={quickPhone}
                    onChange={(e) => setQuickPhone(e.target.value)}
                    placeholder="08X-XXX-XXXX"
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ชื่อลูกค้า / LINE:</label>
                  <input
                    type="text"
                    value={quickName}
                    onChange={(e) => setQuickName(e.target.value)}
                    placeholder="เช่น คุณกอล์ฟ"
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">เฟส:</label>
                  <select
                    value={quickPhase}
                    onChange={(e) => setQuickPhase(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                  >
                    {Array.from({ length: 17 }, (_, i) => `เฟส ${i + 1}`).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ซอย:</label>
                  <input
                    type="text"
                    value={quickSoi}
                    onChange={(e) => setQuickSoi(e.target.value)}
                    placeholder="เช่น ซอย 5"
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">บ้านเลขที่ / จุดสังเกต:</label>
                <input
                  type="text"
                  value={quickAddress}
                  onChange={(e) => setQuickAddress(e.target.value)}
                  placeholder="เช่น 123/45 ประตูรั้วสีดำ"
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ขนาดซัก:</label>
                  <select
                    value={quickWash}
                    onChange={(e) => setQuickWash(e.target.value)}
                    className="w-full h-10 px-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="เครื่องซัก 9 kg">เครื่องซัก 9 kg</option>
                    <option value="เครื่องซัก 14 kg">เครื่องซัก 14 kg</option>
                    <option value="เครื่องซัก 18 kg">เครื่องซัก 18 kg</option>
                    <option value="เครื่องซัก 28 kg">เครื่องซัก 28 kg (ผ้านวม)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">เครื่องอบ:</label>
                  <select
                    value={quickDry}
                    onChange={(e) => setQuickDry(e.target.value)}
                    className="w-full h-10 px-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="เครื่องอบ 15 kg (24 นาที)">เครื่องอบ 15 kg (24 นาที)</option>
                    <option value="เครื่องอบ 15 kg (30 นาที)">เครื่องอบ 15 kg (30 นาที)</option>
                    <option value="เครื่องอบ 25 kg (24 นาที)">เครื่องอบ 25 kg (24 นาที)</option>
                    <option value="เครื่องอบ 25 kg (29 นาที)">เครื่องอบ 25 kg (29 นาที)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ยอดเงินรวม (บาท):</label>
                  <input
                    type="number"
                    value={quickTotal}
                    onChange={(e) => setQuickTotal(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm font-black text-sky-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">วิธีชำระเงิน:</label>
                  <select
                    value={quickPayMethod}
                    onChange={(e) => setQuickPayMethod(e.target.value as any)}
                    className="w-full h-10 px-2 rounded-xl border border-slate-300 text-xs bg-white font-bold"
                  >
                    <option value="promptpay">📱 โอนพร้อมเพย์แล้ว</option>
                    <option value="cash_pickup">💵 เงินสด (ตอนรับผ้า)</option>
                    <option value="cash_delivery">💵 เงินสด (ตอนส่งผ้า)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">หมายเหตุ:</label>
                <input
                  type="text"
                  value={quickNotes}
                  onChange={(e) => setQuickNotes(e.target.value)}
                  placeholder="เช่น สั่งผ่าน LINE โอนสลิปแล้ว"
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#06C755] hover:bg-[#05b34c] text-white font-black text-sm shadow-md shadow-emerald-600/25 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>✓ บันทึกออเดอร์ & เพิ่มแต้มสะสม (+1 แต้ม)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {viewingSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-800 text-sm">หลักฐานการโอนเงิน (สลิป)</span>
              <button
                type="button"
                onClick={() => setViewingSlip(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto rounded-xl border border-slate-200">
              <img
                src={viewingSlip}
                alt="สลิปโอนเงิน"
                className="w-full h-auto object-contain"
              />
            </div>
            <button
              type="button"
              onClick={() => setViewingSlip(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
