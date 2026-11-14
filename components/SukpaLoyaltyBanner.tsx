"use client";

import React, { useState } from "react";
import { Gift, Copy, Check, MessageCircle, Sparkles, HelpCircle, ArrowRight } from "lucide-react";
import { LINE_OA_CONFIG, EASY_LINE_ORDER_TEMPLATE } from "@/lib/sukpaPricing";

export default function SukpaLoyaltyBanner() {
  const [copied, setCopied] = useState(false);

  const handleCopyEasyForm = () => {
    navigator.clipboard.writeText(EASY_LINE_ORDER_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="py-10 sm:py-14 bg-gradient-to-b from-sky-50 via-emerald-50/40 to-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Card 1: ระบบสะสมแต้ม 10 ฟรี 1 (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl shadow-emerald-500/10 flex flex-col justify-between relative overflow-hidden">
            {/* Background decorative bubble */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-100/40 rounded-full blur-2xl -z-0 pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <Gift className="w-3.5 h-3.5 text-emerald-600" />
                <span>แคมเปญพิเศษคืนกำไรลูกบ้าน</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  สะสมแต้มสุดคุ้ม{" "}
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    ซักครบ 10 ครั้ง ฟรี 1 ครั้ง!
                  </span>
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
                  สะสมง่ายๆ ผูกกับเบอร์โทรศัพท์อัตโนมัติ ไม่ต้องพกบัตรกระดาษให้กลัวหาย ซัก-อบครบ 10 ครั้ง รับสิทธิ์ซัก+อบฟรีทันที 1 คิวเต็มๆ 🫧
                </p>
              </div>

              {/* Digital Stamp Card Visual (10 Stamps) */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-500 block mb-2">
                  ตัวอย่างบัตรสะสมแต้มดิจิทัล:
                </span>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {Array.from({ length: 9 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col items-center justify-center text-center p-1"
                    >
                      <span className="text-sm">🫧</span>
                      <span className="text-[10px] font-bold text-emerald-800">{idx + 1}</span>
                    </div>
                  ))}
                  {/* 10th slot is the FREE reward */}
                  <div className="aspect-square rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex flex-col items-center justify-center text-center p-1 shadow-md shadow-orange-500/25 animate-pulse">
                    <span className="text-sm">🎁</span>
                    <span className="text-[10px] font-black uppercase">ฟรี!</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-5 flex items-center justify-between text-xs text-slate-500">
              <span>* ตรวจสอบจำนวนแต้มสะสมได้ที่หน้า "เช็คสถานะผ้า"</span>
              <span className="font-bold text-emerald-600">คุ้มที่สุดในโครงการ!</span>
            </div>
          </div>

          {/* Card 2: สำหรับคนไม่ถนัดใช้เทค / สั่งผ่าน LINE (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-700/20 flex flex-col justify-between relative">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-200" />
                <span>ไม่ถนัดใช้เว็บ? สั่งทางนี้ได้เลย!</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  สั่งซักง่ายๆ ผ่าน LINE OA
                </h3>
                <p className="text-emerald-100 text-xs sm:text-sm mt-1.5 leading-relaxed">
                  สำหรับคุณพ่อบ้าน แม่บ้าน หรือผู้สูงอายุที่ไม่ถนัดกรอกฟอร์มหน้าเว็บ สามารถทักแชทแอดมินทาง LINE พิมพ์บอกบ้านเลขที่ได้โดยตรงครับ!
                </p>
              </div>

              {/* Form snippet preview */}
              <div className="bg-black/20 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-xs text-emerald-100 font-mono space-y-1">
                <p className="text-white font-bold">📋 แบบฟอร์มสั่งใน LINE:</p>
                <p className="text-[11px] text-emerald-200">
                  1. ชื่อ-เบอร์โทร<br />
                  2. บ้านฟ้าปิยรมณ์ เฟส... ซอย... บ้านเลขที่...<br />
                  3. เสื้อผ้า / ผ้านวมกี่ชิ้น
                </p>
              </div>
            </div>

            <div className="pt-5 space-y-2.5">
              <a
                href={LINE_OA_CONFIG.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 rounded-2xl bg-[#06C755] hover:bg-[#05b34c] text-white font-black text-sm shadow-lg shadow-black/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>ทักแชทสั่งทาง LINE (@250mxrfh)</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </a>

              <button
                type="button"
                onClick={handleCopyEasyForm}
                className="w-full py-2.5 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "คัดลอกแบบฟอร์มสำเร็จ! 📋" : "คัดลอกแบบฟอร์มข้อความไปวางใน LINE"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
