import { AuthProvider } from "@/context/AuthContext";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
        <AdminSidebar />
        <main style={{ flex: 1, minWidth: 0, padding: "16px 16px", paddingTop: "80px" }} className="admin-main">
          {children}
        </main>
      </div>
      <style>{`@media (min-width: 1024px) { .admin-main { padding: 32px 32px !important; padding-top: 32px !important; } }`}</style>
    </AuthProvider>
  );
}
