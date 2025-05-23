
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Member } from "@/types";
import { toast } from "sonner";

// Dados mock para simular um banco de dados
const ADMIN_USER: User = {
  id: "admin-1",
  name: "Administrador",
  email: "admin@example.com",
  role: "admin",
  createdAt: new Date("2023-01-01"),
};

// Membros mock
const MOCK_MEMBERS: Member[] = [
  {
    id: "m1",
    name: "João Silva",
    email: "joao@example.com",
    role: "member",
    cpf: "123.456.789-00",
    phone: "(11) 99999-1111",
    uplineId: null,
    grade: "start",
    totalSales: 0,
    totalContacts: 5,
    totalCommission: 0,
    createdAt: new Date("2023-02-01"),
  },
  {
    id: "m2",
    name: "Maria Oliveira",
    email: "maria@example.com",
    role: "member",
    cpf: "987.654.321-00",
    phone: "(11) 99999-2222",
    uplineId: "m1",
    grade: "standard",
    totalSales: 120000,
    totalContacts: 30,
    totalCommission: 1200,
    createdAt: new Date("2023-02-15"),
  },
  {
    id: "m3",
    name: "Carlos Souza",
    email: "carlos@example.com",
    role: "member",
    cpf: "111.222.333-44",
    phone: "(11) 99999-3333",
    uplineId: "m2",
    grade: "gold",
    totalSales: 600000,
    totalContacts: 85,
    totalCommission: 6000,
    createdAt: new Date("2023-03-01"),
  },
];

// Usuários combinados para login
const USERS = [ADMIN_USER, ...MOCK_MEMBERS];

type AuthContextType = {
  user: User | Member | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulando um delay de rede
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      // Em uma aplicação real, aqui seria feita a requisição para a API
      // Para esta demo, estamos usando dados mock
      
      // Senha padrão para todos os usuários na demo
      if (password !== "123456") {
        toast.error("Senha incorreta");
        return false;
      }
      
      const foundUser = USERS.find(u => u.email === email);
      
      if (!foundUser) {
        toast.error("Usuário não encontrado");
        return false;
      }
      
      // Salvar usuário no localStorage
      localStorage.setItem("user", JSON.stringify(foundUser));
      setUser(foundUser);
      
      toast.success(`Bem-vindo, ${foundUser.name}!`);
      return true;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Erro ao fazer login");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
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
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
