import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser, signIn } from "@/services/auth-service";
import { toast } from "sonner";

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function redirectUserByRole(role: string) {
    switch (role) {
      case "admin":
        return "/admin";
      case "member":
        return "/member";
      default:
        return "/";
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password) return;

    setIsLoading(true);
    try {
      const signInResult = await signIn(email, password);

      if (signInResult && signInResult.token) {
        toast.success("Login realizado com sucesso!");
        setSuccessMessage("Login realizado com sucesso!");
        localStorage.setItem("token", signInResult.token);
        localStorage.setItem("user", JSON.stringify(signInResult.user));

        const userData = await getCurrentUser();
        console.log("userData:", userData);
        navigate(redirectUserByRole(userData.role)); // ✅ Redirect based on role
      } else {
        setErrorMessage("Falha ao entrar. Verifique suas credenciais.");
        toast.error("Falha ao entrar. Verifique suas credenciais.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md mx-auto animate-scale-in">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mb-4 bg-primary/10 rounded-2xl">
            <div className="text-2xl font-bold text-primary">ES</div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">EmpowerSquad</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Plataforma de gestão de comunidades de vendas
          </p>
        </div>

        <Card className="neo border-none">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="neo-inset"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="neo-inset"
                />
              </div>

              {successMessage && (
                <p className="mb-2 text-green-600 font-medium">
                  {successMessage}
                </p>
              )}
              {errorMessage && (
                <p className="mb-2 text-red-600 font-medium">{errorMessage}</p>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full transition-all"
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </CardContent>
          </form>

          <div className="text-sm text-center mt-4">
            <span className="text-muted-foreground">Não tem uma conta? </span>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-primary hover:underline"
            >
              Crie uma
            </button>
          </div>

          <CardFooter className="flex justify-center border-t text-xs text-muted-foreground p-4">
            EmpowerSquad &copy; {new Date().getFullYear()}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
