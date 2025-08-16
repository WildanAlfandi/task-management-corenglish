"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { mockTaskApi as taskApi } from "@/lib/api/mock-tasks";
import Button from "@/components/ui/Button";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, FileText, AlignLeft, Sparkles } from "lucide-react";

export default function CreateTaskPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ title?: string }>({});

  const mutation = useMutation({
    mutationFn: taskApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created successfully! 🎉", {
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
    onError: (error: any) => {
      toast.error(error.message || "Failed to create task");
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
    });
  };

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
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Create New Task
                </h1>
                <p className="text-white/90 mt-1">
                  Add a new task to your workflow
                </p>
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

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1 bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-bold py-3 px-6 rounded-xl hover:from-orange-500 hover:to-yellow-500 transform hover:scale-[1.02] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span> Creating...
                  </span>
                ) : (
                  "Create Task"
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
