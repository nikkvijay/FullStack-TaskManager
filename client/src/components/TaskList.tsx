import React, { useEffect, useState, useMemo } from "react";
import { fetchTasks } from "@/api/taskApi";
import { toast } from "sonner";
import type { Task } from "@/types/task";
import TaskCard from "@/components/TaskCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

interface TaskListProps {
  onEdit: (task: Task) => void;
  refreshTrigger: number;
}

export default function TaskList({ onEdit, refreshTrigger }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAllTasks = async () => {
    setLoading(true);
    try {
      const fetchedTasks = await fetchTasks();
      setTasks(fetchedTasks);
      setError(null);
    } catch (err) {
      console.error("Fetch error in TaskList:", err);
      setError("Failed to load tasks. Please try again.");
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, [refreshTrigger]);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    if (filter === "active") result = result.filter((task) => !task.completed);
    else if (filter === "completed") result = result.filter((task) => task.completed);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query))
      );
    }

    return result.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [tasks, filter, searchQuery]);

  const activeTasks = tasks.filter((t) => !t.completed).length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  if (loading && tasks.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />

      <Tabs defaultValue="all" value={filter} onValueChange={(v) => setFilter(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Tasks ({tasks.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeTasks})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTasks})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="pt-4">
          {renderTaskList(filteredTasks)}
        </TabsContent>
        <TabsContent value="active" className="pt-4">
          {renderTaskList(filteredTasks)}
        </TabsContent>
        <TabsContent value="completed" className="pt-4">
          {renderTaskList(filteredTasks)}
        </TabsContent>
      </Tabs>
    </div>
  );

  function renderTaskList(tasksToRender: Task[]) {
    if (error) {
      return <div className="text-red-600">{error}</div>;
    }

    if (tasksToRender.length === 0) {
      return (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-500">
            {searchQuery.trim() ? "No tasks match your search." : "No tasks available."}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4 animate-fade-in">
        {tasksToRender.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onTaskChanged={fetchAllTasks}
          />
        ))}
      </div>
    );
  }
}
