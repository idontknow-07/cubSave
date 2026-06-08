import { AuthProvider } from "@/context/AuthContext";
export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
