import API from "./api";
import { Task } from "@/types/task";

export const getTasks = async (): Promise<Task[]> => {
  const response = await API.get("/tasks");
  return response.data.data || [];
};

export const createTask = async (task: {
  title: string;
  due_date: string;
  priority: string;
}) => {
  const response = await API.post("/tasks", task);
  return response.data;
};
export const updateTaskStatus = async (id: number, status: string) => {
  const response = await API.patch(`/tasks/${id}/status`, { status });
  return response.data;
};

export const deleteTask = async (id: number) => {
  const response = await API.delete(`/tasks/${id}`);
  return response.data;
};

export const updateTask = async (
  id: number,
  updatedTask: {
    title: string;
    due_date: string;
    priority: string;
  }
) => {
  const response = await fetch(`http://127.0.0.1:5000/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTask),
  });

  return response.json();
};

