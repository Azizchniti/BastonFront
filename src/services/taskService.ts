import axios from "axios";
import { Task, Message } from "@/types";

//const API_URL = import.meta.env.VITE_API_URL + "/tasks"; 
// Example: 'http://localhost:5000/api/tasks'
//const API_URL = 'http://localhost:5000/api/tasks';
const API_URL = 'http://91.99.48.218:5000/api/tasks';
// Get token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// ✅ Create new task (Chamado)
export const createTask = async (taskData: {
  title: string;
  description: string;
  department_id: string;
  deadline?: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}`, taskData, getAuthHeader());
    return response.data.task;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Erro ao criar chamado.");
  }
};

// ✅ Get all tasks (optionally filtered by status)
export const getTasks = async (status?: string): Promise<Task[]> => {
  try {
    const response = await axios.get(`${API_URL}`, {
      params: { status },
      ...getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Erro ao carregar chamados.");
  }
};

// ✅ Get task by ID (with users and messages)
export const getTaskById = async (taskId: string): Promise<Task> => {
  try {
    const response = await axios.get(`${API_URL}/${taskId}/full`, getAuthHeader());
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Erro ao buscar detalhes do chamado.");
  }
};

// ✅ Update task
export const updateTask = async (taskId: string, updateData: Partial<Task>) => {
  try {
    const response = await axios.put(`${API_URL}/${taskId}`, updateData, getAuthHeader());
    return response.data.task;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Erro ao atualizar chamado.");
  }
};
// ✅ Update task status
export const updateTaskStatus = async (taskId: string, status: string) => {
  try {
    const response = await axios.put(
      `${API_URL}/${taskId}`,
      { status },
      getAuthHeader()
    );
    return response.data.task;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Erro ao atualizar status do chamado.");
  }
};


// ✅ Delete task
export const deleteTask = async (taskId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${taskId}`, getAuthHeader());
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Erro ao deletar chamado.");
  }
};

// ✅ Assume responsibility for a task (or join as support)
export const assumeTask = async (taskId: string) => {
  try {
    const response = await axios.post(`${API_URL}/${taskId}/assume`, {}, getAuthHeader());
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Erro ao assumir chamado.");
  }
};

// ✅ Add support user to task
export const addSupportUser = async (taskId: string, userId: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/${taskId}/support`,
      { userId },
      getAuthHeader()
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Erro ao adicionar suporte.");
  }
};

// ✅ Get support users for a task
export const getTaskSupport = async (taskId: string) => {
  try {
    const response = await axios.get(`${API_URL}/${taskId}/support`, getAuthHeader());
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Erro ao buscar suporte.");
  }
};

// ✅ Get messages for a task
export const getTaskMessages = async (taskId: string): Promise<Message[]> => {
  try {
    const response = await axios.get(`${API_URL}/${taskId}/messages`, getAuthHeader());
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Erro ao carregar mensagens.");
  }
};

// ✅ Add message to task
export const addTaskMessage = async (
  taskId: string,
  message: string,
  is_ai = false
) => {
  try {
    const response = await axios.post(
      `${API_URL}/${taskId}/messages`,
      { content: message, is_ai },
      getAuthHeader()
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Erro ao enviar mensagem.");
  }
};

