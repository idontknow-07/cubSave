import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || process.env.GMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD,
  },
});

const FROM = `"VaultChain" <${process.env.SMTP_USER || process.env.GMAIL_USER}>`;

function base(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f4faf6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4faf6;padding:40px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

      <!-- Logo -->
      <tr><td style="padding-bottom:28px;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="width:42px;height:42px;background:linear-gradient(135deg,#15a35c,#047857);border-radius:11px;text-align:center;vertical-align:middle;">
              <span style="font-size:13px;font-weight:900;color:#fff;line-height:42px;">VC</span>
            </td>
            <td style="padding-left:11px;vertical-align:middle;">
              <span style="font-size:18px;font-weight:800;color:#0a1f17;letter-spacing:-0.02em;">Vault<span style="color:#15a35c;">Chain</span></span>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- Card -->
      <tr><td style="background:#ffffff;border:1px solid #e4efe9;border-radius:20px;padding:36px 32px;">
        ${body}
      </td></tr>

      <!-- Footer -->
      <tr><td style="padding-top:24px;text-align:center;">
        <p style="font-size:12px;color:#7b8c84;margin:0;">
          © ${new Date().getFullYear()} VaultChain · Your crypto, your control.
        </p>
        <p style="font-size:12px;color:#7b8c84;margin:6px 0 0;">
          If you did not request this email, you can safely ignore it.
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

export async function sendVerificationEmail(to: string, username: string, code: string) {
  const body = `
    <h2 style="font-size:22px;font-weight:800;color:#0a1f17;margin:0 0 8px;letter-spacing:-0.02em;">
      Verify your email
    </h2>
    <p style="font-size:15px;color:#51635b;margin:0 0 28px;line-height:1.6;">
      Hey <strong style="color:#0a1f17;">${username}</strong>, enter this code to confirm your VaultChain account.
    </p>

    <div style="background:#f4faf6;border:1px solid #e4efe9;border-radius:16px;padding:28px;text-align:center;margin-bottom:28px;">
      <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#7b8c84;margin:0 0 12px;">
        Verification Code
      </p>
      <p style="font-size:48px;font-weight:900;letter-spacing:10px;color:#15a35c;margin:0;line-height:1;">
        ${code}
      </p>
    </div>

    <p style="font-size:13px;color:#7b8c84;margin:0;text-align:center;line-height:1.7;">
      This code expires in <strong style="color:#51635b;">15 minutes</strong>.<br/>
      Never share this code with anyone.
    </p>
  `;

  await transporter.sendMail({
    from: FROM,
    to,
    subject: `${code} — Your VaultChain verification code`,
    html: base("Verify your email", body),
  });
}

export async function sendPasswordResetEmail(to: string, username: string, code: string) {
  const body = `
    <h2 style="font-size:22px;font-weight:800;color:#0a1f17;margin:0 0 8px;letter-spacing:-0.02em;">
      Reset your password
    </h2>
    <p style="font-size:15px;color:#51635b;margin:0 0 28px;line-height:1.6;">
      Hey <strong style="color:#0a1f17;">${username}</strong>, use this code to reset your VaultChain password.
    </p>

    <div style="background:#f4faf6;border:1px solid #e4efe9;border-radius:16px;padding:28px;text-align:center;margin-bottom:28px;">
      <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#7b8c84;margin:0 0 12px;">
        Reset Code
      </p>
      <p style="font-size:48px;font-weight:900;letter-spacing:10px;color:#15a35c;margin:0;line-height:1;">
        ${code}
      </p>
    </div>

    <p style="font-size:13px;color:#7b8c84;margin:0;text-align:center;line-height:1.7;">
      This code expires in <strong style="color:#51635b;">15 minutes</strong>.<br/>
      If you did not request a password reset, please contact support immediately.
    </p>
  `;

  await transporter.sendMail({
    from: FROM,
    to,
    subject: `${code} — Reset your VaultChain password`,
    html: base("Reset your password", body),
  });
}

export async function sendDepositEmail(
  to: string,
  username: string,
  amount: number,
  coin: string,
  network: string,
  usdValue: number | null,
) {
  const usdLine = usdValue != null
    ? `<p style="font-size:14px;color:#51635b;margin:8px 0 0;">≈ <strong style="color:#0a1f17;">$${usdValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</strong></p>`
    : "";

  const body = `
    <h2 style="font-size:22px;font-weight:800;color:#0a1f17;margin:0 0 8px;letter-spacing:-0.02em;">
      Deposit Received
    </h2>
    <p style="font-size:15px;color:#51635b;margin:0 0 24px;line-height:1.6;">
      Hey <strong style="color:#0a1f17;">${username}</strong>, your wallet has been credited.
    </p>

    <div style="background:#eafaf1;border:1px solid #cdeedd;border-radius:16px;padding:28px;text-align:center;margin-bottom:24px;">
      <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#51635b;margin:0 0 10px;">
        ${coin} · ${network}
      </p>
      <p style="font-size:44px;font-weight:900;color:#15a35c;margin:0;line-height:1;letter-spacing:-0.02em;">
        +${amount} ${coin}
      </p>
      ${usdLine}
      <p style="font-size:13px;color:#51635b;margin:14px 0 0;">
        has been deposited to your wallet
      </p>
    </div>

    <div style="background:#fff8ed;border:1px solid #ffe4a0;border-radius:12px;padding:16px 18px;margin-bottom:8px;">
      <p style="font-size:13px;color:#92610a;margin:0;line-height:1.6;">
        <strong>Was this not you?</strong> If you did not authorise this deposit or believe this is an error, please
        <a href="mailto:support@vaultchain.io" style="color:#c47d0e;font-weight:700;">contact our support team</a> immediately.
        Do not share your account details with anyone.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: FROM,
    to,
    subject: `+${amount} ${coin} deposited to your VaultChain wallet`,
    html: base("Deposit Received", body),
  });
}

export async function sendWithdrawalStatusEmail(
  to: string,
  username: string,
  amount: number,
  coin: string,
  status: "approved" | "rejected",
) {
  const isApproved = status === "approved";
  const color = isApproved ? "#15a35c" : "#e53935";
  const bg    = isApproved ? "#eafaf1" : "#fff0f0";
  const border = isApproved ? "#cdeedd" : "#ffc9c9";
  const emoji = isApproved ? "✅" : "❌";

  const body = `
    <h2 style="font-size:22px;font-weight:800;color:#0a1f17;margin:0 0 8px;letter-spacing:-0.02em;">
      Withdrawal ${isApproved ? "Approved" : "Rejected"}
    </h2>
    <p style="font-size:15px;color:#51635b;margin:0 0 24px;line-height:1.6;">
      Hey <strong style="color:#0a1f17;">${username}</strong>,
      your withdrawal request has been <strong style="color:${color};">${status}</strong>.
    </p>

    <div style="background:${bg};border:1px solid ${border};border-radius:16px;padding:28px;text-align:center;margin-bottom:24px;">
      <p style="font-size:30px;margin:0 0 12px;">${emoji}</p>
      <p style="font-size:36px;font-weight:900;color:${color};margin:0 0 6px;letter-spacing:-0.02em;">
        ${amount} ${coin}
      </p>
      <p style="font-size:13px;color:#51635b;margin:0;">
        withdrawal — <span style="color:${color};font-weight:700;">${status.toUpperCase()}</span>
      </p>
    </div>

    <p style="font-size:13px;color:#7b8c84;margin:0;text-align:center;line-height:1.7;">
      ${isApproved
        ? "Your funds are on their way. Processing times vary by network."
        : "Your withdrawal was not approved. Please contact support if you have questions."
      }
    </p>
  `;

  await transporter.sendMail({
    from: FROM,
    to,
    subject: `Withdrawal ${status}: ${amount} ${coin}`,
    html: base(`Withdrawal ${status}`, body),
  });
}
