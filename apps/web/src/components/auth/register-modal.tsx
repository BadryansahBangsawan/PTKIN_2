"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Button } from "../ui/button";
import { UserPlus, Hash, Calendar, User, Phone, Mail, X } from "lucide-react";
import { useModalContext } from "@/contexts/modal-context";
import {
  lookupPtkinSiswa,
  PTKIN_LOOKUP_MESSAGES,
} from "@/lib/ptkin-siswa-lookup";
import { registerSignupUser } from "@/lib/signup-registration";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function RegisterModal() {
  const { showRegisterModal, setShowRegisterModal } = useModalContext();
  const [formData, setFormData] = useState({
    nisn: "",
    tanggalLahir: "",
    nama: "",
    telpon: "",
    email: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingPtkin, setIsCheckingPtkin] = useState(false);
  const modalShellRef = useRef<HTMLDivElement | null>(null);
  const leftPanelRef = useRef<HTMLDivElement | null>(null);
  const rightPanelRef = useRef<HTMLDivElement | null>(null);
  const leftMascotRef = useRef<HTMLImageElement | null>(null);
  const rightMascotRef = useRef<HTMLImageElement | null>(null);
  const rightGlowRef = useRef<HTMLDivElement | null>(null);
  const leftFloatTlRef = useRef<gsap.core.Tween | null>(null);
  const rightFloatTlRef = useRef<gsap.core.Timeline | null>(null);
  const badgePulseTlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!showRegisterModal) {
      leftFloatTlRef.current?.kill();
      rightFloatTlRef.current?.kill();
      badgePulseTlRef.current?.kill();
      leftFloatTlRef.current = null;
      rightFloatTlRef.current = null;
      badgePulseTlRef.current = null;
      return;
    }

    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    const shell = modalShellRef.current;
    const leftPanel = leftPanelRef.current;
    const rightPanel = rightPanelRef.current;
    const leftMascot = leftMascotRef.current;
    const rightMascot = rightMascotRef.current;
    const rightGlow = rightGlowRef.current;
    if (
      !shell ||
      !leftPanel ||
      !rightPanel ||
      !leftMascot ||
      !rightMascot ||
      !rightGlow
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set([leftPanel, rightPanel], { autoAlpha: 0 });
      gsap.set(leftPanel, { x: -24 });
      gsap.set(rightPanel, { x: 24 });
      gsap.set([leftMascot, rightMascot], {
        autoAlpha: 0,
        y: 18,
        scale: 0.96,
        transformOrigin: "50% 85%",
      });
      gsap.set(rightGlow, {
        autoAlpha: 0.35,
        scale: 0.9,
        transformOrigin: "50% 50%",
      });

      const introTl = gsap.timeline();
      introTl
        .to(leftPanel, {
          autoAlpha: 1,
          x: 0,
          duration: 0.32,
          ease: "power2.out",
        })
        .to(
          rightPanel,
          { autoAlpha: 1, x: 0, duration: 0.32, ease: "power2.out" },
          "<+0.06",
        )
        .to(
          [leftMascot, rightMascot],
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.42,
            stagger: 0.08,
            ease: "back.out(1.15)",
          },
          "-=0.1",
        );

      leftFloatTlRef.current = gsap.to(leftMascot, {
        y: -7,
        rotation: -1.2,
        duration: 2.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      rightFloatTlRef.current = gsap.timeline({ repeat: -1, repeatDelay: 2 });
      rightFloatTlRef.current
        .to(rightMascot, {
          y: -6,
          rotation: -3,
          scale: 1.02,
          duration: 0.34,
          ease: "power2.out",
        })
        .to(rightMascot, {
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 0.34,
          ease: "power2.inOut",
        });

      badgePulseTlRef.current = gsap.timeline({ repeat: -1, repeatDelay: 1.4 });
      badgePulseTlRef.current
        .to(rightGlow, {
          autoAlpha: 0.65,
          scale: 1.08,
          duration: 0.55,
          ease: "sine.out",
        })
        .to(rightGlow, {
          autoAlpha: 0.3,
          scale: 0.92,
          duration: 0.7,
          ease: "sine.inOut",
        });
    }, shell);

    return () => {
      leftFloatTlRef.current?.kill();
      rightFloatTlRef.current?.kill();
      badgePulseTlRef.current?.kill();
      leftFloatTlRef.current = null;
      rightFloatTlRef.current = null;
      badgePulseTlRef.current = null;
      ctx.revert();
    };
  }, [showRegisterModal]);

  const fillNamaFromPtkin = async (nisn: string, tanggalLahir: string) => {
    if (nisn.length !== 10 || !tanggalLahir) {
      return false;
    }

    setIsCheckingPtkin(true);
    try {
      const result = await lookupPtkinSiswa({
        nisn,
        tanggalLahir,
      });

      if (result.status !== "ok") {
        setErrorMessage(result.message ?? PTKIN_LOOKUP_MESSAGES[result.status]);
        setFormData((prev) => ({ ...prev, nama: "" }));
        return false;
      }

      setErrorMessage("");
      setFormData((prev) => ({
        ...prev,
        nama: result.data.nama || prev.nama,
      }));
      return true;
    } catch (error) {
      console.error(error);
      setErrorMessage(PTKIN_LOOKUP_MESSAGES.upstream_error);
      setFormData((prev) => ({ ...prev, nama: "" }));
      return false;
    } finally {
      setIsCheckingPtkin(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const lookupOk = await fillNamaFromPtkin(
        formData.nisn,
        formData.tanggalLahir,
      );
      if (!lookupOk) return;

      const nextFormData = { ...formData, nama: formData.nama };

      const registerResult = await registerSignupUser(nextFormData);
      if (!registerResult.ok) {
        setErrorMessage(registerResult.message);
        return;
      }

      console.log("Register data:", nextFormData);
      alert(
        `Registrasi berhasil.\nUsername: ${registerResult.user.username}\nKredensial login telah dikirim ke email: ${registerResult.user.email}`,
      );
    } catch (error) {
      console.error(error);
      setErrorMessage(PTKIN_LOOKUP_MESSAGES.upstream_error);
      return;
    } finally {
      setIsSubmitting(false);
    }

    setShowRegisterModal(false);
    setFormData({
      nisn: "",
      tanggalLahir: "",
      nama: "",
      telpon: "",
      email: "",
    });
  };

  return (
    <Dialog open={showRegisterModal} onOpenChange={setShowRegisterModal}>
      <DialogContent className="max-w-lg lg:max-w-7xl overflow-visible bg-transparent shadow-none">
        <div
          ref={modalShellRef}
          className="grid items-stretch lg:grid-cols-[260px_minmax(0,1fr)_260px]"
        >
          <aside
            ref={leftPanelRef}
            className="hidden lg:flex relative overflow-visible px-2 pointer-events-none select-none"
            aria-hidden="true"
          >
            <div className="relative z-10 flex h-full w-full items-center justify-center px-2 py-6">
              <img
                ref={leftMascotRef}
                src="/Maskot/lariL.png"
                alt=""
                className="h-[400px] w-auto object-contain drop-shadow-[0_20px_32px_rgba(0,0,0,0.32)]"
                draggable={false}
              />
            </div>
          </aside>

          <div className="min-w-0 rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-5 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <UserPlus className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Registrasi NISN
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowRegisterModal(false)}
                  className="text-white/80 hover:text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="px-6 py-4 bg-primary/5 border-b border-primary/10">
              <p className="text-sm text-gray-600 leading-relaxed">
                Data yang Anda masukkan akan divalidasi lebih lanjut. Jika
                dikemudian hari ditemukan ketidaksesuaian atau data yang Anda
                berikan tidak benar maka akan didiskualifikasi.
              </p>
            </div>
            {errorMessage ? (
              <div className="mx-6 mt-4">
                <Alert variant="destructive">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              </div>
            ) : null}
            <form
              onSubmit={handleRegisterSubmit}
              className="p-6 space-y-4 max-h-[60vh] lg:max-h-[72vh] overflow-y-auto"
            >
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Hash className="h-4 w-4 text-primary" />
                  NISN <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    required
                    maxLength={10}
                    value={formData.nisn}
                    onChange={(e) => {
                      const nisn = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      const nextTanggalLahir = formData.tanggalLahir;
                      setFormData((prev) => ({ ...prev, nisn, nama: "" }));
                      if (nextTanggalLahir && nisn.length === 10) {
                        void fillNamaFromPtkin(nisn, nextTanggalLahir);
                      }
                    }}
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 pl-10 text-sm focus:border-primary focus:bg-white focus:outline-none transition-colors"
                    placeholder="Masukkan 10 digit NISN"
                  />
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Tanggal Lahir <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={formData.tanggalLahir}
                    onChange={(e) => {
                      const tanggalLahir = e.target.value;
                      const nextNisn = formData.nisn;
                      setFormData((prev) => ({
                        ...prev,
                        tanggalLahir,
                        nama: "",
                      }));
                      if (nextNisn.length === 10 && tanggalLahir) {
                        void fillNamaFromPtkin(nextNisn, tanggalLahir);
                      }
                    }}
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 pl-10 text-sm focus:border-primary focus:bg-white focus:outline-none transition-colors"
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">
                  {isCheckingPtkin
                    ? "Memeriksa data NISN ke PTKIN..."
                    : "Nama akan terisi otomatis setelah NISN dan tanggal lahir valid."}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Nama Lengkap
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={50}
                    value={formData.nama}
                    readOnly
                    onChange={() => {}}
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 pl-10 text-sm text-gray-700 focus:border-primary focus:bg-white focus:outline-none transition-colors read-only:cursor-not-allowed"
                    placeholder="Akan terisi otomatis dari data PTKIN"
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  No. Telp/HP <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    maxLength={15}
                    value={formData.telpon}
                    onChange={(e) =>
                      setFormData({ ...formData, telpon: e.target.value })
                    }
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 pl-10 text-sm focus:border-primary focus:bg-white focus:outline-none transition-colors"
                    placeholder="Contoh: 081234567890"
                  />
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  E-mail <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    maxLength={50}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 pl-10 text-sm focus:border-primary focus:bg-white focus:outline-none transition-colors"
                    placeholder="Masukkan email aktif"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                  <strong>Penting:</strong> Username dan password akan
                  dikirimkan via e-mail. Pastikan alamat e-mail valid dan aktif.
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12 rounded-xl border-2 text-sm font-semibold hover:bg-gray-50 transition-colors"
                  onClick={() => setShowRegisterModal(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white text-sm font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl"
                >
                  {isSubmitting ? "Memeriksa..." : "Simpan"}
                </Button>
              </div>
            </form>
          </div>

          <aside
            ref={rightPanelRef}
            className="hidden lg:flex relative overflow-visible px-2 pointer-events-none select-none"
            aria-hidden="true"
          >
            <div
              ref={rightGlowRef}
              className="absolute right-6 top-20 h-32 w-32 rounded-full bg-primary/25 blur-3xl"
            />
            <div className="relative z-10 flex h-full w-full items-center justify-center px-2 py-6">
              <img
                ref={rightMascotRef}
                src="/Maskot/jempol.png"
                alt=""
                className="h-[400px] w-auto object-contain drop-shadow-[0_20px_32px_rgba(0,0,0,0.32)]"
                draggable={false}
              />
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}
