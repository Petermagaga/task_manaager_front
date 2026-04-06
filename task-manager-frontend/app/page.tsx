"use client";

import { useEffect, useState } from "react";
import { getTasks, createTask, updateTaskStatus,deleteTask } from "@/services/taskService";
import { Task } from "@/types/task";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("low");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createTask({
        title,
        due_date: dueDate,
        priority,
      });

      // Reset form
      setTitle("");
      setDueDate("");
      setPriority("low");

      // Refresh list
      fetchTasks();
    } catch (err) {
      alert("Failed to create task");
    }
  };

  const handleStart = async (id: number) => {
    try {
      await updateTaskStatus(id, "in_progress");
      fetchTasks();
    } catch {
      alert("Failed to update status");
    }
  };

  const handleComplete = async (id: number) => {
    try {
      await updateTaskStatus(id, "done");
      fetchTasks();
    } catch {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await deleteTask(id);
      fetchTasks();
    } catch {
      alert("Only completed tasks can be deleted");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Task Manager</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Task
        </button>
      </form>

      {/* TASK LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 border rounded-xl shadow"
            >
              <h2 className="font-bold">{task.title}</h2>
              <p>📅 {task.due_date}</p>
              <p>Priority: {task.priority}</p>
              <p>Status: {task.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}