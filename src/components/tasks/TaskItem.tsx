import { FC } from "react";
import { Task } from "@/types/task";
import Link from "next/link";
import { Pencil, Trash2, Clock, CheckCircle, Circle } from "lucide-react";

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
}

const TaskItem: FC<TaskItemProps> = ({ task, onDelete }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "TO_DO":
        return <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />;
      case "IN_PROGRESS":
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />;
      case "DONE":
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />;
      default:
        return <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "TO_DO":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "IN_PROGRESS":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "DONE":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatStatus = (status: string) => {
    return status.replace("_", " ");
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-200 overflow-hidden">
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="mt-0.5 flex-shrink-0">
                {getStatusIcon(task.status)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors break-words">
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-3 break-words">
                    {task.description}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium border ${getStatusStyle(
                      task.status
                    )} w-fit`}
                  >
                    {formatStatus(task.status)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons - Always visible on mobile */}
          <div className="flex items-center gap-1 flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <Link href={`/tasks/edit/${task.id}`}>
              <button className="p-1.5 sm:p-2 hover:bg-blue-50 rounded-lg transition-colors">
                <Pencil className="w-4 h-4 text-gray-400 hover:text-blue-600" />
              </button>
            </Link>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1.5 sm:p-2 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
