
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  updateTask
} from "@/services/taskService";
import { Task } from "@/types/task";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("low");

  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch {
      console.error("Error fetching tasks");
    } finally {
      setLoading(false);
    }
  };


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    if (editingTask) {
      await updateTask(editingTask.id,{
        title,
        due_date: dueDate,
        priority,
      });

      alert("Update function not connected yet");
    } else {
      await createTask({
        title,
        due_date: dueDate,
        priority,
      });
    }

    resetForm();
    fetchTasks();
  } catch {
    alert("Failed to save task");
  }
};


  const resetForm = () => {
    setTitle("");
    setDueDate("");
    setPriority("low");
    setEditingTask(null);
  };

  const handleStart = async (id: number) => {
    await updateTaskStatus(id, "in_progress");
    fetchTasks();
  };

  const handleComplete = async (id: number) => {
    await updateTaskStatus(id, "done");
    fetchTasks();
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    fetchTasks();
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDueDate(task.due_date);
    setPriority(task.priority);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesPriority =
        filterPriority === "all" || task.priority === filterPriority;

      return matchesSearch && matchesPriority;
    });
  }, [tasks, search, filterPriority]);

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    progress: tasks.filter((t) => t.status === "in_progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Task Manager</h1>

      {/* DASHBOARD */}
      <div className="grid grid-cols-4 gap-4 mb-8">
     
<div className="p-4 rounded-xl shadow bg-blue-500 text-white">Total: {stats.total}</div>
<div className="p-4 rounded-xl shadow bg-yellow-500 text-white">Pending: {stats.pending}</div>
<div className="p-4 rounded-xl shadow bg-purple-500 text-white">Progress: {stats.progress}</div>
<div className="p-4 rounded-xl shadow bg-green-500 text-white">Done: {stats.done}</div>     
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search task..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 border rounded"
        />

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="p-3 border rounded"
        >
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}

className="space-y-4 bg-white text-black p-6 rounded-xl shadow mb-8"


>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          
          className="w-full p-3 border rounded text-black"

          required
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
         
          className="w-full p-3 border rounded text-black"


          required
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-3 border rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button 
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded hover:scale-105 transition" >
          {editingTask ? "Update Task" : "Create Task"}
        </button>
      </form>

      {/* TASK LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center p-10 text-gray-500">
  <p className="text-lg">No tasks yet 😴</p>
  <p>Create your first task above</p>
</div>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
             
              className="p-4 border rounded-xl shadow bg-white text-black hover:scale-[1.02] transition duration-300"


            >
              <h2 className="text-xl font-semibold mb-2">{task.title}</h2>

              <p>
  📅 {new Date(task.due_date).toLocaleDateString()}
</p>

<p>
  Priority:
  <span
    className={`ml-2 px-2 py-1 rounded text-white ${
      task.priority === "high"
        ? "bg-red-500"
        : task.priority === "medium"
        ? "bg-yellow-500"
        : "bg-green-500"
    }`}
  >
    {task.priority}
  </span>
</p>



              <p>Status: {task.status}</p>

              <div className="flex gap-2 mt-3">
                {task.status === "pending" && (
                  <button
                  type="button"
                    onClick={() => handleStart(task.id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Start
                  </button>
                )}

                {task.status === "in_progress" && (
                  <button
                  type="button"
                    onClick={() => handleComplete(task.id)}
                    className="bg-green-600 text-green px-3 py-1 rounded"
                  >
                    Complete
                  </button>
                )}

                <button
                type="button"
                  onClick={() => handleEdit(task)}
                  className="bg-blue-500 text-green px-3 py-1 rounded"
                >
                  Edit
                </button>

                {task.status === "done" && (
                  <button
                  type="button"
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-500 text-green px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
