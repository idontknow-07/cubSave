import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || "SecureChain <onboarding@resend.dev>";

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" width="20" height="20" style="display:block;margin:10px auto;"><path d="M12 2.6 20 7V17L12 21.4 4 17V7Z"/><circle cx="12" cy="11" r="1.9"/><path d="M12 12.9V15.4"/></svg>`;

function base(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f0f5f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f5f2;padding:44px 20px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

      <!-- Logo -->
      <tr><td style="padding-bottom:24px;text-align:center;">
        <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
          <tr>
            <td style="width:42px;height:42px;background:linear-gradient(135deg,#15a35c,#047857);border-radius:11px;text-align:center;vertical-align:middle;">
              ${LOGO_SVG}
            </td>
            <td style="padding-left:11px;vertical-align:middle;">
              <span style="font-size:20px;font-weight:800;color:#0a1f17;letter-spacing:-0.03em;">Secure<span style="color:#15a35c;">Chain</span></span>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- Card -->
      <tr><td style="background:#ffffff;border:1px solid #dde8e2;border-radius:22px;padding:44px 40px;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
        ${body}
      </td></tr>

      <!-- Footer -->
      <tr><td style="padding-top:26px;text-align:center;">
        <p style="font-size:12px;color:#91a89e;margin:0;line-height:1.6;">© ${new Date().getFullYear()} SecureChain · The most secure way to trade.</p>
        <p style="font-size:11.5px;color:#aabcb5;margin:5px 0 0;">If you didn't request this email, you can safely ignore it.</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function otpBoxes(code: string) {
  const cells = code.split("").map((d, i) =>
    `<td style="width:50px;height:60px;background:#f2fbf6;border:2px solid #b8dfc8;border-radius:12px;text-align:center;vertical-align:middle;font-size:30px;font-weight:900;color:#15a35c;font-family:monospace,monospace;">${d}</td>${i < 5 ? '<td style="width:8px;"></td>' : ''}`
  ).join("");
  return `<table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr>${cells}</tr></table>`;
}

export async function sendVerificationEmail(to: string, username: string, code: string) {
  const body = `
    <h2 style="font-size:23px;font-weight:800;color:#0a1f17;margin:0 0 8px;letter-spacing:-0.02em;">Verify your email</h2>
    <p style="font-size:15px;color:#4a6358;margin:0 0 32px;line-height:1.65;">
      Hey <strong style="color:#0a1f17;">${username}</strong> — enter this code to confirm your SecureChain account.
    </p>

    ${otpBoxes(code)}

    <p style="font-size:12.5px;color:#91a89e;text-align:center;margin:18px 0 32px;line-height:1.6;">
      Expires in <strong style="color:#4a6358;">15 minutes</strong> &nbsp;·&nbsp; Never share this code with anyone
    </p>

    <div style="background:#f7fdf9;border:1px solid #ddefea;border-radius:14px;padding:16px 20px;">
      <p style="font-size:13px;color:#4a6358;margin:0;line-height:1.6;text-align:center;">
        Didn't sign up? You can safely ignore this email — your address won't be added.
      </p>
    </div>
  `;

  await resend.emails.send({
    from: FROM,
    to,
    subject: `${code} is your SecureChain verification code`,
    html: base("Verify your email", body),
  });
}

export async function sendPasswordResetEmail(to: string, username: string, code: string) {
  const body = `
    <h2 style="font-size:23px;font-weight:800;color:#0a1f17;margin:0 0 8px;letter-spacing:-0.02em;">Reset your password</h2>
    <p style="font-size:15px;color:#4a6358;margin:0 0 32px;line-height:1.65;">
      Hey <strong style="color:#0a1f17;">${username}</strong> — use this code to reset your SecureChain password.
    </p>

    ${otpBoxes(code)}

    <p style="font-size:12.5px;color:#91a89e;text-align:center;margin:18px 0 32px;line-height:1.6;">
      Expires in <strong style="color:#4a6358;">15 minutes</strong>
    </p>

    <div style="background:#fff8ed;border:1px solid #fde4a0;border-radius:14px;padding:16px 20px;">
      <p style="font-size:13px;color:#92610a;margin:0;line-height:1.6;">
        <strong>Didn't request this?</strong> Your password hasn't changed. If you're concerned, contact
        <a href="mailto:support@securechain.io" style="color:#c47d0e;font-weight:700;">support</a> right away.
      </p>
    </div>
  `;

  await resend.emails.send({
    from: FROM,
    to,
    subject: `${code} — Reset your SecureChain password`,
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
    ? `<p style="font-size:14px;color:#4a6358;margin:8px 0 0;text-align:center;">≈ <strong style="color:#0a1f17;">$${usdValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</strong></p>`
    : "";

  const body = `
    <h2 style="font-size:23px;font-weight:800;color:#0a1f17;margin:0 0 8px;letter-spacing:-0.02em;">Deposit Received</h2>
    <p style="font-size:15px;color:#4a6358;margin:0 0 28px;line-height:1.65;">
      Hey <strong style="color:#0a1f17;">${username}</strong> — your wallet has been credited successfully.
    </p>

    <!-- Amount card -->
    <div style="border:1.5px solid #c8e8d5;border-radius:18px;padding:32px 24px;text-align:center;margin-bottom:28px;background:#fafffe;">
      <table cellpadding="0" cellspacing="0" style="margin:0 auto 18px;">
        <tr>
          <td style="background:#eafaf1;border:1px solid #c8e8d5;border-radius:8px;padding:4px 14px;font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#15a35c;white-space:nowrap;">
            ${coin} &nbsp;·&nbsp; ${network}
          </td>
        </tr>
      </table>
      <p style="font-size:52px;font-weight:900;color:#15a35c;margin:0;line-height:1;letter-spacing:-0.02em;">+${amount}</p>
      <p style="font-size:16px;font-weight:700;color:#4a6358;margin:8px 0 0;">${coin}</p>
      ${usdLine}
      <p style="font-size:13px;color:#91a89e;margin:14px 0 0;">deposited to your wallet</p>
    </div>

    <div style="background:#fff8ed;border:1px solid #fde4a0;border-radius:14px;padding:16px 20px;">
      <p style="font-size:13px;color:#92610a;margin:0;line-height:1.6;">
        <strong>Wasn't you?</strong> Contact <a href="mailto:support@securechain.io" style="color:#c47d0e;font-weight:700;">support immediately</a> and do not share your account details with anyone.
      </p>
    </div>
  `;

  await resend.emails.send({
    from: FROM,
    to,
    subject: `+${amount} ${coin} deposited to your SecureChain wallet`,
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
  const accent = isApproved ? "#15a35c" : "#e03e3e";
  const cardBg = isApproved ? "#fafffe" : "#fffafa";
  const cardBorder = isApproved ? "#c8e8d5" : "#f5c6c6";
  const tagBg = isApproved ? "#eafaf1" : "#fff0f0";
  const tagBorder = isApproved ? "#c8e8d5" : "#f5c6c6";
  const statusLabel = isApproved ? "Approved" : "Rejected";
  const note = isApproved
    ? "Your funds are on their way. Processing time varies by network."
    : `Your withdrawal was not approved. <a href="mailto:support@securechain.io" style="color:#15a35c;font-weight:700;">Contact support</a> if you have questions.`;

  const body = `
    <h2 style="font-size:23px;font-weight:800;color:#0a1f17;margin:0 0 8px;letter-spacing:-0.02em;">Withdrawal ${statusLabel}</h2>
    <p style="font-size:15px;color:#4a6358;margin:0 0 28px;line-height:1.65;">
      Hey <strong style="color:#0a1f17;">${username}</strong> — your withdrawal request has been <strong style="color:${accent};">${status}</strong>.
    </p>

    <!-- Amount card -->
    <div style="border:1.5px solid ${cardBorder};border-radius:18px;padding:32px 24px;text-align:center;margin-bottom:28px;background:${cardBg};">
      <table cellpadding="0" cellspacing="0" style="margin:0 auto 18px;">
        <tr>
          <td style="background:${tagBg};border:1px solid ${tagBorder};border-radius:8px;padding:4px 16px;font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:${accent};">
            ${statusLabel}
          </td>
        </tr>
      </table>
      <p style="font-size:52px;font-weight:900;color:${accent};margin:0;line-height:1;letter-spacing:-0.02em;">${amount}</p>
      <p style="font-size:16px;font-weight:700;color:#4a6358;margin:8px 0 0;">${coin}</p>
    </div>

    <p style="font-size:14px;color:#4a6358;text-align:center;margin:0;line-height:1.7;">${note}</p>
  `;

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Withdrawal ${status}: ${amount} ${coin} — SecureChain`,
    html: base(`Withdrawal ${statusLabel}`, body),
  });
}
