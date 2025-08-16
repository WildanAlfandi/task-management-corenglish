import axios from "axios";
import {
  Task,
  TasksResponse,
  CreateTaskDto,
  UpdateTaskDto,
} from "@/types/task";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const taskApi = {
  getTasks: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<TasksResponse> => {
    const { data } = await api.get("/tasks", { params });
    return data;
  },

  getTask: async (id: string): Promise<Task> => {
    const { data } = await api.get(`/tasks/${id}`);
    return data;
  },

  createTask: async (task: CreateTaskDto): Promise<Task> => {
    const { data } = await api.post("/tasks", task);
    return data;
  },

  updateTask: async (id: string, task: UpdateTaskDto): Promise<Task> => {
    const { data } = await api.patch(`/tasks/${id}`, task);
    return data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};
