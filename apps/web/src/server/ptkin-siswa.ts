export type PtkinServerLookupStatus =
  | "ok"
  | "empty"
  | "empty_tahun_lulus"
  | "expired"
  | "wrong"
  | "auth_error"
  | "upstream_error";

export type PtkinServerLookupResult =
  | {
      status: "ok";
      data: {
        nama: string;
        tanggal_lahir: string;
        tahun_lulus: string;
      };
    }
  | {
      status: Exclude<PtkinServerLookupStatus, "ok">;
      message?: string;
    };

const SEM_LULUS = new Set(["20232", "20241", "20242", "20251", "20252"]);

type UpstreamSiswaResponse = {
  data?: {
    nama?: string;
    tanggal_lahir?: string;
    tahun_lulus?: string;
  };
};

function normalizeDate(value: string) {
  return value.trim().slice(0, 10);
}

function extractToken(raw: unknown): string | null {
  if (typeof raw === "string" && raw.trim()) {
    return raw.trim();
  }

  if (!raw || typeof raw !== "object") {
    return null;
  }

  const maybeObject = raw as Record<string, unknown>;
  for (const key of ["access_token", "token", "data"]) {
    const value = maybeObject[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  if (
    maybeObject.data &&
    typeof maybeObject.data === "object" &&
    typeof (maybeObject.data as Record<string, unknown>).access_token === "string"
  ) {
    return ((maybeObject.data as Record<string, unknown>).access_token as string).trim();
  }

  return null;
}

async function getPtkinAccessToken() {
  if (process.env.PTKIN_ACCESS_TOKEN?.trim()) {
    return process.env.PTKIN_ACCESS_TOKEN.trim();
  }

  const tokenUrl =
    process.env.PTKIN_TOKEN_URL ?? "https://reg.ptkin.ac.id/api/auth/get-token";
  const username = process.env.PTKIN_TOKEN_USERNAME?.trim();
  const password = process.env.PTKIN_TOKEN_PASSWORD?.trim();

  let tokenRes: Response;
  if (username && password) {
    tokenRes = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: new URLSearchParams({
        username,
        password,
      }).toString(),
      cache: "no-store",
    });
  } else {
    const headers: HeadersInit = {};
    if (process.env.PTKIN_TOKEN_AUTHORIZATION?.trim()) {
      headers.Authorization = process.env.PTKIN_TOKEN_AUTHORIZATION.trim();
    }

    tokenRes = await fetch(tokenUrl, {
      method: "GET",
      headers,
      cache: "no-store",
    });
  }

  let parsed: unknown = null;
  try {
    parsed = await tokenRes.json();
  } catch {
    parsed = null;
  }

  const token = extractToken(parsed);
  if (!token) {
    throw new Error("PTKIN_TOKEN_UNAVAILABLE");
  }

  return token;
}

async function fetchSiswaByNisn(nisn: string, accessToken: string) {
  const url = new URL("https://reg.ptkin.ac.id/api/dapodik/siswa");
  url.searchParams.set("access-token", accessToken);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: new URLSearchParams({ nisn }).toString(),
    cache: "no-store",
  });

  const text = await res.text();
  if (!text.trim()) {
    throw new Error("PTKIN_EMPTY_RESPONSE");
  }

  try {
    return JSON.parse(text) as UpstreamSiswaResponse;
  } catch {
    throw new Error("PTKIN_BAD_JSON");
  }
}

export async function validatePtkinSiswa(input: {
  nisn: string;
  tanggalLahir: string;
}): Promise<PtkinServerLookupResult> {
  let accessToken: string;
  try {
    accessToken = await getPtkinAccessToken();
  } catch (error) {
    console.error("PTKIN token error:", error);
    return { status: "auth_error" };
  }

  let siswa: UpstreamSiswaResponse;
  try {
    siswa = await fetchSiswaByNisn(input.nisn, accessToken);
  } catch (error) {
    console.error("PTKIN siswa error:", error);
    return { status: "upstream_error" };
  }

  if (!siswa?.data) {
    return { status: "empty" };
  }

  const sisTglLahir = normalizeDate(siswa.data.tanggal_lahir ?? "");
  const inputTglLahir = normalizeDate(input.tanggalLahir);
  if (!sisTglLahir || sisTglLahir !== inputTglLahir) {
    return { status: "wrong" };
  }

  const tahunLulus = (siswa.data.tahun_lulus ?? "").trim();
  if (!tahunLulus) {
    return { status: "empty_tahun_lulus" };
  }

  if (!SEM_LULUS.has(tahunLulus)) {
    return { status: "expired" };
  }

  return {
    status: "ok",
    data: {
      nama: (siswa.data.nama ?? "").trim(),
      tanggal_lahir: sisTglLahir,
      tahun_lulus: tahunLulus,
    },
  };
}
