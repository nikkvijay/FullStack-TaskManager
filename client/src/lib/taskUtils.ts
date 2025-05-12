import type { Task } from "@/types/task";

export const getStatusDetails = (task: Task) => {
  if (task.completed) {
    return {
      label: "Completed",
      variant: "outline" as const,
      color: "text-green-600 border-green-600 bg-green-50",
    };
  }

  const today = new Date().toISOString().split("T")[0];
  if (task.dueDate < today) {
    return {
      label: "Overdue",
      variant: "outline" as const,
      color: "text-red-600 border-red-600 bg-red-50",
    };
  }

  return {
    label: "In Progress",
    variant: "outline" as const,
    color: "text-amber-600 border-amber-600 bg-amber-50",
  };
};
