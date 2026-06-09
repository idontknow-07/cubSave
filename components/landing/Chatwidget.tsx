"use client";

import { useState, useRef, useEffect } from "react";

interface Msg {
  from: "bot" | "user";
  text: string;
}

const QUICK = ["How do I deposit?", "What are the fees?", "Is it secure?", "What coins do you support?"];

// Built-in replies — rules are checked top to bottom, so put specific topics first.
// Swap this for a real live-chat service or an AI backend later.
const RULES: { match: RegExp; reply: string }[] = [
  { match: /\b(hi|hello|hey|yo|howdy|good (morning|afternoon|evening))\b/, reply: "Hi there! How can we help you with SecureChain today? You can ask about deposits, fees, security, or getting started." },
  { match: /(thank|thanks|thx|appreciate)/, reply: "You're welcome! Is there anything else I can help you with?" },
  { match: /\b(bye|goodbye|see you|cya)\b/, reply: "Thanks for stopping by. Have a great day, and trade safely!" },
  { match: /(fee|charge|commission|cost|spread)/, reply: "Our fees are low and fully transparent — you'll always see the exact cost before you confirm a trade, with no hidden spreads." },
  { match: /(deposit|fund|top ?up|add money)/, reply: "To deposit, sign in and open your dashboard, choose an asset, and send funds to the wallet address shown — or transfer directly from another exchange." },
  { match: /(withdraw|cash ?out|payout)/, reply: "To withdraw, go to your dashboard, choose Withdraw, enter the destination address and amount, then confirm. Settlement time depends on the network." },
  { match: /(kyc|verif|identity|document)/, reply: "Identity verification (KYC) keeps accounts safe and unlocks full trading and higher limits. You'll be guided through it after signing up." },
  { match: /(secur|safe|hack|protect|2fa|cold storage)/, reply: "Security is our top priority — cold storage for the majority of assets, multi-factor authentication, and continuous monitoring keep your funds protected." },
  { match: /(minimum|\bmin\b|limit|maximum|\bmax\b)/, reply: "Deposit and withdrawal limits depend on your verification level. Completing identity verification unlocks higher limits." },
  { match: /(asset|coin|token|currenc|which crypto|listed|bitcoin|ethereum|\bbtc\b|\beth\b|solana|usdc)/, reply: "We support 100+ assets across major chains, including Bitcoin, Ethereum, Solana, BNB, and USDC — with new ones added regularly." },
  { match: /(trade|trading|buy|sell|swap|order|exchange)/, reply: "You can buy, sell, and swap from your dashboard using market, limit, or stop orders, with live charts to guide you." },
  { match: /(forgot|reset|can'?t (log|sign) ?in|password|locked out)/, reply: "Trouble signing in? Use the “Forgot password?” link on the login page to reset it. If you're still stuck, our team can help." },
  { match: /(sign ?up|register|create.*account|new account|open.*account)/, reply: "Creating an account takes just a few minutes — tap “Get Started” at the top or visit the Sign up page, then verify your email." },
  { match: /(app|mobile|ios|android|phone|download)/, reply: "SecureChain works great in any mobile browser, and you can add it to your home screen to use it like an app." },
  { match: /(country|countries|region|available in|where.*available)/, reply: "SecureChain is available in many countries. During signup you'll choose your country to see what's supported in your region." },
  { match: /(how long|how fast|duration|when will|time.*take|speed)/, reply: "Most transactions are processed promptly. Final settlement time depends on the blockchain network's confirmation speed." },
  { match: /(contact|email|reach you|get in touch)/, reply: "You can reach our team right here in chat, or by email — leave your address and a short note and we'll follow up." },
  { match: /(hour|\bopen\b|available|24\/?7)/, reply: "Our support team is available 24/7 — feel free to reach out anytime." },
  { match: /(human|agent|representative|real person|someone|customer (service|support))/, reply: "I can connect you with our support team. Leave your email and a short message and a team member will follow up shortly." },
  { match: /(help|stuck|problem|issue|support)/, reply: "Happy to help! Tell me a bit more, or ask about deposits, withdrawals, fees, security, or your account. You can also leave your email for our team to follow up." },
];

function botReply(input: string): string {
  const q = input.toLowerCase();
  for (const rule of RULES) if (rule.match.test(q)) return rule.reply;
  return "Thanks for your message! A member of our team will follow up. For anything else, you can reach us on +44 7442 695877, or ask about deposits, withdrawals, fees, security, or getting started";
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { from: "bot", text: "Hi! Welcome to SecureChain. How can we help you today?" },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function send(text: string) {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { from: "user", text: t }]);
    setInput("");
    setTimeout(() => setMessages((m) => [...m, { from: "bot", text: botReply(t) }]), 450);
  }

  return (
    <>
      {/* Chat panel */}
      <div
        className={`fixed bottom-[88px] right-5 z-[200] w-[360px] max-w-[calc(100vw-2.5rem)] h-[470px] max-h-[calc(100vh-7rem)] bg-white rounded-2xl border border-[#e4efe9] shadow-[0_24px_60px_rgba(10,31,23,0.18)] flex flex-col overflow-hidden origin-bottom-right transition-all duration-200 ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
          }`}
      >
        {/* header */}
        <div className="flex items-center gap-3 px-4 py-3.5 text-white" style={{ background: "linear-gradient(135deg,#15a35c,#047857)" }}>
          <span className="w-9 h-9 rounded-[9px] bg-white/15 grid place-items-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]"><path d="M12 2.6 20 7V17L12 21.4 4 17V7Z" /><circle cx="12" cy="11" r="1.9" /><path d="M12 12.9V15.4" /></svg>
          </span>
          <div className="flex-1">
            <div className="font-sora font-semibold text-[15px] leading-tight">SecureChain Support</div>
            <div className="flex items-center gap-1.5 text-[12px] text-white/85"><span className="w-2 h-2 rounded-full bg-[#5cf0ad]" /> Online now</div>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-white/80 hover:text-white transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 bg-[#f7faf8] flex flex-col gap-3">
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[80%] px-3.5 py-2.5 text-[14px] leading-snug rounded-2xl ${m.from === "bot"
                ? "self-start bg-white border border-[#e4efe9] text-[#0a1f17] rounded-bl-md"
                : "self-end bg-[#15a35c] text-white rounded-br-md"
              }`}>
              {m.text}
            </div>
          ))}

          {messages.length < 3 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {QUICK.map((q) => (
                <button key={q} onClick={() => send(q)} className="text-[12.5px] px-3 py-1.5 rounded-full border border-[#cdeedd] text-[#15a35c] bg-white hover:bg-[#f4faf6] transition-colors">
                  {q}
                </button>
              ))}
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* input */}
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2 p-3 border-t border-[#e4efe9] bg-white">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 h-[42px] px-3.5 rounded-[10px] bg-[#f7faf8] border border-[#e4efe9] text-[14px] outline-none focus:border-[#15a35c] focus:ring-2 focus:ring-[#15a35c]/15 placeholder:text-[#9db5a8]"
          />
          <button type="submit" aria-label="Send" className="w-[42px] h-[42px] shrink-0 rounded-[10px] bg-[#15a35c] text-white grid place-items-center hover:bg-[#0c8048] transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
          </button>
        </form>
      </div>

      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-5 right-5 z-[200] w-14 h-14 rounded-full grid place-items-center text-white shadow-[0_12px_30px_rgba(21,163,92,0.4)] hover:-translate-y-0.5 transition-transform"
        style={{ background: "linear-gradient(135deg,#15a35c,#047857)" }}
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M18 6 6 18M6 6l12 12" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
        )}
      </button>
    </>
  );
}