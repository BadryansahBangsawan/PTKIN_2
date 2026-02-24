export type FormPendaftaranData = {
  biodata: Record<string, string>;
  pendidikan: Record<string, string>;
};

const STORAGE_KEY = "umptkin_form_pendaftaran";
let cachedFormPendaftaran: FormPendaftaranData | null = null;

export const setFormPendaftaranData = (data: FormPendaftaranData) => {
  cachedFormPendaftaran = data;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore storage write failures (private mode/quota).
    }
  }
};

export const getFormPendaftaranData = () => {
  if (cachedFormPendaftaran) {
    return cachedFormPendaftaran;
  }

  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as FormPendaftaranData;
    if (
      parsed &&
      typeof parsed === "object" &&
      parsed.biodata &&
      typeof parsed.biodata === "object" &&
      parsed.pendidikan &&
      typeof parsed.pendidikan === "object"
    ) {
      cachedFormPendaftaran = parsed;
      return parsed;
    }
  } catch {
    // Ignore malformed storage.
  }

  return null;
};

export const clearFormPendaftaranData = () => {
  cachedFormPendaftaran = null;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage delete failures.
    }
  }
};
