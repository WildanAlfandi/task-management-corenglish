"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockTaskApi as taskApi } from "@/lib/api/mock-tasks";
import { UpdateTaskDto } from "@/types/task";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  FileText,
  AlignLeft,
  Edit3,
  CheckSquare,
  Clock,
  Circle,
} from "lucide-react";

type TaskStatus = "TO_DO" | "IN_PROGRESS" | "DONE";

export default function EditTaskPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TO_DO");
  const [errors, setErrors] = useState<{ title?: string }>({});

  const {
    data: task,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["task", id],
    queryFn: () => taskApi.getTask(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setStatus(task.status);
    }
  }, [task]);

  const mutation = useMutation({
    mutationFn: (data: UpdateTaskDto) => taskApi.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", id] });

      toast.success("Task updated successfully! ✨", {
        style: {
          borderRadius: "10px",
          background: "#F97316",
          color: "#fff",
        },
      });
      setTimeout(() => {
        router.push("/");
      }, 100);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update task");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { title?: string } = {};
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    mutation.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading task...</p>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-white">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-red-500 mb-4 text-lg font-semibold">
            Task not found
          </p>
          <Link href="/">
            <button className="px-6 py-3 bg-orange-400 text-white font-bold rounded-xl hover:bg-orange-500 transition-colors">
              Back to Tasks
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const statusOptions: {
    value: TaskStatus;
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    borderColor: string;
  }[] = [
    {
      value: "TO_DO",
      label: "To Do",
      icon: Circle,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-300",
    },
    {
      value: "IN_PROGRESS",
      label: "In Progress",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-300",
    },
    {
      value: "DONE",
      label: "Done",
      icon: CheckSquare,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-300",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8 max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center text-gray-700 hover:text-orange-600 mb-8 transition-colors group font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Tasks
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl border border-orange-100 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-orange-400 to-yellow-400 p-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur rounded-xl">
                <Edit3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Edit Task</h1>
                <p className="text-white/90 mt-1">Modify your task details</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Title Field */}
            <div className="group">
              <label
                htmlFor="title"
                className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2"
              >
                <FileText className="w-4 h-4 text-orange-500" />
                Task Title
                <span className="text-red-500 font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setErrors({ ...errors, title: undefined });
                  }}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all ${
                    errors.title
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-200 focus:border-orange-400 focus:ring-orange-100"
                  }`}
                  placeholder="e.g., Complete project documentation"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {title && !errors.title && (
                    <span className="text-green-500 text-xl">✓</span>
                  )}
                </div>
              </div>
              {errors.title && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1 font-medium">
                  <span>⚠</span> {errors.title}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div className="group">
              <label
                htmlFor="description"
                className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2"
              >
                <AlignLeft className="w-4 h-4 text-orange-500" />
                Description
                <span className="text-gray-500 text-xs font-normal">
                  (Optional)
                </span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:border-orange-400 focus:ring-orange-100 transition-all resize-none"
                placeholder="Add more details about this task..."
              />
              <p className="mt-1 text-xs text-gray-500 font-medium">
                {description.length}/500 characters
              </p>
            </div>

            {/* Status Field */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
                <CheckSquare className="w-4 h-4 text-orange-500" />
                Status
              </label>
              <div className="grid grid-cols-3 gap-3">
                {statusOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = status === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setStatus(option.value)}
                      className={`p-4 rounded-xl border-2 transition-all transform hover:scale-[1.02] ${
                        isSelected
                          ? `${option.borderColor} ${option.bgColor} ring-2 ring-offset-2 ring-orange-400`
                          : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 mx-auto mb-2 ${
                          isSelected ? option.color : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`text-sm font-bold ${
                          isSelected ? option.color : "text-gray-600"
                        }`}
                      >
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1 bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-bold py-3 px-6 rounded-xl hover:from-orange-500 hover:to-yellow-500 transform hover:scale-[1.02] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span> Updating...
                  </span>
                ) : (
                  "Update Task"
                )}
              </button>
              <Link href="/" className="flex-1">
                <button
                  type="button"
                  className="w-full py-3 px-6 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
