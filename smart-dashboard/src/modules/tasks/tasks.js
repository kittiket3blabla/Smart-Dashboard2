import { getMainContainer } from "../../core/uiContainer.js";
import { tasksDummy } from "./tasksDummyData.js";

// Логика CRUD и начисления баллов
let tasks = [...tasksDummy]; // копируем заглушку

// Получить все задачи
export function getTasks() {
  return tasks;
}

// Добавить задачу
export function addTask(task) {
  const newTask = {
    id: Date.now(),
    title: task.title,
    completed: false,
    points: task.points || 1
  };
  tasks.push(newTask);
  return newTask;
}

// Отметить задачу как выполненную
export function completeTask(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.completed = true;
  }
  return task;
}

// Удалить задачу
export function deleteTask(taskId) {
  tasks = tasks.filter(t => t.id !== taskId);
}

// Получить суммарные баллы
export function getTotalPoints() {
  return tasks.filter(t => t.completed).reduce((sum, t) => sum + t.points, 0);
}
