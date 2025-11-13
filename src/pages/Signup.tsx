import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "@/services/auth-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Signup: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [department, setDepartment] = useState("");
  const [cpf, setCpf] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !role || !department || !cpf) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    try {
      const user = await signUp(firstName, lastName, email, password, role, department , cpf);

      if (user) {
        toast.success("Conta criada com sucesso!");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Erro ao criar conta. Tente novamente.");
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
      Crie sua conta para acessar o painel de chamados
    </p>
  </CardHeader>

  <CardContent>
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nome */}
      <div>
        <Label htmlFor="firstName" className="text-gray-200">
          Nome
        </Label>
        <Input
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Seu nome"
          className="bg-white/20 border-white/30 text-white placeholder-gray-300"
        />
      </div>

      {/* Sobrenome */}
      <div>
        <Label htmlFor="lastName" className="text-gray-200">
          Sobrenome
        </Label>
        <Input
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Seu sobrenome"
          className="bg-white/20 border-white/30 text-white placeholder-gray-300"
        />
      </div>

      {/* CPF */}
      <div>
        <Label htmlFor="cpf" className="text-gray-200">
          CPF
        </Label>
        <Input
          id="cpf"
          value={cpf}
          onChange={(e) =>
            setCpf(
              e.target.value
                .replace(/\D/g, "")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
            )
          }
          placeholder="000.000.000-00"
          maxLength={14}
          className="bg-white/20 border-white/30 text-white placeholder-gray-300"
        />
      </div>

      {/* Email */}
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

      {/* Senha */}
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

      {/* Tipo de usuário */}
      <div>
        <Label htmlFor="role" className="text-gray-200">
          Tipo de usuário
        </Label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as "admin" | "user")}
          className="w-full p-2 rounded-md bg-white/20 border border-white/30 text-white focus:ring-2 focus:ring-blue-500 appearance-none"
        >
          <option value="user" className="text-gray-900 bg-white">
            Usuário
          </option>
          <option value="admin" className="text-gray-900 bg-white">
            Administrador
          </option>
        </select>
      </div>

      {/* Departamento */}
      <div>
        <Label htmlFor="department" className="text-gray-200">
          Departamento
        </Label>
        <select
          id="department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full p-2 rounded-md bg-white/20 border border-white/30 text-white focus:ring-2 focus:ring-blue-500 appearance-none"
        >
          <option value="" className="text-gray-900 bg-white">
            Selecione o departamento
          </option>
          <option value="Suporte" className="text-gray-900 bg-white">
            Suporte
          </option>
          <option value="Marketing" className="text-gray-900 bg-white">
            Marketing
          </option>
          <option value="Vendas" className="text-gray-900 bg-white">
            Vendas
          </option>
          <option value="TI" className="text-gray-900 bg-white">
            TI
          </option>
        </select>
      </div>

      {/* Botão */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white mt-4"
      >
        {isLoading ? "Criando..." : "Criar Conta"}
      </Button>
    </form>
  </CardContent>
</Card>

    </div>
  );
};

export default Signup;
