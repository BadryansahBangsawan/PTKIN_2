type SendCredentialsEmailInput = {
  to: string;
  nama: string;
  username: string;
  password: string;
};

export async function sendCredentialsEmailViaResend(
  input: SendCredentialsEmailInput,
) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY_MISSING");
  }

  const from =
    process.env.RESEND_FROM?.trim() ||
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "onboarding@resend.dev";
  const appName = process.env.RESEND_APP_NAME?.trim() || "UM-PTKIN 2026";

  const subject = `${appName} - Username dan Password Anda`;
  const text = [
    `Assalamu'alaikum ${input.nama},`,
    "",
    "Registrasi Anda berhasil.",
    "",
    "Berikut akun login Anda:",
    `Username: ${input.username}`,
    `Password: ${input.password}`,
    "",
    "Simpan kredensial ini dengan aman dan segera ubah password setelah login jika fitur tersedia.",
    "",
    "Hormat kami,",
    appName,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
      <p>Assalamu'alaikum ${escapeHtml(input.nama)},</p>
      <p>Registrasi Anda berhasil.</p>
      <p>Berikut akun login Anda:</p>
      <ul>
        <li><strong>Username:</strong> ${escapeHtml(input.username)}</li>
        <li><strong>Password:</strong> ${escapeHtml(input.password)}</li>
      </ul>
      <p>Simpan kredensial ini dengan aman dan segera ubah password setelah login jika fitur tersedia.</p>
      <p>Hormat kami,<br/>${escapeHtml(appName)}</p>
    </div>
  `;

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject,
      text,
      html,
    }),
    cache: "no-store",
  });

  const raw = await resendRes.text();
  if (!resendRes.ok) {
    throw new Error(`RESEND_SEND_FAILED:${resendRes.status}:${raw}`);
  }

  let parsed: unknown = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = raw;
  }

  return parsed;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
