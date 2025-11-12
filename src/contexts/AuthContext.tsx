// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { toast } from "sonner";
import { signIn, getCurrentUser as fetchCurrentUser, logout as apiLogout } from "@/services/auth-service";

// Extend User to include token
export interface AuthUser extends User {
  token: string;
}

type AuthContextType = {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const initializeAuth = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setIsLoading(false);
      return;
    }

    try {
      const parsedUser: AuthUser = JSON.parse(storedUser);
      // fallback to token in localStorage separately
      if (!parsedUser.token) {
        const token = localStorage.getItem("token");
        if (token) parsedUser.token = token;
      }
      setUser(parsedUser);
    } catch (error) {
      console.error("Erro ao inicializar usuário:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  };

  initializeAuth();
}, []);


  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await signIn(email, password);
if (result?.user && result.token) {
  const normalizedUser = {
    ...result.user,
    first_name: result.user.first_name || result.user.firstName,
    last_name: result.user.last_name || result.user.lastName,
  };

  const authUser: AuthUser = {
    ...normalizedUser,
    token: result.token,
  };

  setUser(authUser);
  localStorage.setItem("user", JSON.stringify(authUser));

  toast.success(`Bem-vindo, ${authUser.first_name} ${authUser.last_name}!`);
  return true;
}
 else {
        toast.error("Falha no login. Verifique suas credenciais.");
        return false;
      }
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      toast.error(error.message || "Erro ao fazer login");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiLogout();
    localStorage.removeItem("user");
    setUser(null);
    toast.info("Sessão encerrada");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};
