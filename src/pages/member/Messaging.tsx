"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTaskMessages, addTaskMessage, getTaskById } from "@/services/taskService";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Message, Task } from "@/types";

export default function TaskMessages() {
  const { taskId } = useParams<{ taskId: string }>(); // 👈 get taskId from URL
  const { user } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [taskLoading, setTaskLoading] = useState(true);

  // 🟦 Fetch task info (title + department)
  useEffect(() => {
    if (!taskId) return;
    const fetchTask = async () => {
      try {
        const t = await getTaskById(taskId);
        setTask(t);
      } catch (err) {
        console.error("Error fetching task:", err);
      } finally {
        setTaskLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

  // 🟦 Fetch messages + polling
  useEffect(() => {
    if (!taskId) return;
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [taskId]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const msgs = await getTaskMessages(taskId!);
      setMessages(msgs);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      const msg = await addTaskMessage(taskId!, newMessage,false);
      setMessages((prev) => [...prev, msg]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

return (
  <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    {/* Task Info */}
    <div className="p-6 border-b border-gray-200 flex-shrink-0">
      {taskLoading ? (
        <p className="text-gray-500">Carregando informações do chamado...</p>
      ) : task ? (
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{task.title}</h1>
          {task.department && (
            <p className="text-gray-600 text-sm">
              Departamento: {task.department.name}
            </p>
          )}
        </div>
      ) : (
        <p className="text-red-500">Erro ao carregar o chamado.</p>
      )}
    </div>

    {/* Messages area */}
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
      {loading ? (
        <p className="text-gray-500">Carregando mensagens...</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-500">Nenhuma mensagem ainda.</p>
      ) : (
        messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg max-w-xl ${
              msg.sender_id === user?.id
                ? "bg-blue-100 text-blue-900 ml-auto"
                : "bg-gray-200 text-gray-800 mr-auto"
            }`}
          >
            {msg.sender && (
              <p className="text-xs font-semibold mb-1">
                {msg.sender.first_name} {msg.sender.last_name}
              </p>
            )}
            <p>{msg.content}</p>
            <span className="text-xs text-gray-500 mt-1 block">
              {new Date(msg.created_at).toLocaleString("pt-BR")}
            </span>
          </motion.div>
        ))
      )}
    </div>

    {/* 🧷 Sticky input bar */}
    <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 flex gap-2">
      <input
        type="text"
        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Escreva uma mensagem..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        Enviar
      </button>
    </div>
  </div>
);


}
