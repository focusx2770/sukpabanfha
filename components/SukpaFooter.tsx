import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Phone, MapPin, Heart } from "lucide-react";

export default function SukpaFooter() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white p-1 flex-shrink-0 shadow-md">
                <Image
                  src="/images/sukpa-logo.jpg"
                  alt="ซักป่ะ? โลโก้"
                  width={48}
                  height={48}
                  className="object-contain w-full h-full rounded-xl"
                />
              </div>
              <div>
                <span className="text-xl font-black text-white">ซักป่ะ?</span>
                <span className="text-xs text-sky-400 block font-semibold">บ้านฟ้าปิยรมณ์ (ลำลูกกา คลอง 6)</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              บริการซัก-อบผ้าแห้งสนิท ไม่ง้อแดด ส่งถึงหน้าบ้าน แยก 1 ถังต่อ 1 คิว 100% สะอาด หอมสดชื่น ปลอดภัย ไร้กังวล สำหรับชาวบ้านฟ้าปิยรมณ์ทุกเฟส
            </p>
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-sky-400" />
              <span>หมู่บ้านบ้านฟ้าปิยรมณ์ ต.บึงคำพร้อย อ.ลำลูกกา จ.ปทุมธานี 12150</span>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">บริการด่วน</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#pricing" className="hover:text-white transition-colors">
                  ตารางราคาซัก & อบ
                </Link>
              </li>
              <li>
                <Link href="/#calculator" className="hover:text-white transition-colors">
                  คำนวณราคา & สั่งซัก
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-white transition-colors text-sky-400 font-medium">
                  🚚 เช็คสถานะผ้าของฉัน
                </Link>
              </li>
              <li>
                <Link href="/payment" className="hover:text-white transition-colors">
                  💸 ชำระเงิน / แนบสลิป
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">ติดต่อสั่งซัก</h4>
            <p className="text-xs text-slate-400">
              สอบถามเพิ่มเติม นัดคิว หรือส่งรูปผ้า สามารถทักแชท LINE หรือโทรสอบถามได้ตลอดเวลาครับ (มีสะสมแต้ม 10 ฟรี 1!)
            </p>
            <div className="space-y-2 pt-1">
              <a
                href="https://line.me/R/ti/p/@250mxrfh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white text-xs sm:text-sm font-bold transition-transform hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>LINE OA: @250mxrfh (ทักแชท 24 ชม.)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 ซักป่ะ? บ้านฟ้าปิยรมณ์ (ลำลูกกา คลอง 6). All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>ทำด้วย</span> <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> <span>เพื่อชาวบ้านฟ้าปิยรมณ์ 🫧</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
