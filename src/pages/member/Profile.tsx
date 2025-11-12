"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Hash,
  Mail,
  UserCircle2,
  ClipboardEdit,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { User as UserType } from "@/types";
import { UserService } from "@/services/user.service";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const token = user.token;
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Editable fields
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedCPF, setEditedCPF] = useState("");
  const [editedDepartment, setEditedDepartment] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      if (user?.id && token) {
        try {
          const userData = await UserService.getUserById(user.id, token);
          setCurrentUser(userData);
          setEditedFirstName(userData.first_name || "");
          setEditedLastName(userData.last_name || "");
          setEditedEmail(userData.email || "");
          setEditedCPF(userData.cpf || "");
          setEditedDepartment(userData.department || "");
        } catch (err) {
          console.error("Failed to fetch user:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUser();
  }, [user?.id, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 animate-pulse">
        Carregando informações do usuário...
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 font-[TT Commons Pro]">
      {/* HEADER SECTION */}
      <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 p-6 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="p-[3px] bg-gradient-to-br from-white/40 to-white/10 rounded-full">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-2">
              <UserCircle2 className="w-20 h-20 text-white opacity-90" />
            </div>
          </div>
          <div className="text-center sm:text-left space-y-1">
            {editMode ? (
              <div className="flex flex-col sm:flex-row gap-2 justify-center sm:justify-start">
                <input
                  type="text"
                  value={editedFirstName}
                  onChange={(e) => setEditedFirstName(e.target.value)}
                  className="text-gray-900 rounded-md px-3 py-1 text-center sm:text-left"
                  placeholder="Nome"
                />
                <input
                  type="text"
                  value={editedLastName}
                  onChange={(e) => setEditedLastName(e.target.value)}
                  className="text-gray-900 rounded-md px-3 py-1 text-center sm:text-left"
                  placeholder="Sobrenome"
                />
              </div>
            ) : (
              <h1 className="text-3xl font-bold tracking-tight">
                {currentUser.first_name} {currentUser.last_name}
              </h1>
            )}

            {editMode ? (
              <input
                type="email"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                className="text-gray-900 rounded-md px-3 py-1 w-full text-center sm:text-left"
                placeholder="Email"
              />
            ) : (
              <p className="text-sm opacity-90">{currentUser.email}</p>
            )}

            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              <span className="bg-white/20 backdrop-blur-md text-sm px-3 py-1 rounded-full border border-white/30 font-medium">
                {currentUser.role === "admin" ? "Administrador" : "Usuário"}
              </span>
              <span className="bg-blue-500/40 backdrop-blur-md text-sm px-3 py-1 rounded-full border border-white/20 font-medium flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> {currentUser.department}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* INFO SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {/* CPF */}
        <Card className="shadow-lg border border-slate-200 bg-white/70 backdrop-blur-sm hover:shadow-2xl transition">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-700">
              <Hash className="w-4 h-4 text-blue-600" /> CPF
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editMode ? (
              <input
                type="text"
                value={editedCPF}
                onChange={(e) => setEditedCPF(e.target.value)}
                className="w-full text-center py-2 border rounded-lg border-blue-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
                placeholder="Digite seu CPF"
              />
            ) : (
              <p className="text-lg font-semibold text-center text-gray-800">
                {currentUser.cpf || "—"}
              </p>
            )}
          </CardContent>
        </Card>

        {/* DEPARTMENT */}
        <Card className="shadow-lg border border-slate-200 bg-white/70 backdrop-blur-sm hover:shadow-2xl transition">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-700">
              <Building2 className="w-4 h-4 text-indigo-600" /> Departamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editMode ? (
              <input
                type="text"
                value={editedDepartment}
                onChange={(e) => setEditedDepartment(e.target.value)}
                className="w-full text-center py-2 border rounded-lg border-indigo-300 focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
                placeholder="Digite o departamento"
              />
            ) : (
              <div className="flex justify-center">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
                  <ShieldCheck className="w-4 h-4" /> {currentUser.department}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end mt-8 gap-3">
        {editMode ? (
          <>
            <button
              onClick={async () => {
                if (!token) return;
                try {
                  const updated = await UserService.updateUser(
                    currentUser.id,
                    {
                      first_name: editedFirstName,
                      last_name: editedLastName,
                      email: editedEmail,
                      cpf: editedCPF,
                      department: editedDepartment,
                    },
                    token
                  );
                  toast.success("Dados atualizados com sucesso!");
                  setCurrentUser(updated);
                  setEditMode(false);
                } catch (error) {
                  toast.error("Erro ao atualizar dados.");
                  console.error(error);
                }
              }}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition"
            >
              <CheckCircle2 className="w-4 h-4" /> Salvar
            </button>
            <button
              onClick={() => {
                setEditedFirstName(currentUser.first_name);
                setEditedLastName(currentUser.last_name);
                setEditedEmail(currentUser.email);
                setEditedCPF(currentUser.cpf);
                setEditedDepartment(currentUser.department);
                setEditMode(false);
              }}
              className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-md transition"
            >
              <XCircle className="w-4 h-4" /> Cancelar
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium px-5 py-2.5 rounded-md shadow-sm transition"
          >
            <ClipboardEdit className="w-4 h-4" /> Editar Dados
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
