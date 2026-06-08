import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import WhyUs from "@/components/landing/WhyUs";
import Markets from "@/components/landing/Markets";
import Platform from "@/components/landing/Platform";
import Security from "@/components/landing/Security";
import Testimonials from "@/components/landing/Testimonials";
import Faq from "@/components/landing/Faq";
import Cta from "@/components/landing/Cta";
import Footer from "@/components/landing/Footer";
import ChatWidget from "@/components/landing/Chatwidget";

export default function LandingPage() {
  return (
    <div className="bg-white text-[#0a1f17] font-manrope antialiased scroll-smooth">
      <Navbar />
      <Hero />
      <Stats />
      <WhyUs />
      <Markets />
      <Platform />
      <Security />
      <Testimonials />
      <Faq />
      <Cta />
      <Footer />
      <ChatWidget />
    </div>
  );
}
