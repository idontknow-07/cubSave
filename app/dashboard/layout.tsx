import { AuthProvider } from "@/context/AuthContext";
import BottomNav from "@/components/BottomNav";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg)" }}>
        <DashboardSidebar />
        <div style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
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
