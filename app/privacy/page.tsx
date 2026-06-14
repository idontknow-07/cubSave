import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function PrivacyPage() {
  return (
    <div className="bg-white text-[#0a1f17] font-manrope min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-sora font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-lg">
          <p className="mb-4">
            At SecureChain, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your personal information.
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Information We Collect</h2>
          <p className="mb-4">
            We collect information you provide directly to us, such as when you create an account, complete identity verification, or contact support.
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">How We Use Your Information</h2>
          <p className="mb-4">
            We use the information we collect to provide, maintain, and improve our services, to process transactions, and to communicate with you.
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us via our <a href="/contact" className="text-[#15a35c] underline hover:text-[#0e7a42] transition-colors">Contact Page</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
