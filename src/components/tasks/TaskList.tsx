import { FC } from "react";
import { Task } from "@/types/task";
import TaskItem from "./TaskItem";
import { Inbox } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
}

const TaskList: FC<TaskListProps> = ({ tasks, onDelete }) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
        <Inbox className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg font-medium mb-2">No tasks found</p>
        <p className="text-gray-400 text-sm">
          Create your first task to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default TaskList;
