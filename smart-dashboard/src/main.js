import { initRouter } from "./core/router.js";
import { initUI } from "./core/uiContainer.js";
import { authService } from "./core/authService.js";

// Выставляем функции в глобальную область (для консоли)
window.registerUser = async (email, password) => {
  const res = await authService.register(email, password);
  console.log("Ответ сервера (регистрация):", res);
};

window.loginUser = async (email, password) => {
  const res = await authService.login(email, password);
  console.log("Ответ сервера (вход):", res);
};

// Запуск приложения
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 App started");
  initUI();
  initRouter();
});