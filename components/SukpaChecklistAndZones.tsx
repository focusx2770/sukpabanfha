"use client";

import React, { useState } from "react";
import { Check, AlertCircle, Sparkles, MapPin, CheckCircle } from "lucide-react";
import { PHASES } from "@/lib/sukpaPricing";

export default function SukpaChecklistAndZones() {
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({
    0: true,
    1: true,
  });

  const checklist = [
    {
      title: "เช็กกระเป๋าเสื้อและกางเกง",
      desc: "นำเหรียญ ธนบัตร กระดาษทิชชู่ กุญแจ ลิปสติก หรือหูฟังออกจากกระเป๋าให้หมด",
      icon: "🪙",
    },
    {
      title: "แยกผ้าสีเข้มหรือผ้าสีตก",
      desc: "หากมีผ้าที่เสี่ยงสีตก หรือต้องการแยกซัก รบกวนแยกถุงพร้อมติดป้ายแจ้งชัดเจน",
      icon: "👕",
    },
    {
      title: "มัดปากถุงผ้าให้มิดชิด",
      desc: "มัดปากถุงให้แน่น พร้อมเขียนโน้ตชื่อ เบอร์โทร และเฟส/บ้านเลขที่ แปะไว้บนถุง",
      icon: "🏷️",
    },
    {
      title: "วางคู่กับน้ำยาซัก (ถ้านำมาเอง)",
      desc: "หากเลือกนำน้ำยาซัก/ปรับผ้านุ่มมาเอง ให้ใส่ถุงวางคู่กับถุงผ้าได้เลยครับ",
      icon: "🧴",
    },
  ];

  const toggleCheck = (index: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Laundry Prep Checklist (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>เช็กลิสต์เพื่อความสะอาดและถนอมผ้า</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                4 ข้อควรเช็กก่อนส่งผ้า 🧺
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                ตรวจเช็กง่ายๆ ใน 1 นาที เพื่อให้ผ้าของคุณสะอาด ปลอดภัย ไร้กังวล
              </p>
            </div>

            <div className="space-y-3">
              {checklist.map((item, idx) => {
                const isChecked = !!checkedItems[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                      isChecked
                        ? "bg-emerald-50/70 border-emerald-300 shadow-xs"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                        isChecked ? "bg-emerald-500 text-white" : "border-2 border-slate-300 bg-white"
                      }`}
                    >
                      {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{item.icon}</span>
                        <h3
                          className={`font-bold text-sm ${
                            isChecked ? "text-emerald-950" : "text-slate-800"
                          }`}
                        >
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Baan Fah Piyarom Delivery Zone (6 cols) */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-xl shadow-sky-500/5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center text-2xl">
                🏡
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  จุดรับ-ส่ง: บ้านฟ้าปิยรมณ์ คลอง 6
                </h3>
                <p className="text-xs text-slate-500">
                  บริการพิเศษสำหรับลูกบ้านในโครงการ ทุกเฟส 1 - 17
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 flex items-center gap-3 text-sky-900">
              <MapPin className="w-6 h-6 text-sky-600 flex-shrink-0" />
              <div className="text-xs leading-relaxed">
                <span className="font-bold block text-sm">ค่าบริการ 50 บาท ดูแลรับ-ส่งถึงหน้าบ้านทุกหลัง!</span>
                ครอบคลุมทุกเฟส 1 - 17 ในบ้านฟ้าปิยรมณ์ นัดเวลาเข้ารับผ้า หรือแขวนไว้หน้าบ้านได้เลย
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2.5">
                รายชื่อเฟสที่ครอบคลุมการให้บริการ:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {PHASES.map((p) => (
                  <div
                    key={p}
                    className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs font-semibold text-slate-700 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700 transition-colors"
                  >
                    {p}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>📍 พิกัด ลำลูกกา คลอง 6 ปทุมธานี</span>
              <span className="text-sky-600 font-bold">เปิดบริการทุกวัน</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
