import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function ContactPage() {
  return (
    <div className="bg-white text-[#0a1f17] font-manrope min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-6 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl font-sora font-bold mb-8 text-center md:text-left">Contact Us</h1>
        <div className="bg-white shadow-xl p-8 rounded-2xl border border-gray-100 mt-8">
          <p className="text-lg mb-8 text-gray-600 text-center md:text-left">
            Need help or have questions? Reach out to our support team directly. We're here to assist you 24/7.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 mt-8">
            <a 
              href="https://wa.me/1234567890" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-[#25D366] hover:bg-[#1ebd5b] text-white font-bold py-4 px-6 rounded-xl text-center transition-colors flex items-center justify-center gap-3 shadow-lg shadow-[#25D366]/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              Contact on WhatsApp
            </a>
            
            <a 
              href="mailto:support@securechain.com" 
              className="flex-1 bg-white border-2 border-[#15a35c] text-[#15a35c] hover:bg-gray-50 font-bold py-4 px-6 rounded-xl text-center transition-colors flex items-center justify-center gap-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
              Email Support
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
