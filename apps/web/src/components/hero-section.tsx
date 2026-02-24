"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Button } from "./ui/button";
import Countdown from "./countdown";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";

const heroRevealItems = [
  { selector: "[data-gsap='hero-title']", y: 28, duration: 0.8, start: "top 92%" },
  { selector: "[data-gsap='hero-subtitle']", y: 22, duration: 0.7, delay: 0.05, start: "top 92%" },
  { selector: "[data-gsap='hero-cta']", y: 18, duration: 0.7, delay: 0.1, start: "top 92%" },
  { selector: "[data-gsap='hero-countdown']", y: 18, duration: 0.7, delay: 0.15, start: "top 92%" },
] as const;

let heroScrollRegistered = false;

export default function HeroSection() {
  const targetDate = new Date("2026-05-30T16:00:00+09:00");
  const sectionRef = useGsapReveal<HTMLElement>(heroRevealItems as any);

  useEffect(() => {
    const scope = sectionRef.current;
    if (!scope || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (!heroScrollRegistered) {
      gsap.registerPlugin(ScrollTrigger);
      heroScrollRegistered = true;
    }

    const content = scope.querySelector("[data-gsap='hero-content']");
    if (!content) return;

    const ctx = gsap.context(() => {
      gsap.to(content, {
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, scope);

    return () => ctx.revert();
  }, [sectionRef]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/Benner_primary.png')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/20" />
      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10" data-gsap="hero-content">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="space-y-2" data-gsap="hero-title">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white">
                UM-PTKIN 2026
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 font-medium" data-gsap="hero-subtitle">
                Ujian Masuk Perguruan Tinggi
              </p>
              <p className="text-xl md:text-2xl text-gray-200 font-medium" data-gsap="hero-subtitle">
                Keagamaan Islam Negeri
              </p>
            </div>

            <div className="flex justify-center lg:justify-start" data-gsap="hero-cta">
              <Button
                size="lg"
                className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => {
                  const element = document.getElementById("auth-section");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Daftar UM-PTKIN
              </Button>
            </div>

            <div className="pt-4" data-gsap="hero-countdown">
              <Countdown targetDate={targetDate} />
            </div>
          </div>

          <div className="relative flex justify-center items-center"></div>
        </div>
      </div>
    </section>
  );
}
