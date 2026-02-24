"use client";

import { Phone, Mail, ExternalLink, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";

const footerRevealItems = [
  { selector: "[data-gsap='footer-col']", y: 22, stagger: 0.08, duration: 0.65 },
  { selector: "[data-gsap='footer-bottom']", y: 14, duration: 0.55, start: "top 95%" },
] as const;

export default function Footer() {
  const footerRef = useGsapReveal<HTMLElement>(footerRevealItems as any);
  const quickLinks = [
    { href: "/", label: "Beranda" },
    { href: "#fitur", label: "Keunggulan" },
    { href: "#informasi", label: "Informasi" },
    { href: "/program-studi", label: "Program Studi" },
  ];

  const resources = [
    { href: "https://dummy-um.ptkin.ac.id/assets/file/Juknis%20Pendaftaran%20UM-PTKIN%20bagi%20Siswa_2025.pdf", label: "Juknis Pendaftaran", external: true },
    { href: "https://sapa.ptkin.ac.id/", label: "Help Desk", external: true },
    { href: "#kontak", label: "Kontak Kami" },
  ];

  return (
    <footer
      id="kontak"
      className="bg-primary text-primary-foreground"
      ref={footerRef}
    >
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <div className="space-y-6" data-gsap="footer-col">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12">
                <img
                  src="/Logo.svg"
                  alt="Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="font-bold text-xl text-white">
                UM-PTKIN 2026
              </span>
            </div>
            <p className="text-gray-200 text-sm leading-relaxed">
              Ujian Masuk Perguruan Tinggi Keagamaan Islam Negeri adalah
              jalur seleksi yang terpercaya untuk memasuki PTKIN di seluruh
              Indonesia.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/umptkin/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-pink-600 hover:text-white flex items-center justify-center transition-all"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.youtube.com/@pmbptkin"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-6" data-gsap="footer-col">
            <h4 className="text-lg font-bold text-white">Tautan Cepat</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-gray-200 hover:text-white hover:underline underline-offset-4 transition-all text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6" data-gsap="footer-col">
            <h4 className="text-lg font-bold text-white">Sumber Daya</h4>
            <ul className="space-y-3">
              {resources.map((resource) => (
                <li key={resource.href}>
                  <a
                    href={resource.href}
                    target={resource.external ? "_blank" : undefined}
                    rel={resource.external ? "noopener noreferrer" : undefined}
                    className="text-gray-200 hover:text-white hover:underline underline-offset-4 transition-all text-sm flex items-center gap-2"
                  >
                    {resource.label}
                    {resource.external && (
                      <ExternalLink className="h-3 w-3" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6" data-gsap="footer-col">
            <h4 className="text-lg font-bold text-white">Kontak Kami</h4>
            <ul className="space-y-4">
              <li className="space-y-2">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-200">
                    <span className="font-medium text-white block mb-1">
                      UIN Sayyid Ali Rahmatullah Tulungagung
                    </span>
                    Jl. Mayor Sujadi Timur No. 46 Plosokandang, Kedungwaru,
                    Tulungagung, Jawa Timur 66221
                  </div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-300 flex-shrink-0" />
                <a
                  href="tel:081578901030"
                  className="text-sm text-gray-200 hover:text-white transition-colors"
                >
                  081578901030
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-300 flex-shrink-0" />
                <a
                  href="mailto:info@um.ptkin.ac.id"
                  className="text-sm text-gray-200 hover:text-white transition-colors"
                >
                  info@um.ptkin.ac.id
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8" data-gsap="footer-bottom">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-300">
                © {new Date().getFullYear()} Kementerian Agama Republik Indonesia.
                All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="http://www.kemenag.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                kemenag.go.id
              </a>
              <div className="h-6 w-px bg-white/10" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">Didukung oleh:</span>
                <img
                  src="/logo-bank-mandiri.png"
                  alt="Bank Mandiri"
                  className="h-10 w-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
