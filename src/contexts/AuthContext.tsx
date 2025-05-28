import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { toast } from "sonner";
import { signIn, getCurrentUser as fetchCurrentUser, logout as apiLogout, getCurrentUser } from "@/services/auth-service";

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
const fetchAndSetCurrentUser = async () => {
  const response = await getCurrentUser(); // Your API call
  setUser(response); // This should include role: 'admin' or 'member'
};

  // Load current user on mount
useEffect(() => {
  const initializeAuth = async () => {
    const currentUser = await fetchCurrentUser(); // 🔁 always fetch from backend
    if (currentUser) {
      setUser(currentUser);
      localStorage.setItem("user", JSON.stringify(currentUser)); // optional
    } else {
      localStorage.removeItem("user");
    }
    setIsLoading(false);
  };
  initializeAuth();
}, []);


const login = async (email: string, password: string): Promise<boolean> => {
  setIsLoading(true);
  try {
    const result = await signIn(email, password);

    if (result?.user) {
      // Instead of setting user from result.user, fetch the full current user
      const currentUser = await fetchCurrentUser(); // This returns the full user with `role`
      setUser(currentUser);
      localStorage.setItem("user", JSON.stringify(currentUser));
      toast.success(`Bem-vindo, ${currentUser.firstName || currentUser.name || "usuário"}!`);
      return true;
    } else {
      toast.error("Falha no login. Verifique suas credenciais.");
      return false;
    }
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    toast.error("Erro ao fazer login");
    return false;
  } finally {
    setIsLoading(false);
  }
};


  const logout = () => {
    apiLogout();
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
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
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
