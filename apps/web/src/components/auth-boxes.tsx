"use client";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { UserPlus, LogIn, Pencil, Unlock } from "lucide-react";
import { useModalContext } from "@/contexts/modal-context";
import { RegisterModal } from "./auth/register-modal";
import { LoginModal } from "./auth/login-modal";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";

const authRevealItems = [
  { selector: "[data-gsap='auth-card']", y: 26, stagger: 0.14, duration: 0.75 },
] as const;

export default function AuthBoxes() {
  const { setShowRegisterModal, setShowLoginModal } = useModalContext();
  const sectionRef = useGsapReveal<HTMLElement>(authRevealItems as any);

  return (
    <>
      <section id="auth-section" className="container mx-auto px-4 py-12" ref={sectionRef}>
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          <Card id="register-card" data-gsap="auth-card" className="border-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="text-center relative z-10">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20">
                <UserPlus className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-primary tracking-tight">
                Daftar UM-PTKIN
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Bagi peserta yang belum memiliki akun SPAN-PTKIN 2026
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-primary/10">
                <p className="text-sm font-medium text-primary text-center mb-2">
                  PENDAFTARAN / PEMBAYARAN BERAKHIR DALAM:
                </p>
              </div>
              <Button
                className="w-full h-14 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                size="lg"
                onClick={() => setShowRegisterModal(true)}
              >
                <Pencil className="mr-2 h-5 w-5" />
                DAFTAR SEKARANG
              </Button>
              <div className="text-center pt-2">
                <a
                  href="https://dummy-um.ptkin.ac.id/assets/file/Juknis%20Pendaftaran%20UM-PTKIN%20bagi%20Siswa_2025.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-all"
                >
                  Juknis Pendaftaran UM-PTKIN 2026
                </a>
              </div>
            </CardContent>
          </Card>

          <Card id="login-card" data-gsap="auth-card" className="border-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="text-center relative z-10">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20">
                <LogIn className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-primary tracking-tight">
                Login
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Bagi peserta yang sudah memiliki akun SPAN-PTKIN 2026
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-primary/10">
                <p className="text-sm text-gray-600 text-center">
                  Gunakan NISN dan Password yang telah dimiliki. Lanjutkan proses
                  pendaftaran hingga finalisasi dan cetak kartu ujian.
                </p>
              </div>
              <Button
                className="w-full h-14 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                size="lg"
                onClick={() => setShowLoginModal(true)}
              >
                <Unlock className="mr-2 h-5 w-5" />
                LOGIN SEKARANG
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <RegisterModal />
      <LoginModal />
    </>
  );
}
