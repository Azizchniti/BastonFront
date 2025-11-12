import { motion } from "framer-motion";

export const TaskCard = ({ task, departments, onSelect, user }) => {
  const departmentName =
    departments.find((d) => d.id === task.department_id)?.name || "—";

  // Only for support tasks: find who added the current user
  const addedBy =
    task.task_support_members?.find((s) => s.user_id === user)
      ?.added_by_user;

    const creator = task.creator;

const statusLabels = {
  new: "🆕 Nova",
  in_progress: "⏳ Em andamento",
  completed: "✅ Concluída",
};

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="p-4 bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-1">
        {task.title}
      </h3>
      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
        {task.description || "Sem descrição"}
      </p>

      <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md">
          {departmentName}
        </span>
       <span>{statusLabels[task.status] || "🆕 Nova"}</span>

      </div>
      {/* Creator */}
    {creator && (
      <p className="text-xs text-gray-500 italic">
        Criada por: {creator.first_name} {creator.last_name} ({creator.department})
      </p>
    )  }

      {addedBy && (
        <p className="text-xs text-gray-500 italic">
          Adicionado por: {addedBy.first_name} {addedBy.last_name}
        </p>
      )}
    </motion.div>
  );
};