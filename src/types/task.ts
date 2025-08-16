export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "TO_DO" | "IN_PROGRESS" | "DONE";
  createdAt: string;
  updatedAt: string;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: "TO_DO" | "IN_PROGRESS" | "DONE";
}
