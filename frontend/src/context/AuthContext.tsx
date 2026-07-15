import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authAPI, clearStoredAuth, getStoredUser, type AuthUser, type LoginPayload, type RegisterPayload } from "@/api/auth";
import type { ReactNode } from "react";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userInitials: string;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const buildInitials = (name?: string, email?: string) => {
  const source = (name || email || "User").trim();
  const words = source.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [isLoading, setIsLoading] = useState(() => Boolean(localStorage.getItem("token")));

  const clearSession = useCallback(() => {
    clearStoredAuth();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      clearSession();
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await authAPI.me();
      setUser(currentUser);
      localStorage.setItem("user", JSON.stringify(currentUser));
    } catch {
      clearSession();
    } finally {
      setIsLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    const handleForcedLogout = () => clearSession();
    window.addEventListener("auth:logout", handleForcedLogout);
    refreshUser();

    return () => {
      window.removeEventListener("auth:logout", handleForcedLogout);
    };
  }, [clearSession, refreshUser]);

  const login = useCallback(async (payload: LoginPayload) => {
    const auth = await authAPI.login(payload);
    setUser(auth.user);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const auth = await authAPI.register(payload);
    setUser(auth.user);
  }, []);

  const logout = useCallback(async () => {
    await authAPI.logout();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user && localStorage.getItem("token")),
      isLoading,
      userInitials: buildInitials(user?.fullName, user?.email),
      login,
      register,
      logout,
      refreshUser,
    }),
    [isLoading, login, logout, refreshUser, register, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
