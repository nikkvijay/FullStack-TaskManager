import axios from "axios";
import { API_BASE_URL } from "@/constants";
import { formatDateForAPI } from "@/lib/dateUtils";
import type { Task } from "../types/task";

const API_URL = `${API_BASE_URL}/api/v1/tasks`;

const handleApiError = (error: any, defaultMessage: string): never => {
  console.error(`${defaultMessage}:`, error);
  const message =
    error.response?.data?.message || error.message || defaultMessage;
  throw new Error(message);
};

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await axios.get(API_URL);
    
    // Log the response for debugging
    
    // Check if response.data is an object with a data property that's an array
    if (response.data && Array.isArray(response.data)) {
      return response.data.map((task: any) => {
        // Ensure dueDate is properly formatted
        let dueDate = task.due_date || task.dueDate || "";
        
        // Convert to YYYY-MM-DD format if needed
        if (dueDate && typeof dueDate === 'string') {
          if (dueDate.includes('T')) {
            dueDate = dueDate.split('T')[0];
          }
        }
        
        return {
          id: task.id,
          title: task.title,
          description: task.description || "",
          dueDate: dueDate,
          completed: Boolean(task.completed),
          createdAt: task.created_at || task.createdAt || "",
          updatedAt: task.updated_at || task.updatedAt || ""
        };
      });
    } else if (response.data && Array.isArray(response.data.data)) {
      // Handle case where response is wrapped in a data property
      return response.data.data.map((task: any) => {
        // Ensure dueDate is properly formatted
        let dueDate = task.due_date || task.dueDate || "";
        
        // Convert to YYYY-MM-DD format if needed
        if (dueDate && typeof dueDate === 'string') {
          if (dueDate.includes('T')) {
            dueDate = dueDate.split('T')[0];
          }
        }
        
        return {
          id: task.id,
          title: task.title,
          description: task.description || "",
          dueDate: dueDate,
          completed: Boolean(task.completed),
          createdAt: task.created_at || task.createdAt || "",
          updatedAt: task.updated_at || task.updatedAt || ""
        };
      });
    } else {
      // If neither format matches, throw an error
      console.error("Unexpected API response format:", response.data);
      throw new Error("Unexpected API response format");
    }
  } catch (error) {
    return handleApiError(error, "Failed to fetch tasks");
  }
};

export const createTask = async (task: {
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
}): Promise<Task> => {
  try {
    const formattedTask = {
      title: task.title,
      description: task.description,
      due_date: formatDateForAPI(task.dueDate),
      completed: task.completed,
    };
    const response = await axios.post(API_URL, formattedTask);
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to create task");
  }
};

export const updateTask = async (
  id: string,
  task: {
    title: string;
    description: string;
    dueDate: string;
    completed: boolean;
  }
): Promise<Task> => {
  try {
    const formattedTask = {
      title: task.title ?? "",
      description: task.description ?? "",
      due_date: formatDateForAPI(task.dueDate),
      completed: Boolean(task.completed),
    };
    const response = await axios.put(`${API_URL}/${id}`, formattedTask, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to update task");
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    handleApiError(error, "Failed to delete task");
  }
};



