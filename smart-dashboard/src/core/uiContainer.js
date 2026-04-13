import { navigate } from "./router.js";
import { authService } from "./authService.js";

let isLoginMode = true;

export function initUI() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  
  const app = document.getElementById("app");
  if (!authService.isLoggedIn()) { renderAuthUI(app); } 
  else { renderAppUI(app); }
}

function renderAuthUI(container) {
  container.innerHTML = `
    <div class="auth-card">
      <h2>Smart Dashboard</h2>
      <p>${isLoginMode ? 'Вход в систему' : 'Регистрация аккаунта'}</p>
      <input type="email" id="auth-email" placeholder="Email">
      <input type="password" id="auth-pass" placeholder="Пароль">
      <button id="auth-main-btn">${isLoginMode ? 'Войти' : 'Создать аккаунт'}</button>
      <p><a href="#" id="auth-toggle-link">${isLoginMode ? 'Нет аккаунта? Регистрация' : 'Есть аккаунт? Вход'}</a></p>
    </div>
  `;
  document.getElementById("auth-toggle-link").onclick = (e) => { e.preventDefault(); isLoginMode = !isLoginMode; renderAuthUI(container); };
  document.getElementById("auth-main-btn").onclick = async () => {
    const email = document.getElementById("auth-email").value;
    const pass = document.getElementById("auth-pass").value;
    const res = isLoginMode ? await authService.login(email, pass) : await authService.register(email, pass);
    if (res.error) alert(res.error); else window.location.reload();
  };
}

function renderAppUI(container) {
  container.innerHTML = `
    <header>
      <h1>SMART DASHBOARD</h1>
      <nav>
        <button data-path="/tasks">Tasks</button>
        <button data-path="/notes">Notes</button>
        <button data-path="/tracker">Tracker</button>
        <button id="theme-toggle">🌓</button>
        <button id="logout-btn" class="btn-danger">Выйти</button>
      </nav>
    </header>
    <main id="main-content"></main>
  `;
  document.getElementById("theme-toggle").onclick = () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };
  document.getElementById("logout-btn").onclick = () => authService.logout();
  container.querySelectorAll("button[data-path]").forEach(btn => {
    btn.onclick = () => navigate(btn.getAttribute("data-path"));
  });
}

export function getMainContainer() { return document.getElementById("main-content"); }