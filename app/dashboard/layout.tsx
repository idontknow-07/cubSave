import { AuthProvider } from "@/context/AuthContext";
import BottomNav from "@/components/BottomNav";
import DashboardSidebar from "@/components/DashboardSidebar";
import InstallPrompt from "@/components/InstallPrompt";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div style={{ display: "flex", height: "100dvh", overflow: "hidden", background: "var(--bg)", paddingTop: "env(safe-area-inset-top, 0px)" }}>
        <DashboardSidebar />
        <div className="dash-layout-scroll" style={{ flex: 1, minWidth: 0, overflowY: "auto", WebkitOverflowScrolling: "touch", overscrollBehaviorY: "none" }}>
          <InstallPrompt />
          {children}
        </div>
      </div>
      <div className="cv-mobile-nav">
        <BottomNav />
      </div>
      <style>{`
        @media (min-width: 900px) { .cv-mobile-nav { display: none !important; } }
      `}</style>
    </AuthProvider>
  );
}
