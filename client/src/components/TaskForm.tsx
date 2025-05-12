import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createTask, updateTask } from "@/api/taskApi";
import { Check, Save } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { Task } from "@/types/task";

interface TaskFormProps {
  editingTask?: Task | null;
  onTaskSaved?: () => void;
  onCancelEdit?: () => void;
}

export default function TaskForm({
  editingTask,
  onTaskSaved,
  onCancelEdit,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill fields if editing
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || "");

      // Fix date handling for editing
      if (editingTask.dueDate) {
        try {
          // Handle different possible date formats
          let formattedDate;
          if (editingTask.dueDate.includes("T")) {
            // ISO format: "2023-07-15T00:00:00Z"
            formattedDate = editingTask.dueDate.split("T")[0];
          } else if (editingTask.dueDate.includes("-")) {
            // Already in YYYY-MM-DD format
            formattedDate = editingTask.dueDate;
          } else {
            // Try to parse as date object
            formattedDate = new Date(editingTask.dueDate)
              .toISOString()
              .split("T")[0];
          }

          setDueDate(formattedDate);
        } catch (error) {
          console.error("Error formatting date:", error);
          // Fallback to empty string if date parsing fails
          setDueDate("");
        }
      } else {
        setDueDate("");
      }
    } else {
      setTitle("");
      setDescription("");
      setDueDate(new Date().toISOString().split("T")[0]);
    }
  }, [editingTask]);

  const validateForm = () => {
    if (!title || title.trim().length < 3) {
      setError("Title must be at least 3 characters");
      return false;
    }

    if (!dueDate) {
      setError("Due date is required");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (editingTask) {
        const payload = {
          title,
          description,
          dueDate,
          completed: editingTask.completed,
        };
        await updateTask(editingTask.id, payload);
        toast.success("Task updated successfully");
      } else {
        const payload = {
          title,
          description,
          dueDate,
          completed: false,
        };
        await createTask(payload);
        toast.success("Task created successfully");
      }

      onTaskSaved?.();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      toast.error(message);
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6 border shadow-md">
      <CardHeader className="bg-primary/5 pb-4">
        <CardTitle>{editingTask ? "Edit Task" : "Create New Task"}</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mb-4 grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                className="focus-visible:ring-primary"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description (optional)"
                className="min-h-24 focus-visible:ring-primary"
                disabled={isSubmitting}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dueDate">
                Due Date <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="focus-visible:ring-primary"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2 border-t bg-gray-50 p-4">
          {editingTask && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancelEdit}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}

          <Button type="submit" disabled={isSubmitting} className="gap-1">
            {isSubmitting ? (
              <LoadingSpinner size="sm" />
            ) : editingTask ? (
              <>
                <Save className="h-4 w-4" />
                Update Task
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Create Task
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
