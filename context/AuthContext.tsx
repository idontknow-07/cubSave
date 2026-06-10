"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string;
  username: string;
  role: string;
  currencyPref: string;
  theme: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: (u: User | null) => void;
  logout: () => Promise<void>;
  updatePrefs: (prefs: Partial<Pick<User, "currencyPref" | "theme">>) => Promise<void>;
};

const USER_KEY = "sc_session_user";

function readCache(): User | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch { return null; }
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(readCache);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const setUser = (u: User | null) => {
    setUserState(u);
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
    else localStorage.removeItem(USER_KEY);
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setUser(d.user);
        } else {
          // Cookie gone/expired — clear cached state
          setUserState(null);
          localStorage.removeItem(USER_KEY);
        }
      })
      .catch(() => { /* network error — keep cached state, don't log out */ })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    document.documentElement.classList.toggle("light", user.theme === "light");
  }, [user]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);          // also clears localStorage
    router.push("/login");
  };

  const updatePrefs = async (prefs: Partial<Pick<User, "currencyPref" | "theme">>) => {
    const res = await fetch("/api/auth/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prefs),
    });
    const data = await res.json();
    if (data.user) setUser(data.user);   // caches updated prefs too
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout, updatePrefs }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
