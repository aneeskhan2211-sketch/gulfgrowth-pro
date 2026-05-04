import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { type ReactNode, createContext, useContext } from "react";

export interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  principal: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { identity, login, clear, isLoggingIn, isAuthenticated } =
    useInternetIdentity();

  const principal = identity?.getPrincipal().toText() ?? null;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading: isLoggingIn,
        login,
        logout: clear,
        principal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
