// Central content for the landing page. Edit copy / add items here.

export interface Coin {
  name: string;
  tic: string;
  sym: string;
  grad: string;
  chg: string;
  up: boolean;
  pts: string;
}

export interface Asset {
  nm: string;
  tk: string;
  sym: string;
  grad: string;
}

export interface Feature {
  t: string;
  d: string;
  p: string;
}

export interface Row {
  h: string;
  d: string;
  p: string;
}

export interface Testimonial {
  q: string;
  n: string;
  av: string;
}

export interface Faq {
  q: string;
  a: string;
}

export type NavItem = [label: string, href: string];
export type FooterCol = [heading: string, links: NavItem[]];

export const NAV_ITEMS: NavItem[] = [
  ["Why Us", "#why"],
  ["Markets", "#markets"],
  ["Platform", "#platform"],
  ["Security", "#security"],
  ["FAQ", "#faq"],
];

export const COINS: Coin[] = [
  { name: "Bitcoin", tic: "BTC / USD", sym: "₿", grad: "linear-gradient(135deg,#f7931a,#ffb347)", chg: "+2.4%", up: true, pts: "0,20 10,16 20,18 30,9 40,12 50,5 62,7" },
  { name: "Ethereum", tic: "ETH / USD", sym: "Ξ", grad: "linear-gradient(135deg,#627eea,#8aa0f0)", chg: "+1.1%", up: true, pts: "0,14 10,17 20,11 30,13 40,7 50,10 62,4" },
  { name: "Solana", tic: "SOL / USD", sym: "◎", grad: "linear-gradient(135deg,#9945ff,#14f195)", chg: "-0.8%", up: false, pts: "0,8 10,11 20,9 30,14 40,12 50,17 62,15" },
  { name: "BNB", tic: "BNB / USD", sym: "B", grad: "linear-gradient(135deg,#f3ba2f,#ffd75e)", chg: "+3.2%", up: true, pts: "0,18 10,14 20,15 30,10 40,11 50,7 62,8" },
];

export const ASSETS: Asset[] = [
  { nm: "Bitcoin", tk: "BTC", sym: "₿", grad: "linear-gradient(135deg,#f7931a,#ffb347)" },
  { nm: "Ethereum", tk: "ETH", sym: "Ξ", grad: "linear-gradient(135deg,#627eea,#8aa0f0)" },
  { nm: "Solana", tk: "SOL", sym: "◎", grad: "linear-gradient(135deg,#9945ff,#14f195)" },
  { nm: "BNB", tk: "BNB", sym: "B", grad: "linear-gradient(135deg,#f3ba2f,#ffd75e)" },
  { nm: "USD Coin", tk: "USDC", sym: "$", grad: "linear-gradient(135deg,#2775ca,#5b9be0)" },
];

export const FEATURES: Feature[] = [
  { t: "Bank-grade security", d: "Cold storage, multi-factor authentication, and continuous monitoring keep your funds protected.", p: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  { t: "Fast execution", d: "A high-performance matching engine fills your orders quickly, even during volatile market moves.", p: "M13 2 3 14h7l-1 8 10-12h-7l1-8z" },
  { t: "Transparent fees", d: "See exactly what you pay before you trade. No hidden spreads, no surprise charges at withdrawal.", p: "M3 3v18h18M7 14l4-4 3 3 5-6" },
  { t: "Dedicated support", d: "Our team is available around the clock to help you with deposits, withdrawals, and anything else.", p: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
];

export const PLATFORM_ROWS: Row[] = [
  { h: "Deposit easily from exchanges", d: "Move crypto in directly from platforms like Binance and Coinbase — no complicated steps.", p: "M12 5v14M5 12h14" },
  { h: "Fast deposits & withdrawals", d: "Funds reflect on your dashboard as soon as the network confirms your transaction.", p: "M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0zM12 7v5l3 3" },
  { h: "Advanced trading tools", d: "Limit, market, and stop orders with live charts, so you can trade exactly the way you want.", p: "M4 4h16v12H4zM2 20h20" },
];

export const SECURITY_ROWS: Row[] = [
  { h: "Added security with encryption", d: "Encrypted backups and strong authentication add extra layers of protection to your account.", p: "M3 11h18v11H3zM7 11V7a5 5 0 0 1 10 0v4" },
  { h: "Minimal data, maximum care", d: "We collect only what we need to keep your account safe and compliant — nothing more.", p: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" },
  { h: "Proactive risk alerts", d: "Get notified about suspicious activity and risky transactions before they become a problem.", p: "M12 2 4 5v6c0 5 3.5 8 8 11 4.5-3 8-6 8-11V5l-8-3zM9 12l2 2 4-4" },
];

export const TESTIMONIALS: Testimonial[] = [
  { q: "Fast, reliable transactions and a clean interface. Deposits and withdrawals have been smooth every time.", n: "Ethan C.", av: "EC" },
  { q: "Easy to use with low fees compared to other platforms. Withdrawing funds is straightforward.", n: "Marcus H.", av: "MH" },
  { q: "Quick registration and ID verification. Crypto deposits were available right after network confirmation.", n: "Sarah B.", av: "SB" },
];

export const FAQS: Faq[] = [
  { q: "How do I set up a new account?", a: "Click “Create Account,” enter your email, set a strong password, and verify your address. You’ll then be guided through identity verification to unlock full trading and withdrawals." },
  { q: "Why do I need to complete identity verification (KYC)?", a: "Verification helps us comply with regulations, protect your account from fraud, and enable higher deposit and withdrawal limits. Your documents are handled securely." },
  { q: "How do I make a deposit?", a: "Go to your dashboard, select the asset you want to deposit, and send funds to the wallet address shown — or transfer directly from a supported exchange." },
  { q: "How long do deposits take to reflect?", a: "Crypto deposits appear once the network confirms your transaction. Confirmation time depends on the blockchain and current network congestion." },
  { q: "What is the withdrawal process?", a: "From your dashboard, choose “Withdraw,” select the asset, enter the destination address and amount, then confirm with your security method. We’ll process it after a quick review." },
  { q: "How long do withdrawals take?", a: "Most withdrawals are processed promptly after review. Final settlement time depends on the destination network’s confirmation speed." },
];

export const FOOTER_COLS: FooterCol[] = [
  ["Product", [["Markets", "#markets"], ["Platform", "#platform"], ["Why Us", "#why"], ["Fees", "#"]]],
  ["Company", [["About Us", "#"], ["Security", "#security"], ["Careers", "#"], ["Blog", "#"]]],
  ["Support", [["FAQ", "#faq"], ["Help Center", "#"], ["Contact", "/contact"], ["Privacy Policy", "/privacy"]]],
];

export const COUNTRIES: string[] = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan",
  "Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi",
  "Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica","Côte d'Ivoire","Croatia","Cuba","Cyprus","Czechia",
  "Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia",
  "Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana",
  "Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan",
  "Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg",
  "Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar",
  "Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman",
  "Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda",
  "Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria",
  "Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu",
  "Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe",
];