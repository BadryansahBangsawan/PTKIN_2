export type SignupRegisterRequest = {
  nisn: string;
  tanggalLahir: string;
  nama: string;
  telpon: string;
  email: string;
};

export type SignupRegisterSuccess = {
  ok: true;
  user: {
    id: number;
    username: string;
    email: string;
  };
  delivery: {
    emailSent: boolean;
  };
};

export type SignupRegisterFailure = {
  ok: false;
  code:
    | "VALIDATION_ERROR"
    | "DUPLICATE_USER"
    | "DB_ERROR"
    | "PTKIN_VALIDATION_FAILED"
    | "EMAIL_SEND_FAILED";
  ptkinStatus?:
    | "empty"
    | "empty_tahun_lulus"
    | "expired"
    | "wrong"
    | "auth_error"
    | "upstream_error";
  message: string;
};

export type SignupRegisterResponse = SignupRegisterSuccess | SignupRegisterFailure;

export async function registerSignupUser(
  payload: SignupRegisterRequest,
): Promise<SignupRegisterResponse> {
  const response = await fetch("/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return (await response.json()) as SignupRegisterResponse;
}
