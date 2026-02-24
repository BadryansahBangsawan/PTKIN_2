export type PtkinLookupStatus =
  | "ok"
  | "empty"
  | "empty_tahun_lulus"
  | "expired"
  | "wrong"
  | "auth_error"
  | "upstream_error";

export type PtkinLookupSuccess = {
  status: "ok";
  data: {
    nama: string;
    tanggal_lahir: string;
    tahun_lulus: string;
  };
};

export type PtkinLookupFailure = {
  status: Exclude<PtkinLookupStatus, "ok">;
  message?: string;
};

export type PtkinLookupResponse = PtkinLookupSuccess | PtkinLookupFailure;

export const PTKIN_LOOKUP_MESSAGES: Record<
  Exclude<PtkinLookupStatus, "ok">,
  string
> = {
  empty:
    "Data tidak ditemukan. Pastikan NISN benar dan tercatat di Dapodik/Verval PD.",
  empty_tahun_lulus:
    "Data lulusan tidak valid. Tahun lulus belum tersedia pada data sumber.",
  expired:
    "Tahun lulus tidak memenuhi syarat (hanya tiga tahun terakhir).",
  wrong: "Tanggal lahir salah. Periksa kembali tanggal lahir Anda.",
  auth_error:
    "Gagal mengambil token akses PTKIN. Konfigurasi token/kredensial server perlu diperiksa.",
  upstream_error:
    "Layanan PTKIN sedang bermasalah atau merespons di luar format yang diharapkan.",
};

export async function lookupPtkinSiswa(params: {
  nisn: string;
  tanggalLahir: string;
}): Promise<PtkinLookupResponse> {
  const response = await fetch("/api/ptkin/siswa", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const payload = (await response.json()) as PtkinLookupResponse;
  return payload;
}
