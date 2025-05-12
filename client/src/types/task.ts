export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;       // "YYYY-MM-DD"
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type { Task };


