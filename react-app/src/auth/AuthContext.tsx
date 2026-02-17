import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { getToken, saveToken, destroyToken } from "./tokenService";

const API_BASE = "https://api.realworld.show/api";

interface User {
  email: string;
  token: string;
  username: string;
  bio: string | null;
  image: string | null;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = user !== null;

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    fetch(`${API_BASE}/user`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json() as Promise<{ user: User }>;
      })
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        destroyToken();
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: { email, password } }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw err;
    }
    const data = (await res.json()) as { user: User };
    saveToken(data.user.token);
    setUser(data.user);
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const res = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: { username, email, password } }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw err;
      }
      const data = (await res.json()) as { user: User };
      saveToken(data.user.token);
      setUser(data.user);
    },
    [],
  );

  const logout = useCallback(() => {
    destroyToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
