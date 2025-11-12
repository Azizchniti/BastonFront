import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function redirectUserByRole(role: string) {
    switch (role) {
      case "admin":
        return "/admin/chamados";
      case "user":
        return "/user/chamados";
      default:
        return "/";
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user?.role) {
          navigate(redirectUserByRole(user.role));
        } else {
          throw new Error("Função de usuário não encontrada.");
        }
      }
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      toast.error(error.message || "Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-white">
        <CardHeader className="text-center space-y-2">
          <img
            src="/logo.png"
            alt="Chamadas Baston Logo"
            className="w-28 h-auto mx-auto mb-2"
          />
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Chamadas Baston
          </CardTitle>
          <p className="text-sm text-gray-300">
            Acesse sua conta para gerenciar seus chamados
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="bg-white/20 border-white/30 text-white placeholder-gray-300"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-200">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white/20 border-white/30 text-white placeholder-gray-300"
              />
            </div>

            <div className="flex justify-end text-sm">
              <button
                type="button"
                onClick={() => navigate("/sendemail")}
                className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
              >
                Esqueceu sua senha?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white mt-2"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="text-center mt-4 text-sm">
              <span className="text-gray-300">Não tem uma conta? </span>
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
              >
                Crie uma
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
