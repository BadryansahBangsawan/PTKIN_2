export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginSuccess = {
  ok: true;
  user: {
    id: number;
    username: string;
    nisn: string;
    nama: string;
    email: string;
  };
};

export type LoginFailure = {
  ok: false;
  code: "VALIDATION_ERROR" | "INVALID_CREDENTIALS" | "DB_ERROR";
  message: string;
};

export type LoginResponse = LoginSuccess | LoginFailure;

export async function loginWithPassword(
  payload: LoginRequest,
): Promise<LoginResponse> {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return (await response.json()) as LoginResponse;
}
