import { createContext, useContext, useState, useCallback } from "react";
import { api, setToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("streeteat_user");
    return raw ? JSON.parse(raw) : null;
  });

  const persist = useCallback((session) => {
    setToken(session.token);
    const nextUser = {
      userId: session.userId,
      name: session.name,
      email: session.email,
      role: session.role,
    };
    localStorage.setItem("streeteat_user", JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const session = await api.login({ email, password });
      persist(session);
      return session;
    },
    [persist]
  );

  const register = useCallback(
    async ({ name, email, password, phone }) => {
      const session = await api.register({ name, email, password, phone, role: "CUSTOMER" });
      persist(session);
      return session;
    },
    [persist]
  );

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem("streeteat_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
