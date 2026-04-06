export interface Task {
  id: number;
  title: string;
  due_date: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "done";
}