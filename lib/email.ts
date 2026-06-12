import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || "SecureChain <noreply@securechain.app>";

/* ─────────────────────────────────────────
   Premium dark email — pure black base,
   vivid green accents, clean typography.
   Gmail-safe: no SVG, all inline styles.
───────────────────────────────────────── */
function base(title: string, preheader: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="x-apple-disable-message-reformatting"/>
<meta name="color-scheme" content="dark"/>
<title>${title}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background:#000000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

<!-- Preheader (hidden) -->
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#000000;">
  ${preheader}&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;
</div>

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#000000;">
<tr><td align="center" style="padding:32px 16px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">

  <!-- ── Header ── -->
  <tr><td style="background:linear-gradient(140deg,#071a0e 0%,#0b3019 45%,#0f7a3d 100%);border-radius:18px 18px 0 0;padding:26px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td valign="middle">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="vertical-align:middle;">
                <img src="https://securechain.app/pwa-192x192.png" width="36" height="36" alt="SC" style="display:block;border-radius:9px;border:0;" />
              </td>
              <td style="padding-left:10px;vertical-align:middle;">
                <span style="font-size:17px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">SecureChain</span>
              </td>
            </tr>
          </table>
        </td>
        <td align="right" valign="middle">
          <span style="font-size:10px;font-weight:700;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.14em;">Secure &amp; Private</span>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- ── Body card ── -->
  <tr><td style="background:#0d0d0d;border-left:1px solid #1f1f1f;border-right:1px solid #1f1f1f;padding:36px 32px 32px;">
    ${body}
  </td></tr>

  <!-- ── Footer ── -->
  <tr><td style="background:#080808;border:1px solid #1a1a1a;border-top:none;border-radius:0 0 18px 18px;padding:20px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td>
          <p style="margin:0;font-size:12px;color:#3a3a3a;line-height:1.6;">© ${new Date().getFullYear()} SecureChain. All rights reserved.</p>
          <p style="margin:3px 0 0;font-size:11px;color:#2e2e2e;line-height:1.6;">Your crypto, your control.</p>
        </td>
        <td align="right" valign="middle">
          <img src="https://securechain.app/pwa-192x192.png" width="24" height="24" alt="SC" style="display:block;border-radius:6px;border:0;opacity:0.4;" />
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- ── Disclaimer ── -->
  <tr><td style="padding:16px 0 0;text-align:center;">
    <p style="font-size:11px;color:#2a2a2a;margin:0;line-height:1.7;">
      If you didn't request this email, you can safely ignore it.<br/>
      Sent because your email is registered with SecureChain.
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
    `<td style="width:50px;height:60px;background:#111111;border:1.5px solid #15a35c;border-radius:11px;text-align:center;vertical-align:middle;font-size:28px;font-weight:900;color:#15a35c;font-family:Courier,monospace;">${d}</td>${i < 5 ? '<td style="width:8px;"></td>' : ''}`
  ).join("");
  return `<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr>${cells}</tr></table>`;
}

/* Divider */
const DIVIDER = `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0;"><tr><td style="border-top:1px solid #1e1e1e;"></td></tr></table>`;

/* ─── Email senders ─────────────────── */

export async function sendVerificationEmail(to: string, username: string, code: string) {
  const body = `
    <h1 style="margin:0 0 10px;font-size:22px;font-weight:900;color:#f0f0f0;letter-spacing:-0.03em;line-height:1.25;">Verify your email</h1>
    <p style="margin:0 0 30px;font-size:14px;color:#888888;line-height:1.8;">
      Hi <strong style="color:#e8e8e8;">${username}</strong> — welcome to SecureChain. Enter the code below to activate your account.
    </p>

    ${otpBoxes(code)}

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:18px 0;">
      <tr>
        <td align="center">
          <span style="font-size:12px;color:#444444;">Expires in&nbsp;</span>
          <span style="font-size:12px;font-weight:700;color:#15a35c;">15 minutes</span>
          <span style="font-size:12px;color:#444444;">&nbsp;·&nbsp; Never share this code</span>
        </td>
      </tr>
    </table>

    ${DIVIDER}

    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:14px 18px;background:#111111;border-left:3px solid #15a35c;border-radius:0 10px 10px 0;">
          <p style="margin:0;font-size:13px;color:#666666;line-height:1.65;">
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
    <h1 style="margin:0 0 10px;font-size:22px;font-weight:900;color:#f0f0f0;letter-spacing:-0.03em;line-height:1.25;">Reset your password</h1>
    <p style="margin:0 0 30px;font-size:14px;color:#888888;line-height:1.8;">
      Hi <strong style="color:#e8e8e8;">${username}</strong> — use the code below to reset your password. It expires in 15 minutes.
    </p>

    ${otpBoxes(code)}

    <p style="margin:16px 0 0;font-size:12px;color:#444444;text-align:center;">One-time code · Do not share</p>

    ${DIVIDER}

    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:14px 18px;background:#111111;border-left:3px solid #f59e0b;border-radius:0 10px 10px 0;">
          <p style="margin:0;font-size:13px;color:#888888;line-height:1.65;">
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
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:900;color:#f0f0f0;letter-spacing:-0.03em;line-height:1.25;">Deposit Confirmed</h1>
    <p style="margin:0 0 28px;font-size:14px;color:#888888;line-height:1.8;">
      Hi <strong style="color:#e8e8e8;">${username}</strong> — your wallet has been credited. The funds are now available in your balance.
    </p>

    <!-- Amount hero card -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
      <tr>
        <td style="background:#111111;border:1px solid #222222;border-radius:18px;padding:32px 24px;text-align:center;">

          <!-- Coin badge -->
          <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 20px;">
            <tr>
              <td style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:99px;padding:5px 18px;">
                <span style="font-size:11px;font-weight:700;color:#aaaaaa;text-transform:uppercase;letter-spacing:0.14em;">${coin}&nbsp;·&nbsp;${network}</span>
              </td>
            </tr>
          </table>

          <!-- Amount -->
          <p style="margin:0;font-size:56px;font-weight:900;color:#ffffff;line-height:1;letter-spacing:-0.03em;">+${amount}</p>
          <p style="margin:8px 0 0;font-size:15px;font-weight:700;color:#555555;">${coin}</p>

          ${fmtUsd ? `
          <!-- USD value -->
          <table cellpadding="0" cellspacing="0" border="0" style="margin:16px auto 0;">
            <tr>
              <td style="background:#161616;border:1px solid #252525;border-radius:8px;padding:7px 18px;">
                <span style="font-size:12px;color:#555555;">≈&nbsp;</span>
                <span style="font-size:14px;font-weight:800;color:#cccccc;">$${fmtUsd} USD</span>
              </td>
            </tr>
          </table>` : ""}

          <!-- Status badge -->
          <table cellpadding="0" cellspacing="0" border="0" style="margin:20px auto 0;">
            <tr>
              <td style="background:#15a35c;border-radius:99px;padding:7px 22px;">
                <span style="font-size:11.5px;font-weight:800;color:#ffffff;text-transform:uppercase;letter-spacing:0.10em;">&#10003;&nbsp; Credited to Wallet</span>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>

    ${DIVIDER}

    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:14px 18px;background:#111111;border-left:3px solid #f59e0b;border-radius:0 10px 10px 0;">
          <p style="margin:0;font-size:13px;color:#888888;line-height:1.65;">
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

  const cardBg     = isApproved ? "#0a1f0e" : "#1a0808";
  const cardBorder = isApproved ? "#1a3520" : "#2e1010";
  const badgeBg    = isApproved ? "#15a35c" : "#dc2626";
  const statusLabel = isApproved ? "Approved" : "Rejected";
  const statusSymbol = isApproved ? "&#10003;" : "&#10005;";

  const noticeBorder = isApproved ? "#15a35c" : "#dc2626";
  const noticeText   = isApproved
    ? "Your funds are on the way. Transfer times vary by network — typically 10–60 minutes."
    : `Your withdrawal was not approved. Contact <a href="mailto:support@securechain.app" style="color:#f87171;font-weight:700;text-decoration:none;">support@securechain.app</a> if you believe this is an error.`;
  const noticeColor  = isApproved ? "#666666" : "#888888";

  const body = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:900;color:#f0f0f0;letter-spacing:-0.03em;line-height:1.25;">Withdrawal ${statusLabel}</h1>
    <p style="margin:0 0 28px;font-size:14px;color:#888888;line-height:1.8;">
      Hi <strong style="color:#e8e8e8;">${username}</strong> — your withdrawal request has been reviewed.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
      <tr>
        <td style="background:${cardBg};border:1px solid ${cardBorder};border-radius:18px;padding:32px 24px;text-align:center;">

          <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 20px;">
            <tr>
              <td style="background:${badgeBg};border-radius:99px;padding:6px 22px;">
                <span style="font-size:11.5px;font-weight:800;color:#ffffff;text-transform:uppercase;letter-spacing:0.10em;">${statusSymbol}&nbsp; ${statusLabel}</span>
              </td>
            </tr>
          </table>

          <p style="margin:0;font-size:56px;font-weight:900;color:#ffffff;line-height:1;letter-spacing:-0.03em;">${amount}</p>
          <p style="margin:8px 0 0;font-size:15px;font-weight:700;color:#555555;">${coin}</p>

        </td>
      </tr>
    </table>

    ${DIVIDER}

    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:14px 18px;background:#111111;border-left:3px solid ${noticeBorder};border-radius:0 10px 10px 0;">
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
