import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || "SecureChain <noreply@securechain.app>";

/* ─────────────────────────────────────────
   Fully dark premium email layout.
   SVG is intentionally avoided — Gmail strips inline SVG.
   Logo uses the hosted PNG at securechain.app/pwa-192x192.png.
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
<body style="margin:0;padding:0;background:#0b1610;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

<!-- Preheader -->
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#0b1610;">
  ${preheader}&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;
</div>

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0b1610;">
<tr><td align="center" style="padding:40px 16px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">

  <!-- ── Header ── -->
  <tr><td style="background:linear-gradient(150deg,#062912 0%,#0d4a22 50%,#15a35c 100%);border-radius:20px 20px 0 0;padding:28px 36px 26px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td valign="middle">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="vertical-align:middle;">
                <img src="https://securechain.app/pwa-192x192.png" width="38" height="38" alt="SecureChain" style="display:block;border-radius:10px;border:0;" />
              </td>
              <td style="padding-left:11px;vertical-align:middle;">
                <span style="font-size:18px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">SecureChain</span>
              </td>
            </tr>
          </table>
        </td>
        <td align="right" valign="middle">
          <span style="font-size:10.5px;font-weight:600;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:0.12em;">Secure &amp; Private</span>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- ── Dark body card ── -->
  <tr><td style="background:#0f1d14;border-left:1px solid #1e3024;border-right:1px solid #1e3024;padding:36px 36px 32px;">
    ${body}
  </td></tr>

  <!-- ── Footer ── -->
  <tr><td style="background:#0c1810;border:1px solid #1e3024;border-top:none;border-radius:0 0 20px 20px;padding:20px 36px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td>
          <p style="margin:0;font-size:12px;color:#3d6b50;line-height:1.6;">© ${new Date().getFullYear()} SecureChain. All rights reserved.</p>
          <p style="margin:3px 0 0;font-size:11px;color:#2e5040;line-height:1.6;">Your crypto, your control.</p>
        </td>
        <td align="right" valign="middle">
          <img src="https://securechain.app/pwa-192x192.png" width="26" height="26" alt="SC" style="display:block;border-radius:7px;border:0;opacity:0.6;" />
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- ── Disclaimer ── -->
  <tr><td style="padding:18px 0 0;text-align:center;">
    <p style="font-size:11px;color:#2e5040;margin:0;line-height:1.7;">
      If you didn't request this email, no action is needed — you can safely ignore it.<br/>
      This message was sent because your email is registered with SecureChain.
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

/* OTP digit boxes — dark themed */
function otpBoxes(code: string) {
  const cells = code.split("").map((d, i) =>
    `<td style="width:52px;height:62px;background:#0c1a10;border:2px solid #15a35c;border-radius:12px;text-align:center;vertical-align:middle;font-size:30px;font-weight:900;color:#15a35c;font-family:Courier,monospace;">${d}</td>${i < 5 ? '<td style="width:7px;"></td>' : ''}`
  ).join("");
  return `<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr>${cells}</tr></table>`;
}

/* Divider */
const DIVIDER = `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0;"><tr><td style="border-top:1px solid #1e3024;"></td></tr></table>`;

/* ─── Email senders ─────────────────── */

export async function sendVerificationEmail(to: string, username: string, code: string) {
  const body = `
    <h1 style="margin:0 0 10px;font-size:24px;font-weight:900;color:#e4f0e8;letter-spacing:-0.03em;line-height:1.2;">Verify your email</h1>
    <p style="margin:0 0 30px;font-size:14.5px;color:#6fa882;line-height:1.75;">
      Hi <strong style="color:#e4f0e8;">${username}</strong> — welcome to SecureChain. Enter the code below to activate your account.
    </p>

    ${otpBoxes(code)}

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;">
      <tr>
        <td align="center">
          <span style="font-size:12px;color:#3d6b50;">Expires in&nbsp;</span>
          <span style="font-size:12px;font-weight:700;color:#6fa882;">15 minutes</span>
          <span style="font-size:12px;color:#3d6b50;">&nbsp;·&nbsp; Never share this code</span>
        </td>
      </tr>
    </table>

    ${DIVIDER}

    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:14px 18px;background:#0c1a10;border-left:3px solid #15a35c;border-radius:0 10px 10px 0;">
          <p style="margin:0;font-size:13px;color:#6fa882;line-height:1.65;">
            Didn't create an account? Your email won't be added unless this code is used.
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
    <h1 style="margin:0 0 10px;font-size:24px;font-weight:900;color:#e4f0e8;letter-spacing:-0.03em;line-height:1.2;">Reset your password</h1>
    <p style="margin:0 0 30px;font-size:14.5px;color:#6fa882;line-height:1.75;">
      Hi <strong style="color:#e4f0e8;">${username}</strong> — use the code below to reset your password. It expires in 15 minutes.
    </p>

    ${otpBoxes(code)}

    <p style="margin:18px 0 0;font-size:12px;color:#3d6b50;text-align:center;">One-time code · Do not share</p>

    ${DIVIDER}

    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:14px 18px;background:#1a130a;border-left:3px solid #f59e0b;border-radius:0 10px 10px 0;">
          <p style="margin:0;font-size:13px;color:#b8852a;line-height:1.65;">
            <strong style="color:#d4a040;">Didn't request this?</strong> Your password has not been changed. Contact
            <a href="mailto:support@securechain.app" style="color:#d4a040;font-weight:700;text-decoration:none;">support@securechain.app</a> if you're concerned.
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
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:900;color:#e4f0e8;letter-spacing:-0.03em;line-height:1.2;">Deposit Confirmed</h1>
    <p style="margin:0 0 28px;font-size:14.5px;color:#6fa882;line-height:1.75;">
      Hi <strong style="color:#e4f0e8;">${username}</strong> — your wallet has been credited. The funds are now available in your balance.
    </p>

    <!-- Amount hero card -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:26px;">
      <tr>
        <td style="background:linear-gradient(150deg,#062912,#0d4a22);border:1px solid #1e5a30;border-radius:18px;padding:30px 24px;text-align:center;">

          <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 18px;">
            <tr>
              <td style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.14);border-radius:99px;padding:5px 16px;">
                <span style="font-size:11.5px;font-weight:700;color:rgba(255,255,255,0.85);text-transform:uppercase;letter-spacing:0.12em;">${coin}&nbsp;·&nbsp;${network}</span>
              </td>
            </tr>
          </table>

          <p style="margin:0;font-size:54px;font-weight:900;color:#ffffff;line-height:1;letter-spacing:-0.03em;">+${amount}</p>
          <p style="margin:7px 0 0;font-size:16px;font-weight:700;color:rgba(255,255,255,0.65);">${coin}</p>

          ${fmtUsd ? `
          <table cellpadding="0" cellspacing="0" border="0" style="margin:14px auto 0;">
            <tr>
              <td style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.10);border-radius:8px;padding:7px 18px;text-align:center;">
                <span style="font-size:13px;font-weight:600;color:rgba(255,255,255,0.5);">≈&nbsp;</span>
                <span style="font-size:15px;font-weight:800;color:#ffffff;">$${fmtUsd} USD</span>
              </td>
            </tr>
          </table>` : ""}

          <table cellpadding="0" cellspacing="0" border="0" style="margin:18px auto 0;">
            <tr>
              <td style="background:#15a35c;border-radius:99px;padding:7px 22px;">
                <span style="font-size:12px;font-weight:800;color:#ffffff;text-transform:uppercase;letter-spacing:0.08em;">&#10003;&nbsp; Credited to Wallet</span>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>

    ${DIVIDER}

    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:14px 18px;background:#1a130a;border-left:3px solid #f59e0b;border-radius:0 10px 10px 0;">
          <p style="margin:0;font-size:13px;color:#b8852a;line-height:1.65;">
            <strong style="color:#d4a040;">Wasn't you?</strong> Contact
            <a href="mailto:support@securechain.app" style="color:#d4a040;font-weight:700;text-decoration:none;">support@securechain.app</a>
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

  const statusBg     = isApproved ? "linear-gradient(150deg,#062912,#0d4a22)" : "linear-gradient(150deg,#1f0606,#4a0d0d)";
  const statusBorder = isApproved ? "#1e5a30" : "#5a1e1e";
  const badgeBg      = isApproved ? "#15a35c" : "#e03e3e";
  const statusLabel  = isApproved ? "Approved" : "Rejected";
  const statusSymbol = isApproved ? "&#10003;" : "&#10005;";

  const noticeBg     = isApproved ? "#0c1a10" : "#1a0c0c";
  const noticeBorder = isApproved ? "#15a35c" : "#e03e3e";
  const noticeColor  = isApproved ? "#6fa882" : "#e08080";
  const noticeText   = isApproved
    ? "Your funds are on the way. Transfer times vary by network — typically 10–60 minutes."
    : `Your withdrawal was not approved. Contact <a href="mailto:support@securechain.app" style="color:#e08080;font-weight:700;text-decoration:none;">support@securechain.app</a> if you believe this is an error.`;

  const body = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:900;color:#e4f0e8;letter-spacing:-0.03em;line-height:1.2;">Withdrawal ${statusLabel}</h1>
    <p style="margin:0 0 28px;font-size:14.5px;color:#6fa882;line-height:1.75;">
      Hi <strong style="color:#e4f0e8;">${username}</strong> — your withdrawal request has been reviewed.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:26px;">
      <tr>
        <td style="background:${statusBg};border:1px solid ${statusBorder};border-radius:18px;padding:30px 24px;text-align:center;">

          <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 18px;">
            <tr>
              <td style="background:${badgeBg};border-radius:99px;padding:6px 20px;">
                <span style="font-size:12px;font-weight:800;color:#ffffff;text-transform:uppercase;letter-spacing:0.08em;">${statusSymbol}&nbsp; ${statusLabel}</span>
              </td>
            </tr>
          </table>

          <p style="margin:0;font-size:54px;font-weight:900;color:#ffffff;line-height:1;letter-spacing:-0.03em;">${amount}</p>
          <p style="margin:7px 0 0;font-size:16px;font-weight:700;color:rgba(255,255,255,0.65);">${coin}</p>

        </td>
      </tr>
    </table>

    ${DIVIDER}

    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:14px 18px;background:${noticeBg};border-left:3px solid ${noticeBorder};border-radius:0 10px 10px 0;">
          <p style="margin:0;font-size:13px;color:${noticeColor};line-height:1.65;">${noticeText}</p>
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
