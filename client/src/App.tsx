import React, { useState } from "react";
import TaskList from "@/components/TaskList";
import type { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import TaskForm from "@/components/TaskForm";
import { DialogTrigger } from "@/components/ui/dialog";

const App: React.FC = () => {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleTaskSaved = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-6">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Task Manager</h1>
          <p className="text-gray-600">
            Keep track of your tasks and boost your productivity
          </p>
        </div>
        <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingTask ? "Edit Task" : "Add Task"}
              </DialogTitle>
              <DialogDescription>
                {editingTask
                  ? "Edit your task details below."
                  : "Add a new task to your list."}
              </DialogDescription>
            </DialogHeader>
            <TaskForm
              editingTask={editingTask}
              onTaskSaved={handleTaskSaved}
              onCancelEdit={() => setIsTaskFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </header>
      <TaskList onEdit={handleEditTask} refreshTrigger={refreshTrigger} />
    </div>
  );
};

export default App;
