import React from "react";
import SukpaNavbar from "@/components/SukpaNavbar";
import SukpaHero from "@/components/SukpaHero";
import SukpaPriceBoard from "@/components/SukpaPriceBoard";
import SukpaChecklistAndZones from "@/components/SukpaChecklistAndZones";
import SukpaFooter from "@/components/SukpaFooter";
import SukpaFloatingLine from "@/components/SukpaFloatingLine";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 relative">
      {/* Navbar */}
      <SukpaNavbar />

      {/* Main Content (Clean Landing Page) */}
      <main className="flex-1">
        <SukpaHero />
        <SukpaPriceBoard />
        <SukpaChecklistAndZones />
      </main>

      {/* Footer */}
      <SukpaFooter />

      {/* Floating LINE Button */}
      <SukpaFloatingLine />
    </div>
  );
}
