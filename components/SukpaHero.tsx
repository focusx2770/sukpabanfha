"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, CheckCircle2, ShieldCheck, Truck, ArrowRight, Lock } from "lucide-react";

export default function SukpaHero() {
  return (
    <section className="relative pt-20 pb-10 sm:pt-28 sm:pb-16 overflow-hidden">
      {/* Decorative Bubbles Background */}
      <div className="absolute top-8 left-6 w-48 h-48 sm:w-64 sm:h-64 bg-sky-200/40 rounded-full blur-3xl -z-10 animate-float" />
      <div className="absolute bottom-6 right-6 w-56 h-56 sm:w-80 sm:h-80 bg-blue-200/30 rounded-full blur-3xl -z-10 animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-cyan-100/40 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Text Left */}
          <div className="flex-1 text-center lg:text-left space-y-4 sm:space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-100/90 border border-sky-300 text-sky-800 text-xs sm:text-sm font-semibold shadow-xs">
              <span className="text-sm sm:text-base animate-bounce">🫧</span>
              <span>บริการซัก+อบแห้ง สำหรับชาวบ้านฟ้าปิยรมณ์ คลอง 6</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              ซักสะอาด อบแห้งสนิท{" "}
              <span className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent block mt-1">
                ไม่ง้อแดด ไม่ง้อฝน!
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-slate-600 text-xs sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
              บริการแพ็กเกจ <span className="font-bold text-sky-700">ซักพร้อมอบแห้งสนิท 100%</span> ไม่ต้องตาก ไม่ต้องรอแดด ส่งถึงหน้าบ้านพร้อมใส่ รับ-ส่งฟรีทุกเฟส 1-17 ในโครงการบ้านฟ้าปิยรมณ์ (ลำลูกกา คลอง 6)
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
              <Link
                href="/booking"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-sky-500/25 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>จองคิวซัก+อบผ้า</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>
              <Link
                href="/track"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm border border-slate-200 shadow-xs active:scale-95 transition-all"
              >
                <Truck className="w-4 h-4 text-sky-500" />
                <span>เช็คสถานะผ้าของฉัน</span>
              </Link>
            </div>

            {/* Quick Benefits Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 pt-2 text-[11px] sm:text-xs text-slate-600">
              <div className="flex items-center gap-1.5 bg-white/80 p-2 sm:p-2.5 rounded-xl border border-slate-100 shadow-xs text-left">
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>แยก 1 ถังต่อ 1 คิว ไม่ปน</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 p-2 sm:p-2.5 rounded-xl border border-slate-100 shadow-xs text-left">
                <Truck className="w-4 h-4 text-sky-500 flex-shrink-0" />
                <span>ค่าบริการ 50.- ทุกเฟส 1-17</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 p-2 sm:p-2.5 rounded-xl border border-slate-100 shadow-xs text-left col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>อบแห้ง 100% พร้อมใส่</span>
              </div>
            </div>
          </div>

          {/* Logo Mascot Right */}
          <div className="flex-1 flex justify-center relative w-full">
            <div className="relative w-52 h-52 sm:w-72 sm:h-72 md:w-88 md:h-88">
              {/* Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-400 via-blue-400 to-cyan-300 opacity-30 blur-2xl animate-pulse" />
              
              {/* Mascot Card */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl shadow-sky-500/20 border-4 border-white bg-white/90 p-2 sm:p-3 group">
                <Image
                  src="/images/sukpa-logo.jpg"
                  alt="ซักป่ะ? โลโก้ บ้านฟ้าปิยรมณ์"
                  width={350}
                  height={350}
                  className="w-full h-full object-contain rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>

              {/* Floating Badge Mobile Friendly */}
              <div className="absolute -bottom-2 -left-2 bg-white/95 px-3 py-2 rounded-xl shadow-lg border border-sky-100 flex items-center gap-2">
                <span className="text-lg">🧺</span>
                <div>
                  <p className="text-[10px] text-slate-500 font-medium">แพ็กเกจซัก+อบ</p>
                  <p className="text-xs font-black text-sky-600">เริ่มต้น 90.- / คิว</p>
                </div>
              </div>

              <div className="absolute -top-2 -right-2 bg-white/95 px-3 py-2 rounded-xl shadow-lg border border-sky-100 flex items-center gap-2">
                <span className="text-lg">💨</span>
                <div>
                  <p className="text-[10px] text-slate-500 font-medium">อบแห้งสนิท</p>
                  <p className="text-xs font-black text-blue-600">พร้อมใส่ 100%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
