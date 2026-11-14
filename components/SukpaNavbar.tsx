"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Menu, X, ArrowRight } from "lucide-react";

export default function SukpaNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Smooth scroll handler with offset for fixed navbar
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      e.preventDefault();
      setMobileMenuOpen(false);
      const element = document.getElementById(targetId);
      if (element) {
        const navOffset = 70;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - navOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand (Clean & Minimal) */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-xs ring-1 ring-sky-300/60 group-hover:scale-105 transition-transform bg-white flex items-center justify-center flex-shrink-0">
              <Image
                src="/images/sukpa-logo.jpg"
                alt="ซักป่ะ? โลโก้"
                width={40}
                height={40}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tight">
                ซักป่ะ?
              </span>
              <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
                บ้านฟ้าปิยรมณ์
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Clean, No Clutter) */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a
              href="/#pricing"
              onClick={(e) => handleScrollTo(e, "pricing")}
              className="hover:text-sky-600 transition-colors cursor-pointer"
            >
              ตารางราคา
            </a>
            <Link
              href="/booking"
              className="hover:text-sky-600 transition-colors font-semibold"
            >
              จองคิวซักผ้า
            </Link>
            <Link
              href="/points"
              className="hover:text-sky-600 transition-colors"
            >
              สะสมแต้ม 10 ฟรี 1
            </Link>
            <Link
              href="/track"
              className="hover:text-sky-600 transition-colors text-sky-600 font-bold"
            >
              เช็คสถานะผ้า
            </Link>
          </div>

          {/* Right Action: Clean Single CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-500/20 hover:shadow-sky-500/35 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>จองคิวด่วน</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle (Minimal & Clean) */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100/80 transition-colors focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Clean, Modern Glass Effect) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-5 pt-3 pb-6 space-y-3 animate-fadeIn">
          <div className="space-y-1">
            <a
              href="/#pricing"
              onClick={(e) => handleScrollTo(e, "pricing")}
              className="block px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors"
            >
              ตารางราคาซัก & อบ
            </a>
            <Link
              href="/booking"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sky-700 bg-sky-50 font-bold text-sm"
            >
              จองคิวซักผ้า
            </Link>
            <Link
              href="/points"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors"
            >
              สะสมแต้ม (10 ฟรี 1)
            </Link>
            <Link
              href="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 font-medium text-sm"
            >
              เช็คสถานะผ้า
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/booking"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-sm text-center shadow-md shadow-sky-500/20 active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>จองคิวซักผ้าทันที</span>
            </Link>
            <a
              href="https://line.me/R/ti/p/@250mxrfh"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-[#06C755] text-white font-bold text-xs text-center active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span>💬</span>
              <span>แชทสั่งทาง LINE (@250mxrfh)</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
