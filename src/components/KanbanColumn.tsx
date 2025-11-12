import { motion } from "framer-motion";
import { TaskCard } from "./TaskCard";

export const KanbanColumn = ({
  title,
  icon,
  color,
  tasks,
  emptyMessage,
  departments,
  onSelectTask,
}) => {
  return (
    <motion.section
      whileHover={{ y: -3 }}
      className="flex flex-col bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
    >
      {/* Gradient Header */}
      <div
        className={`p-4 bg-gradient-to-r ${color} text-white font-semibold text-lg flex items-center gap-3 shadow-md`}
      >
        <span className="text-2xl">{icon}</span>
        <h2>{title}</h2>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {tasks.length === 0 ? (
          <p className="text-gray-500 italic text-sm">{emptyMessage}</p>
        ) : (
          <div className="flex flex-col gap-4">
            {tasks.map((task) => (
              <TaskCard
                    key={task.id}
                    task={task}
                    departments={departments}
                    onSelect={() => onSelectTask(task)} user={undefined}              />
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};
