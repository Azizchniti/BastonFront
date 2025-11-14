import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTasks, updateTask, assumeTask } from "@/services/taskService";
import supabase from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { UserService } from "@/services/user.service";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MeusChamadosPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
const navigate = useNavigate();
  // ✅ Fetch tasks created by the logged-in user
const fetchCreatedTasks = async () => {
  if (!user) return;

  try {
    setLoading(true);

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("created_by", user.id);

    if (error) throw error;

    setTasks(data || []);

  } catch (err) {
    console.error("Error fetching created tasks:", err);
    setTasks([]);
  } finally {
    setLoading(false);
  }
};



  // ✅ Fetch departments
  const fetchDepartments = async () => {
    const { data, error } = await supabase.from("departments").select("*");
    if (!error && data) setDepartments(data);
    else console.error("Error fetching departments:", error);
  };

  // ✅ Load tasks and departments after user is ready
  useEffect(() => {
    if (!user) return;
    fetchCreatedTasks();
    fetchDepartments();
    console.log("Auth user object → ", user);
  }, [user]);

  // ✅ Task actions
  const handleChangeStatus = async (newStatus: string) => {
    if (!selectedTask) return;
    try {
      await updateTask(selectedTask.id, { status: newStatus });
      toast.success(`Status alterado para "${newStatus}" com sucesso!`);
      fetchCreatedTasks();
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
      fetchCreatedTasks();
      setShowDetails(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const [selectedDepartment, setSelectedDepartment] = useState("Todos");

const filteredTasks = tasks.filter((task) => {
  if (selectedDepartment === "Todos") return true;

  const dept = departments.find(
    (d) => String(d.id) === String(task.department_id)
  );

  return dept?.name === selectedDepartment;
});


  if (!user) return <p className="p-6 text-white">Carregando usuário...</p>;

return (
  <div className="p-6 min-h-screen bg-gray-100 text-gray-800">
    <h1 className="text-3xl font-bold mb-6 text-gray-900">
      Chamados Criados por Mim
    </h1>

    {/* 🔥 Department Filter */}
    <div className="flex gap-3 mb-6 flex-wrap">
      {["Todos", "TI", "Suporte", "Vendas", "Marketing"].map((dep) => (
        <button
          key={dep}
          onClick={() => setSelectedDepartment(dep)}
          className={`
            px-4 py-2 rounded-lg text-sm font-semibold transition 
            border shadow-sm
            ${
              selectedDepartment === dep
                ? "bg-purple-600 border-purple-600 text-white shadow-md"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }
          `}
        >
          {dep}
        </button>
      ))}
    </div>

    {/* Loading / Empty */}
    {loading ? (
      <p>Carregando chamados...</p>
    ) : filteredTasks.length === 0 ? (
      <p>Nenhum chamado encontrado.</p>
    ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
  {filteredTasks.map((task) => {
    const dept = departments.find(
      (d) => String(d.id) === String(task.department_id)
    );

    // Choose a soft color per department
    const deptColors: any = {
      TI: "from-blue-400 to-blue-600",
      Suporte: "from-green-400 to-green-600",
      Vendas: "from-yellow-400 to-yellow-600",
      Marketing: "from-pink-400 to-pink-600",
      default: "from-gray-300 to-gray-500",
    };
    const gradient = deptColors[dept?.name || "default"];

    return (
      <Card
        key={task.id}
        className="rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200"
        onClick={() => {
          setSelectedTask(task);
          setShowDetails(true);
        }}
      >
        {/* Header with gradient */}
        <div className={`bg-gradient-to-r ${gradient} p-4`}>
          <h2 className="text-xl font-bold text-white truncate">{task.title}</h2>
        </div>

        <CardContent className="p-5 bg-white">
          <p className="text-gray-600 mb-3 line-clamp-3">{task.description}</p>

          <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
            <p>
              <span className="font-semibold text-gray-700">Dep:</span> {dept?.name}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Prazo:</span>{" "}
              {new Date(task.deadline).toLocaleDateString()}
            </p>
          </div>

          {/* Status Badge */}
          <span
            className={`
              inline-block px-3 py-1 text-xs font-bold rounded-full
              ${
                task.status === "done"
                  ? "bg-green-100 text-green-800"
                  : task.status === "in_progress"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }
            `}
          >
            {task.status.toUpperCase()}
          </span>
        </CardContent>
      </Card>
    );
  })}
</div>

    )}

    {/* 🔥 Modal */}
    {showDetails && selectedTask && (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            {selectedTask.title}
          </h2>

          <p className="text-gray-700 mb-4">{selectedTask.description}</p>

          <p className="text-sm text-gray-600 mb-6">
            Prazo:{" "}
            <span className="text-gray-900 font-semibold">
              {new Date(selectedTask.deadline).toLocaleDateString()}
            </span>
          </p>

          {/* Status Buttons */}
       {/* Status Section */}
<div className="flex items-center gap-2 text-sm mb-6">
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
      className={`font-semibold ${
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


          {/* Footer */}
          <div className="flex justify-between items-center">
           <Button
                      onClick={() => navigate(`/user/messages/${selectedTask.id}`)}
                      className="w-full sm:w-auto bg-gray-700 hover:bg-gray-800 text-white"
                    >
                      💬 Ver mensagens
                    </Button>

            <Button
              variant="ghost"
              onClick={() => setShowDetails(false)}
              className="text-gray-600 hover:text-gray-900"
            >
              Fechar
            </Button>
          </div>
        </div>
      </div>
    )}
  </div>
);
    }
