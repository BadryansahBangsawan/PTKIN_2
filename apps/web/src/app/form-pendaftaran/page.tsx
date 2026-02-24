"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
} from "@/components/ui/card";
import { User, MapPin, Hash, Phone, Mail, Calendar, Users, Wallet, Accessibility, LogOut, GraduationCap, School, Beaker, Star, Compass, Pencil, MessageSquare, CreditCard, Bell, Building, Award } from "lucide-react";
import { clearFormPendaftaranData, getFormPendaftaranData, setFormPendaftaranData } from "@/lib/form-pendaftaran-store";

const initialFormData = {
  biodata: {
    noKTP: "",
    nama: "",
    jenisKelamin: "",
    tempatLahir: "",
    tanggalLahir: "",
    agama: "",
    noTelp: "",
    email: "",
    provinsi: "",
    kotaKabupaten: "",
    alamat: "",
    namaAyah: "",
    namaIbu: "",
    gajiOrtu: "",
    pesertaKhusus: "",
  },
  pendidikan: {
    nisn: "",
    npsn: "",
    namaSekolah: "",
    statusSekolah: "",
    provinsi: "",
    kota: "",
    kecamatan: "",
    jenisSekolah: "",
    akreditasi: "",
    alamat: "",
    noIjazah: "",
    noSKL: "",
    noKTP: "",
    noKartuSiswa: "",
    pernahPesantren: "tidak_pernah",
    namaPesantren: "",
    lamaPesantren: "1 Tahun",
  },
};

export default function FormSekolah() {
  const router = useRouter();

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const isLoggedIn = document.cookie
      .split("; ")
      .some((cookie) => cookie.startsWith("umptkin_login="));
    if (!isLoggedIn) {
      if (window.history.length > 1) {
        router.back();
      } else {
        router.replace("/");
      }
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined" && window.confirm("Apakah Anda yakin ingin keluar?")) {
      document.cookie = "umptkin_login=; path=/; max-age=0";
      document.cookie = "umptkin_user=; path=/; max-age=0";
      document.cookie = "umptkin_name=; path=/; max-age=0";
      window.dispatchEvent(new Event("umptkin-auth-changed"));
      clearFormPendaftaranData();
      window.location.href = "/";
    }
  };

  const [formData, setFormData] = useState(() => {
    const stored = getFormPendaftaranData();
    if (!stored) {
      return initialFormData;
    }
    return {
      biodata: { ...initialFormData.biodata, ...stored.biodata },
      pendidikan: { ...initialFormData.pendidikan, ...stored.pendidikan },
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Data form:", formData);
    if (typeof window !== "undefined") {
      window.alert("Data berhasil disimpan!");
    }
    setFormPendaftaranData(formData);
    router.push("/form-klarifikasi-registrasi");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5 p-4">
      <div className="w-full max-w-7xl mx-auto">
        <Card className="border-0 shadow-2xl">
          <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Registrasi</h3>
                <p className="text-sm text-white/80">Lengkapi biodata dan data pendidikan</p>
              </div>
            </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                  <User className="h-4 w-4 text-white/80" />
                  <span className="text-sm text-white font-medium">Selamat Datang!</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-white/80 hover:text-white hover:bg-white/10"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="px-6 py-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              Data yang Anda masukkan akan divalidasi lebih lanjut. Kolom bertanda <span className="text-red-500 font-bold">*</span> wajib diisi.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <User className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-gray-800">Biodata Diri</h4>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 w-40 shrink-0">No. KTP/NIK</label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={formData.biodata.noKTP}
                        onChange={(e) => setFormData({ ...formData, biodata: { ...formData.biodata, noKTP: e.target.value } })}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 focus:border-primary focus:outline-none transition-colors"
                        placeholder="Masukkan nomor KTP/NIK"
                      />
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 w-40 shrink-0">Nama</label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={formData.biodata.nama}
                        onChange={(e) => setFormData({ ...formData, biodata: { ...formData.biodata, nama: e.target.value } })}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 focus:border-primary focus:outline-none transition-colors"
                        placeholder="Masukkan nama lengkap"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 w-40 shrink-0">Jenis Kelamin <span className="text-red-500">*</span></label>
                    <div className="relative flex-1">
                      <select
                        required
                        value={formData.biodata.jenisKelamin}
                        onChange={(e) => setFormData({ ...formData, biodata: { ...formData.biodata, jenisKelamin: e.target.value } })}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 focus:border-primary focus:outline-none transition-colors appearance-none cursor-pointer"
                      >
                        <option value="">Pilih Jenis Kelamin</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 w-40 shrink-0">Tempat Lahir <span className="text-red-500">*</span></label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        required
                        value={formData.biodata.tempatLahir}
                        onChange={(e) => setFormData({ ...formData, biodata: { ...formData.biodata, tempatLahir: e.target.value } })}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 focus:border-primary focus:outline-none transition-colors"
                        placeholder="Masukkan tempat lahir"
                      />
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 w-40 shrink-0">Tanggal Lahir</label>
                    <div className="relative flex-1">
                      <input
                        type="date"
                        value={formData.biodata.tanggalLahir}
                        onChange={(e) => setFormData({ ...formData, biodata: { ...formData.biodata, tanggalLahir: e.target.value } })}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 focus:border-primary focus:outline-none transition-colors"
                      />
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 w-40 shrink-0">Agama <span className="text-red-500">*</span></label>
                    <div className="relative flex-1">
                      <select
                        required
                        value={formData.biodata.agama}
                        onChange={(e) => setFormData({ ...formData, biodata: { ...formData.biodata, agama: e.target.value } })}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 focus:border-primary focus:outline-none transition-colors appearance-none cursor-pointer"
                      >
                        <option value="">Pilih Agama</option>
                        <option value="Islam">Islam</option>
                        <option value="Kristen">Kristen</option>
                        <option value="Katolik">Katolik</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Buddha">Buddha</option>
                        <option value="Konghucu">Konghucu</option>
                      </select>
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 w-40 shrink-0">No. Telp/HP <span className="text-red-500">*</span></label>
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        required
                        value={formData.biodata.noTelp}
                        onChange={(e) => setFormData({ ...formData, biodata: { ...formData.biodata, noTelp: e.target.value } })}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 focus:border-primary focus:outline-none transition-colors"
                        placeholder="Contoh: 081234567890"
                      />
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 w-40 shrink-0">E-mail</label>
                    <div className="relative flex-1">
                      <input
                        type="email"
                        value={formData.biodata.email}
                        onChange={(e) => setFormData({ ...formData, biodata: { ...formData.biodata, email: e.target.value } })}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 focus:border-primary focus:outline-none transition-colors"
                        placeholder="Masukkan alamat email"
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 w-40 shrink-0">Provinsi <span className="text-red-500">*</span></label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        required
                        value={formData.biodata.provinsi}
                        onChange={(e) => setFormData({ ...formData, biodata: { ...formData.biodata, provinsi: e.target.value } })}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 focus:border-primary focus:outline-none transition-colors"
                        placeholder="Masukkan nama provinsi"
                      />
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 w-40 shrink-0">Kota/Kabupaten <span className="text-red-500">*</span></label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        required
                        value={formData.biodata.kotaKabupaten}
                        onChange={(e) => setFormData({ ...formData, biodata: { ...formData.biodata, kotaKabupaten: e.target.value } })}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 focus:border-primary focus:outline-none transition-colors"
                        placeholder="Masukkan nama kota/kabupaten"
                      />
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <label className="text-sm font-semibold text-gray-700 w-40 shrink-0 pt-2">Alamat <span className="text-red-500">*</span></label>
                    <div className="relative flex-1">
                      <textarea
                        required
                        value={formData.biodata.alamat}
                        onChange={(e) => setFormData({ ...formData, biodata: { ...formData.biodata, alamat: e.target.value } })}
                        rows={3}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 focus:border-primary focus:outline-none transition-colors resize-none"
                        placeholder="Masukkan alamat lengkap"
                      />
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 w-40 shrink-0">Nama Ayah <span className="text-red-500">*</span></label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        required
                        value={formData.biodata.namaAyah}
                        onChange={(e) => setFormData({ ...formData, biodata: { ...formData.biodata, namaAyah: e.target.value } })}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 focus:border-primary focus:outline-none transition-colors"
                        placeholder="Masukkan nama ayah"
                      />
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 w-40 shrink-0">Nama Ibu <span className="text-red-500">*</span></label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        required
                        value={formData.biodata.namaIbu}
                        onChange={(e) => setFormData({ ...formData, biodata: { ...formData.biodata, namaIbu: e.target.value } })}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 focus:border-primary focus:outline-none transition-colors"
                        placeholder="Masukkan nama ibu"
                      />
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 w-40 shrink-0">Gaji Ortu/Wali <span className="text-red-500">*</span></label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        required
                        value={formData.biodata.gajiOrtu}
                        onChange={(e) => setFormData({ ...formData, biodata: { ...formData.biodata, gajiOrtu: e.target.value } })}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 focus:border-primary focus:outline-none transition-colors"
                        placeholder="Masukkan gaji orang tua/wali"
                      />
                      <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 w-40 shrink-0">Peserta Berkebutuhan Khusus</label>
                    <div className="relative flex-1">
                      <select
                        value={formData.biodata.pesertaKhusus}
                        onChange={(e) => setFormData({ ...formData, biodata: { ...formData.biodata, pesertaKhusus: e.target.value } })}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 focus:border-primary focus:outline-none transition-colors appearance-none cursor-pointer"
                      >
                        <option value="">Pilih Status</option>
                        <option value="Tidak">Tidak</option>
                        <option value="Ya">Ya</option>
                      </select>
                      <Accessibility className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-gray-800">Pendidikan SMA Sederajat</h4>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 w-40 shrink-0">No. NISN</label>
                    <div className="relative flex-1">
                      <input
                        type="number"
                        value={formData.pendidikan.nisn}
                        onChange={(e) => setFormData({ ...formData, pendidikan: { ...formData.pendidikan, nisn: e.target.value } })}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 focus:border-primary focus:outline-none transition-colors"
                        placeholder="10 digit NISN"
                      />
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 w-40 shrink-0">No. NPSN</label>
                    <div className="relative flex-1">
                      <input
                        type="number"
                        value={formData.pendidikan.npsn}
                        onChange={(e) => setFormData({ ...formData, pendidikan: { ...formData.pendidikan, npsn: e.target.value } })}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 focus:border-primary focus:outline-none transition-colors"
                        placeholder="Nomor Pokok Sekolah Nasional"
                      />
                      <Beaker className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 w-40 shrink-0">Nama Sekolah</label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={formData.pendidikan.namaSekolah}
                        onChange={(e) => setFormData({ ...formData, pendidikan: { ...formData.pendidikan, namaSekolah: e.target.value } })}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 focus:border-primary focus:outline-none transition-colors"
                        placeholder="Nama lengkap sekolah"
                      />
                      <School className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 w-40 shrink-0">Status Sekolah</label>
                    <div className="relative flex-1">
                      <select
                        value={formData.pendidikan.statusSekolah}
                        onChange={(e) => setFormData({ ...formData, pendidikan: { ...formData.pendidikan, statusSekolah: e.target.value } })}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 focus:border-primary focus:outline-none transition-colors appearance-none"
                      >
                        <option value="">Pilih status</option>
                        <option value="Negeri">Negeri</option>
                        <option value="Swasta">Swasta</option>
                      </select>
                      <Bell className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 w-40 shrink-0">Provinsi</label>
                    <div className="relative flex-1">
                      <select
                        value={formData.pendidikan.provinsi}
                        onChange={(e) => setFormData({ ...formData, pendidikan: { ...formData.pendidikan, provinsi: e.target.value } })}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 focus:border-primary focus:outline-none transition-colors appearance-none"
                      >
                        <option value="">Pilih provinsi</option>
                        <option value="Prov. Jawa Barat">Prov. Jawa Barat</option>
                        <option value="Prov. Jawa Tengah">Prov. Jawa Tengah</option>
                        <option value="Prov. Jawa Timur">Prov. Jawa Timur</option>
                      </select>
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 w-40 shrink-0">Kota</label>
                    <div className="relative flex-1">
                      <select
                        value={formData.pendidikan.kota}
                        onChange={(e) => setFormData({ ...formData, pendidikan: { ...formData.pendidikan, kota: e.target.value } })}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 focus:border-primary focus:outline-none transition-colors appearance-none"
                      >
                        <option value="">Pilih kota</option>
                        <option value="Kab. Kuningan">Kab. Kuningan</option>
                        <option value="Kab. Cirebon">Kab. Cirebon</option>
                        <option value="Kota Bandung">Kota Bandung</option>
                      </select>
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 w-40 shrink-0">Kecamatan</label>
                    <div className="relative flex-1">
                      <select
                        value={formData.pendidikan.kecamatan}
                        onChange={(e) => setFormData({ ...formData, pendidikan: { ...formData.pendidikan, kecamatan: e.target.value } })}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 focus:border-primary focus:outline-none transition-colors appearance-none"
                      >
                        <option value="">Pilih kecamatan</option>
                        <option value="Kec. Jalaksana">Kec. Jalaksana</option>
                        <option value="Kec. Kedawung">Kec. Kedawung</option>
                        <option value="Kec. Ciledug">Kec. Ciledug</option>
                      </select>
                      <Compass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 w-40 shrink-0">Jenis Sekolah</label>
                    <div className="relative flex-1">
                      <select
                        value={formData.pendidikan.jenisSekolah}
                        onChange={(e) => setFormData({ ...formData, pendidikan: { ...formData.pendidikan, jenisSekolah: e.target.value } })}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 focus:border-primary focus:outline-none transition-colors appearance-none"
                      >
                        <option value="">Pilih jenis</option>
                        <option value="SMA">SMA</option>
                        <option value="SMK">SMK</option>
                        <option value="MA">MA</option>
                      </select>
                      <Pencil className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 w-40 shrink-0">Akreditasi</label>
                    <div className="relative flex-1">
                      <select
                        value={formData.pendidikan.akreditasi}
                        onChange={(e) => setFormData({ ...formData, pendidikan: { ...formData.pendidikan, akreditasi: e.target.value } })}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 focus:border-primary focus:outline-none transition-colors appearance-none"
                      >
                        <option value="">Pilih akreditasi</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                      </select>
                      <Star className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 w-40 shrink-0">Alamat</label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={formData.pendidikan.alamat}
                        onChange={(e) => setFormData({ ...formData, pendidikan: { ...formData.pendidikan, alamat: e.target.value } })}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 focus:border-primary focus:outline-none transition-colors"
                        placeholder="Alamat lengkap sekolah"
                      />
                      <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <label className="text-sm font-semibold text-gray-700 w-40 shrink-0 pt-2">Pernah mengikuti pendidikan pesantren? <span className="text-red-500">*</span></label>
                    <div className="relative flex-1 flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="pernahPesantren"
                          value="pernah"
                          checked={formData.pendidikan.pernahPesantren === "pernah"}
                          onChange={(e) => setFormData({ ...formData, pendidikan: { ...formData.pendidikan, pernahPesantren: e.target.value, namaPesantren: "", lamaPesantren: "1 Tahun" } })}
                          className="w-4 h-4 text-primary focus:ring-primary cursor-pointer"
                        />
                        <span className="text-sm text-gray-700">Pernah</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="pernahPesantren"
                          value="tidak_pernah"
                          checked={formData.pendidikan.pernahPesantren === "tidak_pernah"}
                          onChange={(e) => setFormData({ ...formData, pendidikan: { ...formData.pendidikan, pernahPesantren: e.target.value, namaPesantren: "", lamaPesantren: "1 Tahun" } })}
                          className="w-4 h-4 text-primary focus:ring-primary cursor-pointer"
                        />
                        <span className="text-sm text-gray-700">Tidak Pernah</span>
                      </label>
                    </div>
                  </div>

                  {formData.pendidikan.pernahPesantren === "pernah" && (
                    <>
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-semibold text-gray-700 w-40 shrink-0">Nama Pesantren <span className="text-red-500">*</span></label>
                        <div className="relative flex-1">
                          <input
                            type="text"
                            required
                            value={formData.pendidikan.namaPesantren}
                            onChange={(e) => setFormData({ ...formData, pendidikan: { ...formData.pendidikan, namaPesantren: e.target.value } })}
                            className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 focus:border-primary focus:outline-none transition-colors"
                            placeholder="Masukkan nama pesantren"
                          />
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="text-sm font-semibold text-gray-700 w-40 shrink-0">Lama</label>
                        <div className="relative flex-1">
                          <select
                            required
                            value={formData.pendidikan.lamaPesantren}
                            onChange={(e) => setFormData({ ...formData, pendidikan: { ...formData.pendidikan, lamaPesantren: e.target.value } })}
                            className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 focus:border-primary focus:outline-none transition-colors appearance-none cursor-pointer"
                          >
                            <option value="6 Bulan">6 Bulan</option>
                            <option value="1 Tahun">1 Tahun</option>
                            <option value="2 Tahun">2 Tahun</option>
                            <option value="3 Tahun">3 Tahun</option>
                            <option value="> 3 Tahun">{">"} 3 Tahun</option>
                          </select>
                          <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-12 rounded-xl border-2 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Simpan Draft
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white text-sm font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl"
              >
                Simpan & Lanjut
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
