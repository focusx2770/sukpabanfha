"use client";

import React from "react";
import { Waves, Flame, Sun, Sparkles, Info, ShieldAlert } from "lucide-react";

export default function SukpaPriceBoard() {
  return (
    <section id="pricing" className="py-16 sm:py-24 bg-gradient-to-b from-white via-sky-50/50 to-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-2.5">
            <span>🏷️ ตรวจสอบเรทราคาก่อนสั่ง</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            ตารางราคาซัก & อบผ้ามาตรฐาน
          </h2>
          <p className="text-slate-600 text-xs sm:text-base mt-2">
            บริการแพ็กเกจซักคู่กับอบแห้งสนิท แยกเครื่องเดี่ยว 1 ถังต่อ 1 ลูกค้าทุกครั้ง สะอาด ปลอดภัย
          </p>
        </div>

        {/* 2 Main Price Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Card 1: ราคาซักผ้า / WASHING PRICE */}
          <div className="bg-white rounded-3xl shadow-xl shadow-sky-500/5 border border-sky-100 overflow-hidden hover:shadow-sky-500/10 transition-shadow">
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-5 sm:p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
                  🧼
                </div>
                <div>
                  <h3 className="text-xl font-black">ราคาซักผ้า</h3>
                  <p className="text-xs text-sky-100 uppercase tracking-wider font-medium">Washing Price</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-xs">
                แยกถัง 100%
              </span>
            </div>

            {/* Table */}
            <div className="p-4 sm:p-6 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-3 text-xs sm:text-sm font-bold text-slate-700">ขนาดเครื่อง</th>
                    <th className="pb-3 text-center text-xs sm:text-sm font-semibold text-sky-600">
                      <div className="flex items-center justify-center gap-1">
                        <Waves className="w-3.5 h-3.5" />
                        <span>น้ำเย็น</span>
                      </div>
                      <span className="text-[10px] text-slate-600 block">Cold</span>
                    </th>
                    <th className="pb-3 text-center text-xs sm:text-sm font-semibold text-amber-600">
                      <div className="flex items-center justify-center gap-1">
                        <Sun className="w-3.5 h-3.5" />
                        <span>น้ำอุ่น</span>
                      </div>
                      <span className="text-[10px] text-slate-600 block">Warm</span>
                    </th>
                    <th className="pb-3 text-center text-xs sm:text-sm font-semibold text-rose-600">
                      <div className="flex items-center justify-center gap-1">
                        <Flame className="w-3.5 h-3.5" />
                        <span>น้ำร้อน</span>
                      </div>
                      <span className="text-[10px] text-slate-600 block">Hot</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  <tr className="hover:bg-sky-50/50 transition-colors">
                    <td className="py-3.5 font-bold text-slate-800">
                      9 kg <span className="text-xs font-normal text-slate-600 block">ผ้าประจำวัน 10-15 ชิ้น</span>
                    </td>
                    <td className="py-3.5 text-center font-bold text-sky-600">40 บาท</td>
                    <td className="py-3.5 text-center font-bold text-amber-600">50 บาท</td>
                    <td className="py-3.5 text-center font-bold text-rose-600">60 บาท</td>
                  </tr>
                  <tr className="hover:bg-sky-50/50 transition-colors">
                    <td className="py-3.5 font-bold text-slate-800">
                      14 kg <span className="text-xs font-normal text-slate-600 block">ผ้า 15-25 ชิ้น</span>
                    </td>
                    <td className="py-3.5 text-center font-bold text-sky-600">60 บาท</td>
                    <td className="py-3.5 text-center font-bold text-amber-600">70 บาท</td>
                    <td className="py-3.5 text-center font-bold text-rose-600">80 บาท</td>
                  </tr>
                  <tr className="hover:bg-sky-50/50 transition-colors">
                    <td className="py-3.5 font-bold text-slate-800">
                      18 kg <span className="text-xs font-normal text-slate-600 block">ผ้ากองโต / เครื่องนอน</span>
                    </td>
                    <td className="py-3.5 text-center font-bold text-sky-600">70 บาท</td>
                    <td className="py-3.5 text-center font-bold text-amber-600">80 บาท</td>
                    <td className="py-3.5 text-center font-bold text-rose-600">90 บาท</td>
                  </tr>
                  <tr className="hover:bg-sky-50/50 transition-colors">
                    <td className="py-3.5 font-bold text-slate-800">
                      28 kg <span className="text-xs font-normal text-slate-600 block">ผ้านวมหนา / ไซส์จัมโบ้</span>
                    </td>
                    <td className="py-3.5 text-center font-bold text-sky-600">100 บาท</td>
                    <td className="py-3.5 text-center font-bold text-amber-600">120 บาท</td>
                    <td className="py-3.5 text-center font-bold text-rose-600">140 บาท</td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>🧴 น้ำยาซัก/ปรับผ้านุ่ม นำมาเองฟรี / ร้านจัดให้ +15฿</span>
                <span className="font-semibold text-emerald-600">เริ่มต้น 40.-</span>
              </div>
            </div>
          </div>

          {/* Card 2: ราคาอบผ้า / DRYING PRICE */}
          <div className="bg-white rounded-3xl shadow-xl shadow-blue-500/5 border border-blue-100 overflow-hidden hover:shadow-blue-500/10 transition-shadow">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white p-5 sm:p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
                  💨
                </div>
                <div>
                  <h3 className="text-xl font-black">ราคาอบผ้า</h3>
                  <p className="text-xs text-blue-100 uppercase tracking-wider font-medium">Drying Price</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-xs">
                แห้งสนิท 100%
              </span>
            </div>

            {/* Table */}
            <div className="p-4 sm:p-6 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-3 text-xs sm:text-sm font-bold text-slate-700">ขนาดเครื่อง</th>
                    <th className="pb-3 text-center text-xs sm:text-sm font-semibold text-slate-600">เวลาพื้นฐาน</th>
                    <th className="pb-3 text-center text-xs sm:text-sm font-semibold text-blue-600">ราคาเริ่มต้น</th>
                    <th className="pb-3 text-center text-xs sm:text-sm font-semibold text-indigo-600">ราคาต่อเวลา</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  <tr className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-4 font-bold text-slate-800">
                      15 kg
                      <span className="text-xs font-normal text-slate-600 block">ผ้าทั่วไป แห้งไว หอมฟุ้ง</span>
                    </td>
                    <td className="py-4 text-center font-medium text-slate-700">24 นาที</td>
                    <td className="py-4 text-center font-bold text-blue-600 text-base">50 บาท</td>
                    <td className="py-4 text-center font-semibold text-indigo-600">
                      10 บาท <span className="text-xs text-slate-600 block">/ +6 นาที</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-4 font-bold text-slate-800">
                      25 kg
                      <span className="text-xs font-normal text-slate-600 block">ผ้านวมหนา / ผ้ากองใหญ่</span>
                    </td>
                    <td className="py-4 text-center font-medium text-slate-700">24 นาที</td>
                    <td className="py-4 text-center font-bold text-blue-600 text-base">70 บาท</td>
                    <td className="py-4 text-center font-semibold text-indigo-600">
                      10 บาท <span className="text-xs text-slate-600 block">/ +5 นาที</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Note / Disclaimer based on image */}
              <div className="mt-5 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-800 space-y-1.5">
                <div className="flex items-start gap-1.5 font-semibold">
                  <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>หมายเหตุสำคัญสำหรับการอบผ้า:</span>
                </div>
                <p className="pl-5 text-amber-700 leading-relaxed">
                  • การต่อเวลาเครื่องอบผ้าต้องทำก่อนหมดเวลาอย่างน้อย 10 นาที
                </p>
                <p className="pl-5 text-amber-700 leading-relaxed">
                  • เวลา 4 นาทีสุดท้ายเป็นการอบเย็น (เป็นเวลาแถมฟรี ไม่สามารถหยอดต่อเวลาได้)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
