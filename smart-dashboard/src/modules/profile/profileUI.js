import { dataService } from "../../core/dataService.js";
import { authService } from "../../core/authService.js";
import { getMainContainer } from "../../core/uiContainer.js";

// Переменная для отслеживания режима редактирования
let isEditingProfile = false;

export async function renderProfileUI() {
  const container = getMainContainer();
  container.innerHTML = `<h2 style="text-align:center; color:#a0aec0; margin-top:20px;">Загрузка профиля...</h2>`;

  try {
    // 1. Получаем данные
    const tasks = (await dataService.getTasks()) || [];
    const notes = (await dataService.getNotes()) || [];
    
    const completedTasksCount = tasks.filter(t => t.is_completed).length;
    const notesCount = notes.length;

    const userName = localStorage.getItem("userName") || "Пользователь";
    const userEmail = localStorage.getItem("userEmail") || "huesos@gmail.com"; 
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";

    // 2. Рендерим HTML
    container.innerHTML = `
      <div class="profile-page">
        <div class="profile-header">
          <h1>Профиль</h1>
          <div class="profile-actions">
            <button id="theme-btn" class="theme-toggle-btn">
              ${currentTheme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button id="edit-profile-btn" class="btn-edit">
              ${isEditingProfile ? 'Готово' : 'Редактировать'}
            </button>
          </div>
        </div>

        <div class="avatar-container">
          <div class="avatar-circle">
            <svg viewBox="0 0 24 24" width="60" height="60" fill="white">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        </div>

        <div class="info-card">
          <span class="info-label">Имя</span>
          ${isEditingProfile 
            ? `<input type="text" id="edit-name-input" class="notes-input" style="margin:0; width:60%; padding:5px 10px;" value="${userName}">` 
            : `<span class="info-value">${userName}</span>`
          }
        </div>
        
        <div class="info-card">
          <span class="info-label">Почта</span>
          ${isEditingProfile 
            ? `<input type="text" id="edit-email-input" class="notes-input" style="margin:0; width:60%; padding:5px 10px;" value="${userEmail}">` 
            : `<span class="info-value">${userEmail}</span>`
          }
        </div>

        <h2 class="section-title" style="margin-top: 30px;">Достижения</h2>
        
        <div class="info-card">
          <span class="info-label" style="font-weight: 700;">Всего задач выполнено:</span>
          <span class="info-value" style="color: #4299e1; font-weight: 800;">${completedTasksCount}</span>
        </div>

        <div class="info-card">
          <span class="info-label" style="font-weight: 700;">Заметок создано:</span>
          <span class="info-value" style="color: #4299e1; font-weight: 800;">${notesCount}</span>
        </div>

        <button id="profile-logout-btn" class="btn-logout">
          Выйти из профиля
        </button>
      </div>
    `;

    // 3. Навешиваем события
    
    // Смена темы
    document.getElementById("theme-btn").onclick = () => {
      const html = document.documentElement;
      const isDark = html.getAttribute("data-theme") === "dark";
      const newTheme = isDark ? "light" : "dark";
      
      html.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      renderProfileUI(); // Перерисовываем для обновления иконки
    };

    // Выход
    document.getElementById("profile-logout-btn").onclick = () => {
      authService.logout();
    };

    // Логика редактирования
    document.getElementById("edit-profile-btn").onclick = () => {
      if (isEditingProfile) {
        // Сохраняем данные
        const newName = document.getElementById("edit-name-input").value;
        const newEmail = document.getElementById("edit-email-input").value;
        
        if (newName.trim() && newEmail.trim()) {
          localStorage.setItem("userName", newName.trim());
          localStorage.setItem("userEmail", newEmail.trim());
          isEditingProfile = false;
          renderProfileUI(); 
        } else {
          alert("Поля не могут быть пустыми!");
        }
      } else {
        // Включаем режим редактирования
        isEditingProfile = true;
        renderProfileUI();
      }
    };

  } catch (err) {
    console.error("Ошибка в ProfileUI:", err);
    container.innerHTML = `<p style="color:red; text-align:center;">Ошибка загрузки профиля.</p>`;
  }
}