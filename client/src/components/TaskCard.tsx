import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { updateTask, deleteTask } from "@/api/taskApi";
import { toast } from "sonner";
import { Check, Pencil, Trash2 } from "lucide-react";
import type { Task } from "@/types/task";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getStatusDetails } from "@/lib/taskUtils";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onTaskChanged: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onTaskChanged }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const statusDetails = getStatusDetails(task);

  const formattedDate = new Date(task.dueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleToggleComplete = async () => {
    setIsUpdating(true);
    try {
      await updateTask(task.id, {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        completed: !task.completed,
      });
      toast.success(
        task.completed ? "Task marked as incomplete" : "Task marked as complete"
      );
      onTaskChanged();
    } catch (err) {
      toast.error("Failed to update task status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsUpdating(true);
    try {
      await deleteTask(task.id);
      toast.success("Task deleted successfully");
      onTaskChanged();
    } catch (err) {
      toast.error("Failed to delete task");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="group mb-4 overflow-hidden border shadow-sm transition-all duration-200 hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="pt-1">
            <Checkbox
              checked={task.completed}
              disabled={isUpdating}
              onCheckedChange={handleToggleComplete}
              className="h-5 w-5 rounded-full data-[state=checked]:bg-green-600"
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3
                className={`text-lg font-semibold ${
                  task.completed ? "line-through text-gray-500" : ""
                }`}
              >
                {task.title}
              </h3>
              <Badge className={`${statusDetails.color}`}>
                {statusDetails.label}
              </Badge>
            </div>

            {task.description && (
              <p
                className={`mt-1 text-sm text-gray-600 ${
                  task.completed ? "text-gray-400" : ""
                }`}
              >
                {task.description}
              </p>
            )}

            <div className="mt-3 flex items-center text-xs text-gray-500">
              <span>Due: {formattedDate}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2 border-t bg-gray-50/80 p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(task)}
          disabled={isUpdating}
          className="h-8 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
        >
          <Pencil className="mr-1 h-3.5 w-3.5" />
          Edit
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              disabled={isUpdating}
              className="h-8 text-red-600 hover:bg-red-100 hover:text-red-700"
            >
              <Trash2 className="mr-1 h-3.5 w-3.5" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Task</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this task? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isUpdating}
                className="bg-red-600 hover:bg-red-700"
              >
                {isUpdating ? <LoadingSpinner size="sm" /> : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
