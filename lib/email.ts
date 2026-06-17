import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || "SecureChain <noreply@securechain.app>";

/* ─────────────────────────────────────────
   Premium light email — clean white base,
   vivid green accents, clean typography.
   Gmail-safe: forced light mode using gradient hacks.
───────────────────────────────────────── */
function base(title: string, preheader: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="x-apple-disable-message-reformatting"/>
<meta name="color-scheme" content="light only"/>
<meta name="supported-color-schemes" content="light only"/>
<title>${title}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f4faf6;background-image:linear-gradient(#f4faf6,#f4faf6);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

<!-- Preheader (hidden) -->
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#f4faf6;-webkit-text-fill-color:#f4faf6;">
  ${preheader}&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;
</div>

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4faf6;background-image:linear-gradient(#f4faf6,#f4faf6);">
<tr><td align="center" style="padding:40px 16px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;box-shadow:0 12px 32px rgba(10,31,23,0.06);border-radius:18px;">

  <!-- ── Header ── -->
  <tr><td style="background:linear-gradient(135deg,#15a35c 0%,#047857 100%);border-radius:18px 18px 0 0;padding:26px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td valign="middle">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="vertical-align:middle;">
                <img src="https://securechain.app/pwa-192x192.png" width="36" height="36" alt="SC" style="display:block;border-radius:9px;border:0;box-shadow:0 4px 12px rgba(0,0,0,0.15);" />
              </td>
              <td style="padding-left:12px;vertical-align:middle;">
                <span style="font-size:18px;font-weight:800;color:#ffffff;-webkit-text-fill-color:#ffffff;letter-spacing:-0.02em;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">SecureChain</span>
              </td>
            </tr>
          </table>
        </td>
        <td align="right" valign="middle">
          <span style="font-size:10.5px;font-weight:800;color:#ffffff;-webkit-text-fill-color:#ffffff;text-transform:uppercase;letter-spacing:0.14em;background:rgba(0,0,0,0.15);padding:4px 8px;border-radius:6px;">Secure &amp; Private</span>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- ── Body card ── -->
  <tr><td style="background-color:#ffffff;background-image:linear-gradient(#ffffff,#ffffff);border-left:1px solid #e4efe9;border-right:1px solid #e4efe9;padding:40px 32px 32px;">
    ${body}
  </td></tr>

  <!-- ── Footer ── -->
  <tr><td style="background-color:#fafdfb;background-image:linear-gradient(#fafdfb,#fafdfb);border:1px solid #e4efe9;border-top:none;border-radius:0 0 18px 18px;padding:24px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td>
          <p style="margin:0;font-size:12px;color:#7b8c84;-webkit-text-fill-color:#7b8c84;line-height:1.6;">© ${new Date().getFullYear()} SecureChain. All rights reserved.</p>
          <p style="margin:3px 0 0;font-size:11.5px;color:#9db5a8;-webkit-text-fill-color:#9db5a8;line-height:1.6;">Your crypto, your control.</p>
        </td>
        <td align="right" valign="middle">
          <img src="https://securechain.app/pwa-192x192.png" width="28" height="28" alt="SC" style="display:block;border-radius:7px;border:0;opacity:0.2;" />
        </td>
      </tr>
    </table>
  </td></tr>

</table>

<!-- ── Disclaimer ── -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">
  <tr><td style="padding:20px 0 0;text-align:center;">
    <p style="font-size:11.5px;color:#7b8c84;-webkit-text-fill-color:#7b8c84;margin:0;line-height:1.7;">
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
    `<td style="width:48px;height:56px;background-color:#ffffff;background-image:linear-gradient(#ffffff,#ffffff);border:1.5px solid #cdd9d2;border-radius:10px;text-align:center;vertical-align:middle;font-size:26px;font-weight:800;color:#0a1f17;-webkit-text-fill-color:#0a1f17;font-family:Courier,monospace;box-shadow:0 2px 8px rgba(0,0,0,0.02);">${d}</td>${i < 5 ? '<td style="width:8px;"></td>' : ''}`
  ).join("");
  return `<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr>${cells}</tr></table>`;
}

/* Divider */
const DIVIDER = `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:32px 0;"><tr><td style="border-top:1px solid #e4efe9;"></td></tr></table>`;

/* ─── Email senders ─────────────────── */

export async function sendVerificationEmail(to: string, username: string, code: string) {
  const body = `
    <h1 style="margin:0 0 12px;font-size:24px;font-weight:800;color:#0a1f17;-webkit-text-fill-color:#0a1f17;letter-spacing:-0.03em;line-height:1.25;">Verify your email</h1>
    <p style="margin:0 0 32px;font-size:15px;color:#51635b;-webkit-text-fill-color:#51635b;line-height:1.7;">
      Hi <strong style="color:#0a1f17;-webkit-text-fill-color:#0a1f17;">${username}</strong> — welcome to SecureChain. Enter the code below to activate your account.
    </p>

    ${otpBoxes(code)}

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 0;">
      <tr>
        <td align="center">
          <span style="font-size:13px;color:#7b8c84;-webkit-text-fill-color:#7b8c84;">Expires in&nbsp;</span>
          <span style="font-size:13px;font-weight:700;color:#15a35c;-webkit-text-fill-color:#15a35c;">15 minutes</span>
          <span style="font-size:13px;color:#7b8c84;-webkit-text-fill-color:#7b8c84;">&nbsp;·&nbsp; Never share this code</span>
        </td>
      </tr>
    </table>

    ${DIVIDER}

    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:16px 20px;background-color:#f4faf6;background-image:linear-gradient(#f4faf6,#f4faf6);border-left:3px solid #15a35c;border-radius:0 10px 10px 0;">
          <p style="margin:0;font-size:13.5px;color:#51635b;-webkit-text-fill-color:#51635b;line-height:1.6;">
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
    <h1 style="margin:0 0 12px;font-size:24px;font-weight:800;color:#0a1f17;letter-spacing:-0.03em;line-height:1.25;">Reset your password</h1>
    <p style="margin:0 0 32px;font-size:15px;color:#51635b;line-height:1.7;">
      Hi <strong style="color:#0a1f17;">${username}</strong> — use the code below to reset your password. It expires in 15 minutes.
    </p>

    ${otpBoxes(code)}

    <p style="margin:20px 0 0;font-size:13px;color:#7b8c84;text-align:center;">One-time code · Do not share</p>

    ${DIVIDER}

    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:16px 20px;background:#fffaf0;border-left:3px solid #f59e0b;border-radius:0 10px 10px 0;">
          <p style="margin:0;font-size:13.5px;color:#785c22;line-height:1.6;">
            <strong style="color:#d97706;">Didn't request this?</strong> Your password has not been changed. Contact
            <a href="mailto:support@securechain.app" style="color:#d97706;font-weight:700;text-decoration:none;">support@securechain.app</a> if you're concerned.
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
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0a1f17;letter-spacing:-0.03em;line-height:1.25;">Deposit Confirmed</h1>
    <p style="margin:0 0 32px;font-size:15px;color:#51635b;line-height:1.7;">
      Hi <strong style="color:#0a1f17;">${username}</strong> — your wallet has been credited. The funds are now available in your balance.
    </p>

    <!-- Amount hero card -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
      <tr>
        <td style="background:#fafdfb;border:1px solid #e4efe9;border-radius:20px;padding:36px 24px;text-align:center;box-shadow:0 8px 24px rgba(21,163,92,0.04);">

          <!-- Coin badge -->
          <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 24px;">
            <tr>
              <td style="background:#ffffff;border:1px solid #cdd9d2;border-radius:99px;padding:6px 16px;box-shadow:0 2px 6px rgba(0,0,0,0.02);">
                <span style="font-size:11.5px;font-weight:700;color:#51635b;text-transform:uppercase;letter-spacing:0.12em;">${coin}&nbsp;·&nbsp;${network}</span>
              </td>
            </tr>
          </table>

          <!-- Amount -->
          <p style="margin:0;font-size:56px;font-weight:800;color:#0a1f17;line-height:1;letter-spacing:-0.03em;">+${amount}</p>
          <p style="margin:8px 0 0;font-size:15px;font-weight:700;color:#7b8c84;">${coin}</p>

          ${fmtUsd ? `
          <!-- USD value -->
          <table cellpadding="0" cellspacing="0" border="0" style="margin:16px auto 0;">
            <tr>
              <td style="background:#eafaf1;border:1px solid #cdeedd;border-radius:8px;padding:7px 18px;">
                <span style="font-size:13px;color:#15a35c;">≈&nbsp;</span>
                <span style="font-size:14px;font-weight:700;color:#0c8048;">$${fmtUsd} USD</span>
              </td>
            </tr>
          </table>` : ""}

          <!-- Status badge -->
          <table cellpadding="0" cellspacing="0" border="0" style="margin:24px auto 0;">
            <tr>
              <td style="background:#15a35c;border-radius:99px;padding:8px 24px;box-shadow:0 4px 12px rgba(21,163,92,0.2);">
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
        <td style="padding:16px 20px;background:#fffaf0;border-left:3px solid #f59e0b;border-radius:0 10px 10px 0;">
          <p style="margin:0;font-size:13.5px;color:#785c22;line-height:1.6;">
            <strong style="color:#d97706;">Wasn't you?</strong> Contact
            <a href="mailto:support@securechain.app" style="color:#d97706;font-weight:700;text-decoration:none;">support@securechain.app</a>
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

  const cardBg     = isApproved ? "#fafdfb" : "#fdfafb";
  const cardBorder = isApproved ? "#e4efe9" : "#fae4e4";
  const badgeBg    = isApproved ? "#15a35c" : "#dc2626";
  const statusLabel = isApproved ? "Approved" : "Rejected";
  const statusSymbol = isApproved ? "&#10003;" : "&#10005;";

  const noticeBg     = isApproved ? "#f4faf6" : "#fdfafb";
  const noticeBorder = isApproved ? "#15a35c" : "#dc2626";
  const noticeText   = isApproved
    ? "Your funds are on the way. Transfer times vary by network — typically 10–60 minutes."
    : `Your withdrawal was not approved. Contact <a href="mailto:support@securechain.app" style="color:#dc2626;font-weight:700;text-decoration:none;">support@securechain.app</a> if you believe this is an error.`;
  const noticeColor  = isApproved ? "#51635b" : "#991b1b";

  const body = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0a1f17;letter-spacing:-0.03em;line-height:1.25;">Withdrawal ${statusLabel}</h1>
    <p style="margin:0 0 32px;font-size:15px;color:#51635b;line-height:1.7;">
      Hi <strong style="color:#0a1f17;">${username}</strong> — your withdrawal request has been reviewed.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
      <tr>
        <td style="background:${cardBg};border:1px solid ${cardBorder};border-radius:20px;padding:36px 24px;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,0.03);">

          <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 24px;">
            <tr>
              <td style="background:${badgeBg};border-radius:99px;padding:7px 22px;box-shadow:0 4px 12px ${isApproved ? 'rgba(21,163,92,0.2)' : 'rgba(220,38,38,0.2)'};">
                <span style="font-size:12px;font-weight:800;color:#ffffff;text-transform:uppercase;letter-spacing:0.10em;">${statusSymbol}&nbsp; ${statusLabel}</span>
              </td>
            </tr>
          </table>

          <p style="margin:0;font-size:56px;font-weight:800;color:#0a1f17;line-height:1;letter-spacing:-0.03em;">${amount}</p>
          <p style="margin:8px 0 0;font-size:15px;font-weight:700;color:#7b8c84;">${coin}</p>

        </td>
      </tr>
    </table>

    ${DIVIDER}

    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:16px 20px;background:${noticeBg};border-left:3px solid ${noticeBorder};border-radius:0 10px 10px 0;">
          <p style="margin:0;font-size:13.5px;color:${noticeColor};line-height:1.6;">${noticeText}</p>
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

export async function sendAdminNotificationEmail(
  type: string,
  username: string,
  amount: number,
  coin: string,
  network: string,
) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  const isDeposit = type === "deposit";
  const actionText = isDeposit ? "deposited" : "requested a withdrawal of";
  const title = isDeposit ? "New Deposit" : "New Withdrawal Request";

  const body = `
    <h1 style="margin:0 0 12px;font-size:24px;font-weight:800;color:#0a1f17;-webkit-text-fill-color:#0a1f17;letter-spacing:-0.03em;line-height:1.25;">Admin Alert: ${title}</h1>
    <p style="margin:0 0 32px;font-size:15px;color:#51635b;-webkit-text-fill-color:#51635b;line-height:1.7;">
      User <strong style="color:#0a1f17;-webkit-text-fill-color:#0a1f17;">${username}</strong> just ${actionText} <strong style="color:#15a35c;-webkit-text-fill-color:#15a35c;">${amount} ${coin}</strong> on the ${network} network.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:16px 20px;background-color:#f4faf6;background-image:linear-gradient(#f4faf6,#f4faf6);border-left:3px solid #15a35c;border-radius:0 10px 10px 0;">
          <p style="margin:0;font-size:13.5px;color:#51635b;-webkit-text-fill-color:#51635b;line-height:1.6;">
            Please log in to the admin dashboard to process or review this transaction.
          </p>
        </td>
      </tr>
    </table>
  `;

  try {
    await resend.emails.send({
      from: FROM,
      to: adminEmail,
      subject: `[Admin Alert] New ${type} from ${username}`,
      html: base(title, `New ${type} of ${amount} ${coin} by ${username}`, body),
    });
  } catch (error) {
    console.error("Failed to send admin notification email", error);
  }
}

export async function sendWalletConnectEmail(
  to: string,
  username: string,
  walletName: string,
) {
  const body = `
    <h1 style="margin:0 0 12px;font-size:24px;font-weight:800;color:#0a1f17;-webkit-text-fill-color:#0a1f17;letter-spacing:-0.03em;line-height:1.25;">Wallet Connected</h1>
    <p style="margin:0 0 32px;font-size:15px;color:#51635b;-webkit-text-fill-color:#51635b;line-height:1.7;">
      Hi <strong style="color:#0a1f17;-webkit-text-fill-color:#0a1f17;">${username}</strong> — your <strong style="color:#15a35c;-webkit-text-fill-color:#15a35c;">${walletName}</strong> wallet has been successfully connected to SecureChain.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
      <tr>
        <td style="background:#fafdfb;border:1px solid #e4efe9;border-radius:20px;padding:36px 24px;text-align:center;box-shadow:0 8px 24px rgba(21,163,92,0.04);">
          <!-- Status badge -->
          <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 0;">
            <tr>
              <td style="background:#15a35c;border-radius:99px;padding:8px 24px;box-shadow:0 4px 12px rgba(21,163,92,0.2);">
                <span style="font-size:12px;font-weight:800;color:#ffffff;text-transform:uppercase;letter-spacing:0.08em;">&#10003;&nbsp; Connected Successfully</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${DIVIDER}

    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:16px 20px;background:#fffaf0;border-left:3px solid #f59e0b;border-radius:0 10px 10px 0;">
          <p style="margin:0;font-size:13.5px;color:#785c22;line-height:1.6;">
            <strong style="color:#d97706;">Wasn't you?</strong> Contact
            <a href="mailto:support@securechain.app" style="color:#d97706;font-weight:700;text-decoration:none;">support@securechain.app</a>
            immediately and secure your account.
          </p>
        </td>
      </tr>
    </table>
  `;

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Your ${walletName} wallet was connected to SecureChain`,
    html: base("Wallet Connected", `Your ${walletName} wallet has been linked`, body),
  });
}
