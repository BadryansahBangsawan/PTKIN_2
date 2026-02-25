type SendCredentialsEmailInput = {
  to: string;
  nama: string;
  username: string;
  password: string;
};

type MailjetSendResponse = {
  Messages?: Array<{
    Status?: string;
    Errors?: unknown;
    To?: Array<{ Email?: string; MessageUUID?: string; MessageID?: number }>;
  }>;
};

export async function sendCredentialsEmailViaMailjet(
  input: SendCredentialsEmailInput,
) {
  const apiKey =
    process.env.MAILJET_API_KEY?.trim() ||
    process.env.MAILJET_KEY?.trim() ||
    process.env.MJ_APIKEY_PUBLIC?.trim() ||
    process.env.api_key?.trim();
  const apiSecret =
    process.env.MAILJET_API_SECRET?.trim() ||
    process.env.MAILJET_SECRET?.trim() ||
    process.env.MAILJET_SECRET_KEY?.trim() ||
    process.env.MJ_APIKEY_PRIVATE?.trim() ||
    process.env.api_key_secret?.trim();

  if (!apiKey || !apiSecret) {
    throw new Error("MAILJET_CREDENTIALS_MISSING");
  }

  const fromEmail =
    process.env.MAILJET_FROM_EMAIL?.trim() ||
    process.env.MAILJET_FROM?.trim() ||
    "pmb@ptkin.ac.id";
  const fromName = process.env.MAILJET_FROM_NAME?.trim() || "info UM-PTKIN";
  const subject = process.env.MAILJET_SUBJECT?.trim() || "Pendaftaran UM-PTKIN 2026";

  const textPart = [
    `Kepada Yth ${input.nama},`,
    "",
    "Terima kasih telah melakukan pendaftaran pada UMPTKIN 2026.",
    "",
    "Berikut ini adalah Username dan Password anda.",
    `Username : ${input.username}`,
    `Password : ${input.password}`,
    "",
    "Silahkan melakukan login dan melengkapi biodata anda, kemudian melakukan pembayaran.",
    "",
    "Ttd.",
    "Panitia Nasional UM-PTKIN 2026",
    "https://um.ptkin.ac.id/",
    "",
    "Jika ada kendala silahkan hubungi 0815-7890-1030 (WA chat dan Call)",
  ].join("\n");

  const htmlPart = [
    `Kepada Yth ${escapeHtml(input.nama)},<br/>`,
    "Terima kasih telah melakukan pendaftaran pada UMPTKIN 2026.<br/>",
    "Berikut ini adalah Username dan Password anda.<br/><br/>",
    `Username : ${escapeHtml(input.username)}<br/>`,
    `Password : ${escapeHtml(input.password)}<br/><br/>`,
    "Silahkan melakukan login dan melengkapi biodata anda, kemudian melakukan pembayaran.<br/><br/>",
    "Ttd.<br/>",
    "Panitia Nasional UM-PTKIN 2026<br/>",
    "<a href='https://um.ptkin.ac.id/'>https://um.ptkin.ac.id/</a><br/><br/>",
    "Jika ada kendala silahkan hubungi 0815-7890-1030 (WA chat dan Call)",
  ].join("");

  const basicAuth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  const response = await fetch("https://api.mailjet.com/v3.1/send", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Messages: [
        {
          From: {
            Email: fromEmail,
            Name: fromName,
          },
          To: [
            {
              Email: input.to,
              Name: input.nama,
            },
          ],
          Subject: subject,
          TextPart: textPart,
          HTMLPart: htmlPart,
        },
      ],
    }),
    cache: "no-store",
  });

  const raw = await response.text();
  if (!response.ok) {
    throw new Error(`MAILJET_SEND_FAILED:${response.status}:${raw}`);
  }

  let parsed: MailjetSendResponse | string = raw;
  try {
    parsed = JSON.parse(raw) as MailjetSendResponse;
  } catch {
    // keep raw string for debugging fallback
  }

  const firstMessageStatus =
    typeof parsed === "string" ? undefined : parsed.Messages?.[0]?.Status?.toLowerCase();
  if (firstMessageStatus && firstMessageStatus !== "success") {
    throw new Error(`MAILJET_SEND_FAILED:MESSAGE_STATUS:${raw}`);
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
