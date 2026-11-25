// Interface: menentukan bentuk data sebuah tugas.
export interface Task {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  completed: boolean;
}

// Type alias dan union type.
export type TaskStatus = "all" | "pending" | "completed";

// Primitive types, array, dan generic sederhana.
export const appName: string = import.meta.env.VITE_APP_NAME || "Taskly";
export const appVersion: string = import.meta.env.VITE_APP_VERSION || "1.0.0";
export const startingCount: number = 0;
export const isAppReady: boolean = true;

export function getFromStorage<T>(key: string, fallback: T): T {
  const saved: string | null = localStorage.getItem(key);
  if (!saved) return fallback;
  try {
    return JSON.parse(saved) as T;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export const initialTasks: Task[] = [
  {
    id: 1,
    title: "Membuat rangkuman materi pertemuan 5",
    course: "Interaksi Manusia dan Komputer",
    dueDate: "2026-11-28",
    completed: false
  },
  {
    id: 2,
    title: "Mengerjakan latihan TypeScript",
    course: "Pengembangan Aplikasi Web",
    dueDate: "2026-11-30",
    completed: true
  },
  {
    id: 3,
    title: "Menyiapkan bahan presentasi kelompok",
    course: "Sistem Informasi",
    dueDate: "2026-12-02",
    completed: false
  }
];