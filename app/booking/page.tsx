"use client";

import React, { Suspense } from "react";
import SukpaNavbar from "@/components/SukpaNavbar";
import SukpaFooter from "@/components/SukpaFooter";
import SukpaFloatingLine from "@/components/SukpaFloatingLine";
import SukpaCalculator from "@/components/SukpaCalculator";
import SukpaChecklistAndZones from "@/components/SukpaChecklistAndZones";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BookingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <SukpaNavbar />

      <main className="flex-1 pt-20 sm:pt-24 pb-16">
        {/* Top Breadcrumb Header */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-600 font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>กลับสู่หน้าแรก</span>
          </Link>
          <span className="text-[11px] font-bold text-sky-700 bg-sky-50 border border-sky-100 px-3 py-1 rounded-full">
            จองคิวซัก+อบผ้า (บ้านฟ้าปิยรมณ์)
          </span>
        </div>

        {/* Calculator Component */}
        <SukpaCalculator />

        {/* 4 Checklist Items & Phase Zones */}
        <SukpaChecklistAndZones />
      </main>

      <SukpaFooter />
      <SukpaFloatingLine />
    </div>
  );
}
