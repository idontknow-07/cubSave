import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || "SecureChain <noreply@securechain.app>";

/* ─────────────────────────────────────────
   Base layout — dark gradient header,
   white card body, clean footer.
   SVG is intentionally avoided — Gmail strips it.
   Logo mark uses a styled table cell with text.
───────────────────────────────────────── */
function base(title: string, preheader: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="x-apple-disable-message-reformatting"/>
<title>${title}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background:#f0f4f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

<!-- Preheader (hidden preview text in inbox) -->
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#f0f4f2;">
  ${preheader}&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;
</div>

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0f4f2;">
<tr><td align="center" style="padding:44px 16px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:540px;">

  <!-- ── Header card ── -->
  <tr><td style="background:linear-gradient(150deg,#062912 0%,#0d4a22 50%,#15a35c 100%);border-radius:20px 20px 0 0;padding:36px 40px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td valign="middle">
          <!-- Logo mark -->
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="width:40px;height:40px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);border-radius:11px;text-align:center;vertical-align:middle;">
                <span style="font-size:16px;font-weight:900;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;line-height:40px;display:block;letter-spacing:-0.04em;">SC</span>
              </td>
              <td style="padding-left:12px;vertical-align:middle;">
                <span style="font-size:19px;font-weight:800;color:#ffffff;letter-spacing:-0.03em;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">SecureChain</span>
              </td>
            </tr>
          </table>
        </td>
        <td align="right" valign="middle">
          <span style="font-size:11px;font-weight:600;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.1em;">Secure &amp; Private</span>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- ── White body card ── -->
  <tr><td style="background:#ffffff;padding:40px 40px 36px;border-left:1px solid #dde8e2;border-right:1px solid #dde8e2;">
    ${body}
  </td></tr>

  <!-- ── Footer strip ── -->
  <tr><td style="background:#f8faf8;border:1px solid #dde8e2;border-top:none;border-radius:0 0 20px 20px;padding:24px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td>
          <p style="margin:0;font-size:12px;color:#8fa898;line-height:1.6;">© ${new Date().getFullYear()} SecureChain. All rights reserved.</p>
          <p style="margin:4px 0 0;font-size:11.5px;color:#a8b8af;line-height:1.6;">Your crypto, your control.</p>
        </td>
        <td align="right" valign="middle">
          <span style="display:inline-block;width:28px;height:28px;background:linear-gradient(135deg,#15a35c,#047857);border-radius:8px;text-align:center;line-height:28px;font-size:11px;font-weight:900;color:#ffffff;letter-spacing:-0.03em;font-family:-apple-system,sans-serif;">SC</span>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- ── Disclaimer ── -->
  <tr><td style="padding:20px 0 0;text-align:center;">
    <p style="font-size:11px;color:#b0bcb8;margin:0;line-height:1.7;">
      If you didn't request this email, no action is needed — you can safely ignore it.<br/>
      This message was sent to you because your email is registered with SecureChain.
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

/* OTP digit boxes */
function otpBoxes(code: string) {
  const cells = code.split("").map((d, i) =>
    `<td style="width:54px;height:64px;background:#f4fdf8;border:2px solid #15a35c;border-radius:13px;text-align:center;vertical-align:middle;font-size:32px;font-weight:900;color:#15a35c;font-family:Courier,monospace;">${d}</td>${i < 5 ? '<td style="width:8px;"></td>' : ''}`
  ).join("");
  return `<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr>${cells}</tr></table>`;
}

/* Divider */
const DIVIDER = `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0;"><tr><td style="border-top:1px solid #eef2f0;"></td></tr></table>`;

/* ─── Email senders ─────────────────── */

export async function sendVerificationEmail(to: string, username: string, code: string) {
  const body = `
    <!-- Title -->
    <h1 style="margin:0 0 10px;font-size:26px;font-weight:900;color:#0a1f17;letter-spacing:-0.03em;line-height:1.2;">Verify your email</h1>
    <p style="margin:0 0 32px;font-size:15px;color:#4a6358;line-height:1.7;">
      Hi <strong style="color:#0a1f17;">${username}</strong> — welcome to SecureChain. Enter the code below to activate your account.
    </p>

    <!-- OTP -->
    ${otpBoxes(code)}

    <!-- Expiry note -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0;">
      <tr>
        <td align="center">
          <span style="font-size:12.5px;color:#8fa898;">Expires in&nbsp;</span>
          <span style="font-size:12.5px;font-weight:700;color:#4a6358;">15 minutes</span>
          <span style="font-size:12.5px;color:#8fa898;">&nbsp;·&nbsp; Never share this code</span>
        </td>
      </tr>
    </table>

    ${DIVIDER}

    <!-- Safety note -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:16px 20px;background:#f8faf8;border-left:3px solid #15a35c;border-radius:0 10px 10px 0;">
          <p style="margin:0;font-size:13px;color:#4a6358;line-height:1.65;">
            Didn't create an account? This email was sent because someone entered your address on SecureChain. Your email won't be added unless this code is used.
          </p>
        </td>
      </tr>
    </table>
  `;

  await resend.emails.send({
    from: FROM,
    to,
    subject: `${code} — Your SecureChain verification code`,
    html: base("Verify your email", `Your verification code is ${code}`, body),
  });
}

export async function sendPasswordResetEmail(to: string, username: string, code: string) {
  const body = `
    <!-- Title -->
    <h1 style="margin:0 0 10px;font-size:26px;font-weight:900;color:#0a1f17;letter-spacing:-0.03em;line-height:1.2;">Reset your password</h1>
    <p style="margin:0 0 32px;font-size:15px;color:#4a6358;line-height:1.7;">
      Hi <strong style="color:#0a1f17;">${username}</strong> — use the code below to reset your password. It expires in 15 minutes.
    </p>

    <!-- OTP -->
    ${otpBoxes(code)}

    <p style="margin:20px 0 0;font-size:12.5px;color:#8fa898;text-align:center;">One-time code · Do not share</p>

    ${DIVIDER}

    <!-- Warning -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:16px 20px;background:#fffbf0;border-left:3px solid #f59e0b;border-radius:0 10px 10px 0;">
          <p style="margin:0;font-size:13px;color:#92610a;line-height:1.65;">
            <strong>Didn't request this?</strong> Your password has not been changed. If you're concerned about your account security, please contact our support team immediately.
          </p>
        </td>
      </tr>
    </table>
  `;

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Reset your SecureChain password`,
    html: base("Reset your password", "A password reset was requested for your account", body),
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
  const fmtUsd = usdValue != null
    ? usdValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : null;

  const body = `
    <!-- Title -->
    <h1 style="margin:0 0 10px;font-size:26px;font-weight:900;color:#0a1f17;letter-spacing:-0.03em;line-height:1.2;">Deposit Confirmed</h1>
    <p style="margin:0 0 32px;font-size:15px;color:#4a6358;line-height:1.7;">
      Hi <strong style="color:#0a1f17;">${username}</strong> — your wallet has been credited. The funds are now available in your balance.
    </p>

    <!-- Amount hero card -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
      <tr>
        <td style="background:linear-gradient(150deg,#062912,#0d4a22);border-radius:16px;padding:32px 24px;text-align:center;">

          <!-- Coin + network badge -->
          <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 20px;">
            <tr>
              <td style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.18);border-radius:99px;padding:6px 18px;">
                <span style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.9);text-transform:uppercase;letter-spacing:0.12em;">${coin} &nbsp;·&nbsp; ${network}</span>
              </td>
            </tr>
          </table>

          <!-- Amount -->
          <p style="margin:0;font-size:58px;font-weight:900;color:#ffffff;line-height:1;letter-spacing:-0.03em;">+${amount}</p>
          <p style="margin:8px 0 0;font-size:18px;font-weight:700;color:rgba(255,255,255,0.75);">${coin}</p>

          ${fmtUsd ? `
          <!-- USD value -->
          <table cellpadding="0" cellspacing="0" border="0" style="margin:16px auto 0;">
            <tr>
              <td style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:8px 20px;text-align:center;">
                <span style="font-size:14px;font-weight:600;color:rgba(255,255,255,0.6);">≈&nbsp;</span>
                <span style="font-size:16px;font-weight:800;color:#ffffff;">$${fmtUsd} USD</span>
              </td>
            </tr>
          </table>` : ""}

          <!-- Status badge -->
          <table cellpadding="0" cellspacing="0" border="0" style="margin:20px auto 0;">
            <tr>
              <td style="background:#15a35c;border-radius:99px;padding:6px 20px;">
                <span style="font-size:12px;font-weight:800;color:#ffffff;text-transform:uppercase;letter-spacing:0.08em;">&#10003;&nbsp; Credited to wallet</span>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>

    ${DIVIDER}

    <!-- Security notice -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:16px 20px;background:#fff8f0;border-left:3px solid #f59e0b;border-radius:0 10px 10px 0;">
          <p style="margin:0;font-size:13px;color:#92610a;line-height:1.65;">
            <strong>Wasn't you?</strong> If you did not initiate this deposit, contact
            <a href="mailto:support@securechain.app" style="color:#c47d0e;font-weight:700;text-decoration:none;">support@securechain.app</a>
            immediately and secure your account.
          </p>
        </td>
      </tr>
    </table>
  `;

  await resend.emails.send({
    from: FROM,
    to,
    subject: `+${amount} ${coin} credited to your SecureChain wallet`,
    html: base("Deposit Confirmed", `${amount} ${coin} has been added to your wallet`, body),
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

  const statusColor  = isApproved ? "#15a35c" : "#e03e3e";
  const statusBg     = isApproved ? "linear-gradient(150deg,#062912,#0d4a22)" : "linear-gradient(150deg,#1f0606,#4a0d0d)";
  const badgeBg      = isApproved ? "#15a35c" : "#e03e3e";
  const statusLabel  = isApproved ? "Approved" : "Rejected";
  const statusSymbol = isApproved ? "&#10003;" : "&#10005;";

  const noticeStyle = isApproved
    ? "background:#f4fdf8;border-left:3px solid #15a35c;"
    : "background:#fff4f4;border-left:3px solid #e03e3e;";
  const noticeTextColor = isApproved ? "#2a6348" : "#922020";
  const noticeText = isApproved
    ? "Your funds are on the way. Transfer times vary by network — typically 10–60 minutes."
    : `Your withdrawal request was not approved. Please contact <a href="mailto:support@securechain.app" style="color:${statusColor};font-weight:700;text-decoration:none;">support@securechain.app</a> if you believe this is an error.`;

  const body = `
    <!-- Title -->
    <h1 style="margin:0 0 10px;font-size:26px;font-weight:900;color:#0a1f17;letter-spacing:-0.03em;line-height:1.2;">Withdrawal ${statusLabel}</h1>
    <p style="margin:0 0 32px;font-size:15px;color:#4a6358;line-height:1.7;">
      Hi <strong style="color:#0a1f17;">${username}</strong> — your withdrawal request has been reviewed.
    </p>

    <!-- Amount hero card -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
      <tr>
        <td style="background:${statusBg};border-radius:16px;padding:32px 24px;text-align:center;">

          <!-- Status badge -->
          <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 20px;">
            <tr>
              <td style="background:${badgeBg};border-radius:99px;padding:6px 20px;">
                <span style="font-size:12px;font-weight:800;color:#ffffff;text-transform:uppercase;letter-spacing:0.08em;">${statusSymbol}&nbsp; ${statusLabel}</span>
              </td>
            </tr>
          </table>

          <!-- Amount -->
          <p style="margin:0;font-size:58px;font-weight:900;color:#ffffff;line-height:1;letter-spacing:-0.03em;">${amount}</p>
          <p style="margin:8px 0 0;font-size:18px;font-weight:700;color:rgba(255,255,255,0.75);">${coin}</p>

        </td>
      </tr>
    </table>

    ${DIVIDER}

    <!-- Notice -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:16px 20px;${noticeStyle}border-radius:0 10px 10px 0;">
          <p style="margin:0;font-size:13px;color:${noticeTextColor};line-height:1.65;">${noticeText}</p>
        </td>
      </tr>
    </table>
  `;

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Withdrawal ${statusLabel}: ${amount} ${coin} — SecureChain`,
    html: base(`Withdrawal ${statusLabel}`, `Your ${amount} ${coin} withdrawal has been ${status}`, body),
  });
}
