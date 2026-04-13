import { authService } from "./authService.js";
import { getMainContainer, initUI } from "./uiContainer.js";

let routes = {};
let defaultRoute = "/tasks";

export function initRouter() {
  routes = {
    "/tasks": () => import("../modules/tasks/tasksUI.js").then(m => (m.renderTasksUI || m.default)()),
    "/notes": () => import("../modules/notes/notesUI.js").then(m => (m.renderNotesUI || m.default)()),
    "/tracker": () => import("../modules/tracker/trackerUI.js").then(m => (m.renderTrackerUI || m.default)()),
    // ДОБАВИЛИ ПРОФИЛЬ СЮДА:
    "/profile": () => import("../modules/profile/profileUI.js").then(m => (m.renderProfileUI || m.default)())
  };

  // Слушаем изменение хеша в URL
  window.addEventListener("hashchange", handleRoute);
  handleRoute();
}

export function navigate(path) {
  window.location.hash = `#${path}`;
}

async function handleRoute() {
  // Если не авторизован — принудительно показываем UI входа и не идем дальше
  if (!authService.isLoggedIn()) {
    initUI(); 
    return;
  }

  // Получаем путь из хеша (например из #/tasks получаем /tasks)
  const hashPath = window.location.hash.replace("#", "") || defaultRoute;
  const routeFunc = routes[hashPath];

  if (routeFunc) {
    const container = getMainContainer();
    if (container) container.innerHTML = "Загрузка модуля...";
    
    try {
      await routeFunc();
    } catch (err) {
      console.error("Ошибка загрузки модуля:", err);
      if (getMainContainer()) getMainContainer().innerHTML = "Ошибка загрузки модуля.";
    }
  } else {
    // Если путь не найден — на дефолт
    navigate(defaultRoute);
  }
}