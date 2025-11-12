"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/services/taskService";
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


export default function ChamadosPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department_id: "",
    deadline: "",
  });

  // ✅ Load all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error("Error fetching chamados:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
  const fetchDepartments = async () => {
    const { data, error } = await supabase.from("departments").select("*");
    if (!error) setDepartments(data);
  };
  fetchDepartments();
}, []);

  // ✅ Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Create or update
  const handleSubmit = async () => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData);
      } else {
        await createTask(formData);
      }
      fetchTasks();
      setOpenDialog(false);
      setEditingTask(null);
      setFormData({ title: "", description: "", department_id: "", deadline: "" });
    } catch (err) {
      console.error("Error saving chamado:", err);
    }
  };

  // ✅ Delete
  const handleDelete = async (taskId: string) => {
    if (!confirm("Tem certeza que deseja excluir este chamado?")) return;
    try {
      await deleteTask(taskId);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting chamado:", err);
    }
  };

  // ✅ Open edit modal
  const openEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      department_id: task.department_id,
      deadline: task.deadline || "",
    });
    setOpenDialog(true);
  };

  return (
  <div className="p-8 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-between items-center mb-8"
    >
      <h1 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
        📋 Gerenciamento de Chamados
      </h1>
      <Button onClick={() => setOpenDialog(true)} className="bg-blue-600 hover:bg-blue-700">
        + Novo Chamado
      </Button>
    </motion.div>

    {loading ? (
      <p className="text-gray-600">Carregando chamados...</p>
    ) : (
      <motion.div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {tasks.map((task) => {
          const departmentName =
            departments.find((d) => d.id === task.department_id)?.name ||
            "Sem departamento";

          const deadlineDate = task.deadline
            ? new Date(task.deadline)
            : null;

          const daysLeft = deadlineDate
            ? Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            : null;

          const deadlineColor =
            daysLeft === null
              ? "text-gray-400"
              : daysLeft < 0
              ? "text-red-600"
              : daysLeft <= 3
              ? "text-yellow-600"
              : "text-green-600";

          return (
            <motion.div
              key={task.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
            
      <Card
        key={task.id}
        className="flex flex-col justify-between h-64 shadow-lg hover:shadow-2xl transition-all border border-slate-200 rounded-2xl bg-white/80 backdrop-blur-sm"
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-1">
                {task.title}
              </CardTitle>
              <p className="text-sm text-gray-500">{departmentName}</p>
            </div>
            <div className="flex space-x-2">
              <Button
                size="icon"
                variant="outline"
                className="rounded-full p-2 hover:bg-blue-50"
                onClick={() => openEdit(task)}
              >
                ✏️
              </Button>
              <Button
                size="icon"
                variant="destructive"
                className="rounded-full p-2"
                onClick={() => handleDelete(task.id)}
              >
                🗑️
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col justify-between flex-1">
          <p className="text-gray-700 text-sm mt-1 line-clamp-3">
            {task.description || "Sem descrição"}
          </p>

          <div className="mt-4 flex flex-wrap justify-between items-center gap-2">
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                task.status === "novo"
                  ? "bg-blue-100 text-blue-700"
                  : task.status === "em andamento"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {task.status || "Pendente"}
            </span>

            {deadlineDate && (
              <div className="flex items-center text-sm font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 mr-1 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10m-11 8h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className={deadlineColor}>
                  {deadlineDate.toLocaleDateString("pt-BR")}{" "}
                  {daysLeft !== null && (
                    <span className="text-xs text-gray-500 ml-1">
                      ({daysLeft >= 0
                        ? `em ${daysLeft} dias`
                        : `${Math.abs(daysLeft)} dias atrasado`})
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
            </motion.div>
          );
        })}
      </motion.div>
    )}

      {/* ✅ Dialog for Create/Edit */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Editar Chamado" : "Novo Chamado"}
            </DialogTitle>
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
                onValueChange={(v) =>
                  setFormData({ ...formData, department_id: v })
                }
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
            <Button onClick={handleSubmit}>
              {editingTask ? "Salvar Alterações" : "Criar Chamado"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
