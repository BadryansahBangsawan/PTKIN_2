"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  lookupPtkinSiswa,
  PTKIN_LOOKUP_MESSAGES,
} from "@/lib/ptkin-siswa-lookup";
import { registerSignupUser } from "@/lib/signup-registration";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus, Hash, Calendar, User, Mail, Phone } from "lucide-react";

export default function SignUpPage() {
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

  const fillNamaFromPtkin = async (nisn: string, tanggalLahir: string) => {
    if (nisn.length !== 10 || !tanggalLahir) {
      return false;
    }

    setIsCheckingPtkin(true);
    try {
      const result = await lookupPtkinSiswa({ nisn, tanggalLahir });
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
      const lookupOk = await fillNamaFromPtkin(formData.nisn, formData.tanggalLahir);
      if (!lookupOk) return;

      const nextFormData = {
        ...formData,
        nama: formData.nama,
      };

      const registerResult = await registerSignupUser(nextFormData);
      if (!registerResult.ok) {
        setErrorMessage(registerResult.message);
        return;
      }

      console.log("Register data:", nextFormData);
      alert(
        `Registrasi berhasil.\nUsername: ${registerResult.user.username}\nKredensial login telah dikirim ke email: ${registerResult.user.email}`
      );
    } catch (error) {
      console.error(error);
      setErrorMessage(PTKIN_LOOKUP_MESSAGES.upstream_error);
      return;
    } finally {
      setIsSubmitting(false);
    }

    setFormData({
      nisn: "",
      tanggalLahir: "",
      nama: "",
      telpon: "",
      email: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card className="border-0 shadow-2xl">
          <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-5 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Registrasi NISN</h3>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-primary/5 border-b border-primary/10">
            <p className="text-sm text-gray-600 leading-relaxed">
              Data yang Anda masukkan akan divalidasi lebih lanjut. Jika dikemudian hari ditemukan ketidaksesuaian atau data yang Anda berikan tidak benar maka akan didiskualifikasi.
            </p>
          </div>
          {errorMessage ? (
            <div className="mx-6 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
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
                    const nisn = e.target.value.replace(/\D/g, "").slice(0, 10);
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
                    setFormData((prev) => ({ ...prev, tanggalLahir, nama: "" }));
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
                <strong>Penting:</strong> Username dan password akan dikirimkan via e-mail. Pastikan alamat e-mail valid dan aktif.
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <Link href="/" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 rounded-xl border-2 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Batal
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white text-sm font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl"
              >
                {isSubmitting ? "Memeriksa..." : "Simpan"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
