import {
  Task,
  TasksResponse,
  CreateTaskDto,
  UpdateTaskDto,
} from "@/types/task";

let mockTasks: Task[] = [
  {
    id: "1",
    title: "Complete project documentation",
    description: "Write comprehensive documentation for the API endpoints",
    status: "IN_PROGRESS",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "2",
    title: "Review pull requests",
    description: "Check and review pending pull requests",
    status: "TO_DO",
    createdAt: "2024-01-20T11:00:00Z",
    updatedAt: "2024-01-20T11:00:00Z",
  },
  {
    id: "3",
    title: "Deploy to production",
    description: "Deploy the latest changes to production server",
    status: "DONE",
    createdAt: "2024-01-20T12:00:00Z",
    updatedAt: "2024-01-20T12:00:00Z",
  },
  {
    id: "4",
    title: "Fix bug in authentication",
    description: "Resolve the login issue reported by users",
    status: "TO_DO",
    createdAt: "2024-01-20T13:00:00Z",
    updatedAt: "2024-01-20T13:00:00Z",
  },
  {
    id: "5",
    title: "Update dependencies",
    description: "Update all npm packages to latest versions",
    status: "IN_PROGRESS",
    createdAt: "2024-01-20T14:00:00Z",
    updatedAt: "2024-01-20T14:00:00Z",
  },
];

let nextId = 6;

export const mockTaskApi = {
  getTasks: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<TasksResponse> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filteredTasks = [...mockTasks];

    // Filter by status if provided
    if (params?.status) {
      filteredTasks = filteredTasks.filter(
        (task) => task.status === params.status
      );
    }

    // Pagination
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      tasks: filteredTasks.slice(start, end),
      total: filteredTasks.length,
      page,
      limit,
    };
  },

  getTask: async (id: string): Promise<Task> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const task = mockTasks.find((t) => t.id === id);
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  },

  createTask: async (taskDto: CreateTaskDto): Promise<Task> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newTask: Task = {
      id: String(nextId++),
      title: taskDto.title,
      description: taskDto.description,
      status: "TO_DO",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTasks.unshift(newTask); // Add to beginning
    return newTask;
  },

  updateTask: async (id: string, taskDto: UpdateTaskDto): Promise<Task> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = mockTasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error("Task not found");
    }

    mockTasks[index] = {
      ...mockTasks[index],
      ...taskDto,
      updatedAt: new Date().toISOString(),
    };
    return { ...mockTasks[index] };
  },

  deleteTask: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const index = mockTasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error("Task not found");
    }
    mockTasks.splice(index, 1);
  },
};
