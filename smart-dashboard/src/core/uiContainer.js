import { navigate } from "./router.js";
import { authService } from "./authService.js";

let isLoginMode = true;

export function initUI() {
  const app = document.getElementById("app");
  if (!authService.isLoggedIn()) { renderAuthUI(app); } 
  else { renderAppUI(app); }
}

function renderAuthUI(container) {
  container.innerHTML = `
    <div class="auth-card">
      <h2 style="color:#2d3748; font-weight:800; margin-bottom:5px;">Smart Dashboard</h2>
      <p style="color:#718096; margin-bottom:20px;">${isLoginMode ? 'Вход в систему' : 'Регистрация аккаунта'}</p>
      <input type="email" id="auth-email" placeholder="Email">
      <input type="password" id="auth-pass" placeholder="Пароль">
      <button id="auth-main-btn" class="btn-primary">${isLoginMode ? 'Войти' : 'Создать аккаунт'}</button>
      <p><a href="#" id="auth-toggle-link">${isLoginMode ? 'Нет аккаунта? Регистрация' : 'Есть аккаунт? Вход'}</a></p>
    </div>
  `;
  
  document.getElementById("auth-toggle-link").onclick = (e) => { 
    e.preventDefault(); 
    isLoginMode = !isLoginMode; 
    renderAuthUI(container); 
  };
  
  document.getElementById("auth-main-btn").onclick = async () => {
    const email = document.getElementById("auth-email").value;
    const pass = document.getElementById("auth-pass").value;
    
    const res = isLoginMode ? await authService.login(email, pass) : await authService.register(email, pass);
    
    if (res.error) {
      alert(res.error); 
    } else {
      // Сохраняем почту, чтобы профиль брал ее отсюда!
      localStorage.setItem("userEmail", email); 
      window.location.reload();
    }
  };
}

function renderAppUI(container) {
  container.innerHTML = `
    <main id="main-content"></main>
    <nav class="bottom-nav">
      <button class="nav-item active" data-path="/tasks">
        <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        ЗАДАЧИ
      </button>
      <button class="nav-item" data-path="/notes">
        <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
        ЗАМЕТКИ
      </button>
      <button class="nav-item" data-path="/tracker">
        <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
        ПРОГРЕСС
      </button>
      <button class="nav-item" data-path="/profile">
        <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        ПРОФИЛЬ
      </button>
    </nav>
  `;
  
  const navItems = container.querySelectorAll(".nav-item");
  
  // Устанавливаем активную кнопку на основе текущего URL
  const currentPath = window.location.hash.replace("#", "") || "/tasks";
  navItems.forEach(btn => {
    if (btn.getAttribute("data-path") === currentPath) {
      navItems.forEach(i => i.classList.remove("active"));
      btn.classList.add("active");
    }
  });

  navItems.forEach(btn => {
    btn.onclick = () => {
      navItems.forEach(i => i.classList.remove("active"));
      btn.classList.add("active");
      navigate(btn.getAttribute("data-path"));
    };
  });
}

export function getMainContainer() { return document.getElementById("main-content"); }