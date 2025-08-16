import { FC } from "react";
import { Filter } from "lucide-react";

interface TaskFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const TaskFilter: FC<TaskFilterProps> = ({ value, onChange }) => {
  const filters = [
    { value: "", label: "All Tasks", color: "bg-gray-100 text-gray-700" },
    { value: "TO_DO", label: "To Do", color: "bg-gray-100 text-gray-700" },
    {
      value: "IN_PROGRESS",
      label: "In Progress",
      color: "bg-blue-100 text-blue-700",
    },
    { value: "DONE", label: "Done", color: "bg-green-100 text-green-700" },
  ];

  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <span className="text-xs sm:text-sm font-medium text-gray-700">
            Filter:
          </span>
        </div>
        <div className="flex gap-1.5 sm:gap-2 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onChange(filter.value)}
              className={`px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                value === filter.value
                  ? filter.color + " ring-2 ring-offset-1 ring-blue-500"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskFilter;
