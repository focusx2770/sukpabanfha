"use client";

import React, { useState } from "react";
import { MessageCircle, Gift, X } from "lucide-react";
import { LINE_OA_CONFIG } from "@/lib/sukpaPricing";

export default function SukpaFloatingLine() {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-22 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end group">
      {/* Floating Prompt Pill */}
      {showTooltip && (
        <div className="mb-2 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-xl border border-emerald-100 flex items-center gap-2 text-xs animate-fadeIn max-w-[210px]">
          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Gift className="w-3 h-3 text-emerald-600" />
          </div>
          <div className="flex-1">
            <p className="font-extrabold text-slate-800 leading-tight">ซัก 10 ฟรี 1 ครั้ง! 🎁</p>
            <p className="text-[10px] text-emerald-600 font-medium">สั่งทาง LINE ได้ 24 ชม.</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-slate-600 p-0.5"
            aria-label="Close tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Floating Button */}
      <a
        href={LINE_OA_CONFIG.url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-[#06C755] hover:bg-[#05b34c] text-white shadow-xl shadow-emerald-500/35 hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold text-xs sm:text-sm"
      >
        <span className="text-xl animate-bounce">💬</span>
        <div className="text-left hidden sm:block">
          <span className="block text-[11px] text-emerald-100 font-normal leading-none">
            สั่งผ้า / คุยกับแอดมิน
          </span>
          <span className="text-xs sm:text-sm font-black">LINE @250mxrfh</span>
        </div>
        <span className="sm:hidden font-black">แอด LINE</span>

        {/* Pulsing Green Glow Ring */}
        <span className="absolute -inset-1 rounded-full bg-[#06C755] opacity-30 animate-ping -z-10" />
      </a>
    </div>
  );
}
