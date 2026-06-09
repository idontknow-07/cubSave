import { Resend } from "resend";

/**
 * RESEND CONFIGURATION
 * 
 * We are now using Resend (resend.com), which is the best modern
 * way to send emails in Next.js apps.
 * 
 * 1. Get an API Key at https://resend.com
 * 2. If you don't have a domain yet, Resend allows you to send
 *    to YOUR OWN EMAIL using their default "onboarding@resend.dev" address.
 */

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM || "SecureChain <onboarding@resend.dev>";

function base(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Sora','Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:48px 20px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;">

      <!-- Logo Header -->
      <tr><td style="padding-bottom:32px; text-align:center;">
        <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
          <tr>
            <td style="width:40px;height:40px;background:linear-gradient(135deg,#15a35c,#047857);border-radius:10px;text-align:center;vertical-align:middle;box-shadow:0 4px 12px rgba(21,163,92,0.2);">
               <img src="https://securechain.io/favicon.ico" width="20" height="20" style="display:block; margin: 10px auto; filter: brightness(0) invert(1);" alt="logo"/>
            </td>
            <td style="padding-left:12px;vertical-align:middle;">
              <span style="font-size:22px;font-weight:800;color:#0a1f17;letter-spacing:-0.03em;font-family:'Sora',sans-serif;">Secure<span style="color:#15a35c;">Chain</span></span>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- Main Card -->
      <tr><td style="background:#ffffff;border:1px solid #edf2f7;border-radius:24px;padding:48px 40px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);">
        ${body}
      </td></tr>

      <!-- Footer -->
      <tr><td style="padding-top:32px;text-align:center;">
        <p style="font-size:13px;color:#718096;margin:0;line-height:1.5;">
          © ${new Date().getFullYear()} SecureChain · The most secure way to trade.
        </p>
        <p style="font-size:12px;color:#a0aec0;margin:8px 0 0;">
          If you didn't request this email, please ignore it.
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

export async function sendVerificationEmail(to: string, username: string, verifyUrl: string) {
  const body = `
    <h2 style="font-size:22px;font-weight:800;color:#0a1f17;margin:0 0 8px;letter-spacing:-0.02em;">
      Confirm your email address
    </h2>
    <p style="font-size:15px;color:#51635b;margin:0 0 28px;line-height:1.6;">
      Hey <strong style="color:#0a1f17;">${username}</strong> 👋 — you&apos;re one step away from your SecureChain account. Tap the button below to verify your email and continue setup.
    </p>

    <!-- CTA card -->
    <div style="background:linear-gradient(135deg,#0c8048,#076c45);border-radius:18px;padding:36px 28px;text-align:center;margin-bottom:24px;">
      <div style="width:56px;height:56px;background:rgba(255,255,255,0.15);border-radius:14px;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;">
        <span style="font-size:26px;line-height:1;">✉️</span>
      </div>
      <p style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.7);margin:0 0 6px;">
        Email Verification
      </p>
      <p style="font-size:16px;font-weight:700;color:#ffffff;margin:0 0 24px;line-height:1.4;">
        Click below to confirm<br/>it&apos;s really you
      </p>
      <a href="${verifyUrl}"
        style="display:inline-block;background:#ffffff;color:#0c8048;font-size:15px;font-weight:800;text-decoration:none;padding:15px 40px;border-radius:12px;letter-spacing:-0.01em;">
        ✓ &nbsp;Verify my email
      </a>
      <p style="font-size:12px;color:rgba(255,255,255,0.55);margin:20px 0 0;">
        Link expires in 24 hours
      </p>
    </div>

    <p style="font-size:12px;color:#9db5a8;margin:0;text-align:center;word-break:break-all;line-height:1.6;">
      Button not working? Copy and paste this link:<br/>
      <span style="color:#51635b;">${verifyUrl}</span>
    </p>
  `;

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Verify your SecureChain account",
    html: base("Verify your email", body),
  });
}

export async function sendPasswordResetEmail(to: string, username: string, code: string) {
  const body = `
    <h2 style="font-size:22px;font-weight:800;color:#0a1f17;margin:0 0 8px;letter-spacing:-0.02em;">
      Reset your password
    </h2>
    <p style="font-size:15px;color:#51635b;margin:0 0 28px;line-height:1.6;">
      Hey <strong style="color:#0a1f17;">${username}</strong>, use this code to reset your SecureChain password.
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
        <a href="mailto:support@SecureChain.io" style="color:#c47d0e;font-weight:700;">contact our support team</a> immediately.
        Do not share your account details with anyone.
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
  const color = isApproved ? "#15a35c" : "#e53935";
  const bg = isApproved ? "#eafaf1" : "#fff0f0";
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

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Withdrawal ${status}: ${amount} ${coin}`,
    html: base(`Withdrawal ${status}`, body),
  });
}
