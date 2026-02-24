"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, Settings, Calendar, CreditCard, Search, FileText, Video, HelpCircle, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { INFO_CONTENTS } from "@/data/info-content";
import { Button } from "./ui/button";
import VideoEmbed from "./video-embed";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";

const infoRevealItems = [
  { selector: "[data-gsap='info-header']", y: 24, duration: 0.75 },
  { selector: "[data-gsap='info-tab-card']", y: 18, stagger: 0.05, duration: 0.6 },
  { selector: "[data-gsap='info-content-panel']", y: 20, duration: 0.7, start: "top 90%" },
] as const;

const tabs = [
  { id: "pengantar", label: "Pengantar", icon: BookOpen, color: "from-blue-500 to-blue-600" },
  { id: "ketentuan", label: "Ketentuan", icon: Settings, color: "from-emerald-500 to-emerald-600" },
  { id: "jadwal", label: "Jadwal", icon: Calendar, color: "from-purple-500 to-purple-600" },
  { id: "biaya", label: "Biaya", icon: CreditCard, color: "from-orange-500 to-orange-600" },
  { id: "alur", label: "Alur", icon: Search, color: "from-pink-500 to-pink-600" },
  { id: "materiujian", label: "Materi Ujian", icon: FileText, color: "from-cyan-500 to-cyan-600" },
  { id: "tutorial", label: "Tutorial", icon: Video, color: "from-indigo-500 to-indigo-600" },
  { id: "faq", label: "FAQ", icon: HelpCircle, color: "from-red-500 to-red-600" },
];

export default function InfoTabs() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const sectionRef = useGsapReveal<HTMLElement>(infoRevealItems as any);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.fromTo(
      contentRef.current,
      { autoAlpha: 0, y: 16 },
      { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" },
    );
  }, [activeTab]);

  const selectedTab = activeTab ? tabs.find((t) => t.id === activeTab) : null;

  return (
    <section id="informasi" className="py-20 md:py-24 bg-gray-50" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-gsap="info-header">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Informasi Lengkap
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan semua informasi yang Anda butuhkan mengenai pendaftaran
            UM-PTKIN 2026
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8 mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setExpandedCard(tab.id);
                }}
                data-gsap="info-tab-card"
                aria-label={`Buka informasi ${tab.label}`}
                title={tab.label}
                className={`group relative overflow-hidden rounded-2xl p-4 md:p-5 aspect-square flex items-center justify-center transition-all duration-300 ${
                  activeTab === tab.id
                    ? "shadow-xl ring-2 ring-blue-500 bg-white -translate-y-0.5"
                    : "bg-white hover:shadow-lg shadow-sm hover:-translate-y-0.5"
                }`}
              >
                <div
                  className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${tab.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}
                />
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <div
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${tab.color} flex items-center justify-center shadow-md`}
                  >
                    <Icon className="h-7 w-7 md:h-8 md:w-8 text-white" />
                  </div>
                  {activeTab === tab.id && (
                    <div className="absolute -bottom-2 h-1.5 w-8 rounded-full bg-blue-500" />
                  )}
                  <span className="sr-only">{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {activeTab && (
          <div
            id="info-content"
            ref={contentRef}
            data-gsap="info-content-panel"
            className={`bg-white rounded-2xl shadow-xl p-8 md:p-12 transition-all duration-500 ${
              expandedCard ? "animate-in fade-in slide-in-from-bottom-4" : ""
            }`}
          >
            <div className="flex items-start gap-6 mb-8 pb-8 border-b border-gray-200">
              <div
                className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedTab?.color} flex items-center justify-center flex-shrink-0`}
              >
                {(() => {
                  const Icon = selectedTab?.icon;
                  return Icon ? <Icon className="h-8 w-8 text-white" /> : null;
                })()}
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {INFO_CONTENTS[activeTab]?.title}
                </h3>
                <p className="text-gray-600">
                  {selectedTab?.label}
                </p>
              </div>
            </div>

            <div
              className="prose prose-slate max-w-none [&_iframe]:w-full [&_div.relative]:w-full [&_div[style*='padding-bottom']]:h-0 [&_iframe[style*='position: absolute']]:border-0 prose-headings:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900 prose-ol:text-gray-700 prose-ul:text-gray-700 prose-table:text-gray-700"
            >
              {activeTab === "tutorial" ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Video Tutorial Ujian</h3>
                    <VideoEmbed className="aspect-video" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Panduan Singkat</h3>
                    <ul className="space-y-2 list-disc list-inside text-sm">
                      <li>Pastikan komputer/laptop dan koneksi internet stabil sebelum ujian</li>
                      <li>Login menggunakan NISN dan password yang telah terdaftar</li>
                      <li>Ikuti semua instruksi yang diberikan</li>
                      <li>Kerjakan soal dengan teliti dan cek kembali sebelum submit</li>
                    </ul>
                  </div>
                </div>
              ) : activeTab === "biaya" ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Biaya Pendaftaran</h3>
                    <p className="mb-4">
                      Biaya pendaftaran sebesar{" "}
                      <span className="font-bold text-primary text-xl">Rp. 200.000</span> (Dua
                      Ratus Ribu Rupiah), belum termasuk biaya tambahan jika transaksi menggunakan
                      bank selain Bank Mandiri.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Tata Cara Pembayaran</h3>
                    <VideoEmbed className="aspect-video" />
                  </div>
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{
                  __html: INFO_CONTENTS[activeTab]?.content || "",
                }} />
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => {
                  setExpandedCard(null);
                  const nextIndex = (tabs.findIndex(t => t.id === activeTab) + 1) % tabs.length;
                  setActiveTab(tabs[nextIndex].id);
                  setExpandedCard(tabs[nextIndex].id);
                  document.getElementById("info-content")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex-1"
              >
                Informasi Selanjutnya
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>

            </div>
          </div>
        )}
      </div>
    </section>
  );
}
