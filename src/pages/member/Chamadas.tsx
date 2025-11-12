"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getTasks, createTask, addSupportUser, assumeTask, updateTaskStatus, updateTask } from "@/services/taskService";
import { Task } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import supabase from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext"; // ✅ assuming you have this context
import { UserService } from "@/services/user.service";
import { toast } from "sonner";
import { KanbanColumn } from "@/components/KanbanColumn";
import { useNavigate } from "react-router-dom";
export default function ChamadosPage() {
  const { user } = useAuth(); // ✅ to filter by user department
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [supportUserId, setSupportUserId] = useState("");
  const [supportUsers, setSupportUsers] = useState<any[]>([]);


  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department_id: "",
    deadline: "",
  });

  // ✅ Load tasks only from user department
const fetchTasks = async () => {
  try {
    setLoading(true);

    if (!user) return;

    const token = localStorage.getItem("token"); // or however your app stores it
    const data = await UserService.getUserTasks(user.id, token!);

    if (Array.isArray(data)) {
      setTasks(data);
    } else {
      setTasks([]);
    }
  } catch (err) {
    console.error("Error fetching chamados:", err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  // ✅ Load departments (for creating)
useEffect(() => {
  const fetchDepartments = async () => {
    const { data, error } = await supabase
      .from("departments")
      .select("*");

    if (!error && data) setDepartments(data);
  };

  fetchDepartments();
}, []);

// inside ChamadosPage component
const fetchDepartmentUsers = async (departmentId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token present");
      return;
    }

    const users = await UserService.getUsersByDepartment(departmentId, token);
    // setSupportUsers (state you already created)
    setSupportUsers(users || []);
  } catch (err) {
    console.error("Erro ao carregar usuários do departamento:", err);
    setSupportUsers([]);
  }
};
const handleChangeStatus = async (newStatus: string) => {
  if (!selectedTask) return;
  try {
    await updateTask(selectedTask.id, { status: newStatus }); 
    toast.success(`Status alterado para "${newStatus}" com sucesso!`);
    fetchTasks();
    setShowDetails(false);
  } catch (err: any) {
    toast.error(err.message);
  }
};


const handleAssume = async () => {
  if (!selectedTask) return;
  try {
    await assumeTask(selectedTask.id);
    toast.success("Você assumiu este chamado!");
    fetchTasks();
    setShowDetails(false);
  } catch (err: any) {
    toast.error(err.message);
  }
};

const handleAddSupport = async () => {
  if (!selectedTask || !supportUserId) return;
  try {
    await addSupportUser(selectedTask.id, supportUserId);
    toast.success("Usuário adicionado como suporte!");
    fetchTasks();
    setShowDetails(false);
  } catch (err: any) {
    toast.error(err.message);
  }
};

// ✅ Handle input change
const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

// ✅ Create chamado
const handleSubmit = async () => {
  try {
    // Get department_id from selected form or existing task context
    const selectedDepartmentId = formData.department_id;

    if (!selectedDepartmentId) {
      alert("Selecione um departamento antes de criar o chamado.");
      return;
    }

    await createTask({
      title: formData.title,
      description: formData.description,
      department_id: selectedDepartmentId, // ✅ from the selected value
      deadline: formData.deadline,
    });

    fetchTasks();
    setOpenDialog(false);
    setFormData({
      title: "",
      description: "",
      department_id: "",
      deadline: "",
    });
  } catch (err) {
    console.error("Error creating chamado:", err);
  }
};
const tasksNotAssumed = tasks.filter((task) => !task.responsible_user_id);
const tasksAssumed = tasks.filter((task) => task.responsible_user_id === user.id);
const tasksSupport = tasks.filter(
  (task) =>
    task.task_support_members?.some((s) => s.user_id === user.id)
);
const navigate = useNavigate();


return (
  <div className="p-10 min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 font-[Inter]">
    {/* Header */}
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex justify-between items-center mb-10"
    >
      <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
        <span className="text-5xl">📋</span> Meus Chamados
      </h1>
      <Button
        onClick={() => setOpenDialog(true)}
        className="px-5 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all hover:scale-[1.03]"
      >
        + Novo Chamado
      </Button>
    </motion.div>

    {loading ? (
      <p className="text-gray-600 text-center text-lg animate-pulse">
        Carregando chamados...
      </p>
    ) : (
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* 1️⃣ Tarefas disponíveis */}
        <KanbanColumn
          title="Tarefas disponíveis"
          icon="🟦"
          color="from-blue-600 to-blue-400"
          emptyMessage="Nenhuma tarefa disponível no seu departamento."
          tasks={tasksNotAssumed}
          departments={departments}
          onSelectTask={(task) => {
            setSelectedTask(task);
            setShowDetails(true);
            fetchDepartmentUsers(task.department_id);
          }}
        />

        {/* 2️⃣ Tarefas assumidas */}
        <KanbanColumn
          title="Minhas tarefas assumidas"
          icon="🟩"
          color="from-green-600 to-green-400"
          emptyMessage="Você ainda não assumiu nenhuma tarefa."
          tasks={tasksAssumed}
          departments={departments}
          onSelectTask={(task) => {
            setSelectedTask(task);
            setShowDetails(true);
            fetchDepartmentUsers(task.department_id);
          }}
        />

        {/* 3️⃣ Tarefas de suporte */}
        <KanbanColumn
          title="Tarefas em que sou suporte"
          icon="🟪"
          color="from-purple-600 to-purple-400"
          emptyMessage="Você ainda não é suporte em nenhuma tarefa."
          tasks={tasksSupport}
          departments={departments}
          onSelectTask={(task) => {
            setSelectedTask(task);
            setShowDetails(true);
            fetchDepartmentUsers(task.department_id);
          }}
        />
      </motion.div>
    )}



      {/* ✅ Dialog for creating chamados */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Chamado</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div>
            <Label>Título</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Título do chamado"
            />
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descreva o problema..."
            />
          </div>
          <div>
            <Label>Departamento</Label>
            <Select
              value={formData.department_id}
              onValueChange={(v) => setFormData({ ...formData, department_id: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o departamento" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Prazo</Label>
            <Input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Criar Chamado</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

{/* ✅ Dialog for opening chamados */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
  <DialogContent className="max-w-lg bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200">
    {selectedTask && (
      <>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            {selectedTask.title}
          </DialogTitle>
          <p className="text-sm text-gray-500">
            Departamento:{" "}
            {departments.find((d) => d.id === selectedTask.department_id)?.name ||
              "Sem departamento"}
          </p>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          <p className="text-gray-700 text-sm">{selectedTask.description}</p>

          {/* ✅ Status Select instead of static text */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-gray-600">Status:</span>
            {selectedTask.responsible_user_id === user.id ? (
              <Select
                onValueChange={(value) => handleChangeStatus(value)}
                defaultValue={selectedTask.status}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue
                    placeholder={
                      selectedTask.status === "new"
                        ? "Novo"
                        : selectedTask.status === "in_progress"
                        ? "Em andamento"
                        : "Concluído"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Novo</SelectItem>
                  <SelectItem value="in_progress">Em andamento</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>


                </SelectContent>
              </Select>
            ) : (
              <span
                className={`${
                  selectedTask.status === "new"
                    ? "text-blue-600"
                    : selectedTask.status === "in_progress"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {selectedTask.status === "new"
                  ? "Novo"
                  : selectedTask.status === "in_progress"
                  ? "Em andamento"
                  : "Concluído"}
              </span>
            )}
          </div>

          {selectedTask.deadline && (
            <p className="text-sm text-gray-600">
              Prazo:{" "}
              {new Date(selectedTask.deadline).toLocaleDateString("pt-BR")}
            </p>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
          {selectedTask.responsible_user_id !== user.id ? (
            // If current user is NOT responsible → show "Assumir chamado"
            <Button
              onClick={handleAssume}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              Assumir chamado
            </Button>
          ) : (
            // If responsible → show "Adicionar suporte"
            <>
              <Select onValueChange={(value) => setSupportUserId(value)}>
                <SelectTrigger className="w-full sm:w-auto">
                  <SelectValue placeholder="Selecione um suporte" />
                </SelectTrigger>
                <SelectContent>
                  {supportUsers.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.first_name} {u.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleAddSupport}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
              >
                Adicionar suporte
              </Button>
            </>
          )}

          {/* 🗨️ Ver mensagens */}
          <Button
            onClick={() => navigate(`/user/messages/${selectedTask.id}`)}
            className="w-full sm:w-auto bg-gray-700 hover:bg-gray-800 text-white"
          >
            💬 Ver mensagens
          </Button>
        </DialogFooter>
      </>
    )}
  </DialogContent>
</Dialog>


    </div>
  );
}
