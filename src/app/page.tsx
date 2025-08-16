"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockTaskApi as taskApi } from "@/lib/api/mock-tasks";
import TaskList from "@/components/tasks/TaskList";
import TaskFilter from "@/components/tasks/TaskFilter";
import Pagination from "@/components/tasks/Pagination";
import Button from "@/components/ui/Button";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Plus,
  ListTodo,
  Loader2,
  Circle,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks", { status, page, limit }],
    queryFn: () =>
      taskApi.getTasks({
        status: status || undefined,
        page,
        limit,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: taskApi.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted successfully", {
        icon: "🗑️",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setPage(1);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-sm w-full">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-red-500 mb-4 text-lg">Error loading tasks</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const stats = {
    total: data?.total || 0,
    todo: data?.tasks?.filter((t) => t.status === "TO_DO").length || 0,
    inProgress:
      data?.tasks?.filter((t) => t.status === "IN_PROGRESS").length || 0,
    done: data?.tasks?.filter((t) => t.status === "DONE").length || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header - Mobile Optimized */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 backdrop-blur-lg bg-white/90">
        <div className="container mx-auto px-4 py-3 sm:py-4 max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex-shrink-0">
                <ListTodo className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Task Management
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                  Organize and track your tasks efficiently
                </p>
              </div>
            </div>

            {/* Add Task Button - Mobile Optimized */}
            <Link href="/tasks/create" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-bold rounded-xl hover:from-orange-500 hover:to-yellow-500 transform hover:scale-[1.02] transition-all shadow-lg">
                <Plus className="w-5 h-5" />
                <span className="text-sm sm:text-base">Add New Task</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
        {/* Stats Cards - Mobile Optimized */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Total Tasks</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-gray-100 rounded-lg">
                <ListTodo className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">To Do</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {stats.todo}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-gray-100 rounded-lg">
                <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-blue-600">In Progress</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">
                  {stats.inProgress}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-green-600">Completed</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {stats.done}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section - Mobile Optimized */}
        <div className="mb-4 sm:mb-6">
          <TaskFilter value={status} onChange={handleStatusChange} />
        </div>

        {/* Task List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-500 text-sm sm:text-base">
              Loading tasks...
            </p>
          </div>
        ) : (
          <>
            <TaskList tasks={data?.tasks || []} onDelete={handleDelete} />

            {(data?.total || 0) > limit && (
              <Pagination
                currentPage={page}
                totalPages={Math.ceil((data?.total || 0) / limit)}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
