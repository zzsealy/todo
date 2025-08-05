import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRequestConfig() {
  const token = localStorage.getItem('todo_token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
}

export function clearToken() {
  localStorage.removeItem('todo_token');
  document.cookie = 'todo_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
}
