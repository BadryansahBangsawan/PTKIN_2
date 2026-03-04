// API client for pendaftaran form
import { clearFormPendaftaranData, getFormPendaftaranData } from "./form-pendaftaran-store";

export interface BiodataData {
  noKTP?: string;
  nama?: string;
  jenisKelamin?: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  agama?: string;
  noTelp?: string;
  email?: string;
  provinsi?: string;
  kotaKabupaten?: string;
  alamat?: string;
  namaAyah?: string;
  namaIbu?: string;
  gajiOrtu?: string;
  pesertaKhusus?: string;
}

export interface PendidikanData {
  nisn?: string;
  npsn?: string;
  namaSekolah?: string;
  statusSekolah?: string;
  provinsi?: string;
  kota?: string;
  kecamatan?: string;
  jenisSekolah?: string;
  akreditasi?: string;
  alamat?: string;
  noIjazah?: string;
  noSKL?: string;
  noKTP?: string;
  noKartuSiswa?: string;
  pernahPesantren?: string;
  namaPesantren?: string;
  lamaPesantren?: string;
}

export interface PendaftaranData {
  biodata: BiodataData;
  pendidikan: PendidikanData;
}

export interface PendaftaranResponse {
  ok: boolean;
  message?: string;
  biodata?: BiodataData | null;
  pendidikan?: PendidikanData | null;
  code?: string;
  errors?: unknown;
}

// Get userId from cookie
function getUserIdFromCookie(): number | null {
  if (typeof document === "undefined") return null;
  
  const cookies = document.cookie.split("; ");
  const userCookie = cookies.find((cookie) => cookie.startsWith("umptkin_user="));
  
  if (!userCookie) return null;
  
  const userId = userCookie.split("=")[1];
  const parsed = parseInt(userId, 10);
  
  return isNaN(parsed) ? null : parsed;
}

// Fetch pendaftaran data from API
export async function fetchPendaftaranData(userId?: number): Promise<PendaftaranResponse> {
  const uid = userId || getUserIdFromCookie();
  
  if (!uid) {
    return { ok: false, code: "NO_USER", message: "User tidak ditemukan." };
  }
  
  try {
    const response = await fetch(`/api/pendaftaran?userId=${uid}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch pendaftaran error:", error);
    return { ok: false, code: "NETWORK_ERROR", message: "Gagal mengambil data dari server." };
  }
}

// Save pendaftaran data to API
export async function savePendaftaranData(
  data: PendaftaranData,
  userId?: number
): Promise<PendaftaranResponse> {
  const uid = userId || getUserIdFromCookie();
  
  if (!uid) {
    return { ok: false, code: "NO_USER", message: "User tidak ditemukan." };
  }
  
  try {
    const response = await fetch("/api/pendaftaran", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: uid,
        biodata: data.biodata,
        pendidikan: data.pendidikan,
      }),
    });
    
    const result = await response.json();
    
    // Clear local storage after successful save
    if (result.ok) {
      clearFormPendaftaranData();
    }
    
    return result;
  } catch (error) {
    console.error("Save pendaftaran error:", error);
    return { ok: false, code: "NETWORK_ERROR", message: "Gagal menyimpan data ke server." };
  }
}

// Sync local data with server (save local data to server)
export async function syncPendaftaranToServer(): Promise<PendaftaranResponse> {
  const localData = getFormPendaftaranData();
  
  if (!localData) {
    return { ok: true, message: "Tidak ada data lokal untuk disinkronkan." };
  }
  
  return savePendaftaranData(localData);
}
