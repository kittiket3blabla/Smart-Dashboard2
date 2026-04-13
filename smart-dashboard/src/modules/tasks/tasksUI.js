import { dataService } from "../../core/dataService.js";
import { getMainContainer } from "../../core/uiContainer.js";
import { notify } from "../../core/notificationService.js";

let editTaskId = null;
let taskIdToDelete = null; // Переменная для кастомного удаления

export async function renderTasksUI() {
  const container = getMainContainer();
  container.innerHTML = `<h2 style="text-align:center; color:#a0aec0; margin-top:20px;">Загрузка...</h2>`;

  try {
    const res = await dataService.getTasks();
    const tasks = Array.isArray(res) ? res : [];
    const userName = localStorage.getItem("userName") || "Пользователь";

    container.innerHTML = `
      <div class="task-page">
        <h1 class="greeting">Привет, ${userName}!</h1>
        <h2 class="section-title">Задачи на сегодня</h2>
        <button id="open-add-screen" class="btn-new-task">Новая задача</button>

        <ul class="task-list">
          ${tasks.map(t => `
            <li class="task-item ${t.is_completed ? 'done' : ''}">
              <input type="checkbox" class="complete-btn" data-id="${t.id}" ${t.is_completed ? 'checked disabled' : ''}>
              <span class="text">${t.title}</span>
              <div class="actions">
                <button class="edit-task-btn" data-id="${t.id}" style="background:none; border:none; color:var(--text-secondary); cursor:pointer;">✎</button>
                <!-- Оставляем твой класс del-btn -->
                <button class="del-btn" data-id="${t.id}">✕</button>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- ЭКРАН ДОБАВЛЕНИЯ -->
      <div id="add-task-screen" class="add-task-overlay">
        <div class="add-task-header">
          <button id="close-add-screen" class="back-btn">❮</button>
          <h2 id="overlay-title">Новая задача</h2>
        </div>
        <div class="task-input-card">
          <input type="text" id="new-task-input" class="task-input-field" placeholder="Название задачи">
        </div>
        <button id="save-task-btn" class="btn-save">Сохранить</button>
      </div>

      <!-- КАСТОМНОЕ ОКНО УДАЛЕНИЯ -->
      <div id="delete-task-modal" class="add-task-overlay" style="display:none; align-items:center; justify-content:center; background: rgba(0,0,0,0.8); z-index:3000;">
        <div class="task-input-card" style="text-align:center; max-width:280px; margin: auto; position:relative; top:35%;">
          <h3 style="color:var(--text-main); margin-bottom:20px; font-size:18px;">Удалить задачу?</h3>
          <div style="display:flex; gap:10px;">
            <button id="confirm-task-del" class="btn-save" style="position:static; background:#f56565; flex:1; padding:12px;">Да</button>
            <button id="cancel-task-del" class="btn-save" style="position:static; background:#a0aec0; flex:1; padding:12px;">Нет</button>
          </div>
        </div>
      </div>
    `;

    // --- ЛОГИКА ОВЕРЛЕЯ ДОБАВЛЕНИЯ ---
    const addScreen = document.getElementById("add-task-screen");
    const taskInput = document.getElementById("new-task-input");
    const overlayTitle = document.getElementById("overlay-title");

    document.getElementById("open-add-screen").onclick = () => {
      editTaskId = null;
      overlayTitle.innerText = "Новая задача";
      taskInput.value = "";
      addScreen.style.display = "block";
    };

    document.getElementById("close-add-screen").onclick = () => { addScreen.style.display = "none"; };

    document.getElementById("save-task-btn").onclick = async () => {
      if (!taskInput.value.trim()) return;
      if (editTaskId) {
        await dataService.updateTask(editTaskId, taskInput.value.trim());
        notify("Обновлено");
      } else {
        await dataService.createTask(taskInput.value.trim());
        notify("Создано");
      }
      renderTasksUI();
    };

    // --- КНОПКА РЕДАКТИРОВАТЬ ---
    container.querySelectorAll(".edit-task-btn").forEach(btn => {
      btn.onclick = () => {
        const task = tasks.find(t => t.id == btn.dataset.id);
        editTaskId = btn.dataset.id;
        overlayTitle.innerText = "Редактировать";
        taskInput.value = task.title;
        addScreen.style.display = "block";
      };
    });

    // --- ЛОГИКА КАСТОМНОГО УДАЛЕНИЯ ---
    const delModal = document.getElementById("delete-task-modal");
    
    container.querySelectorAll(".del-btn").forEach(btn => {
      btn.onclick = () => {
        taskIdToDelete = btn.dataset.id;
        delModal.style.display = "block";
      };
    });

    document.getElementById("confirm-task-del").onclick = async () => {
      if (taskIdToDelete) {
        await dataService.deleteTask(taskIdToDelete);
        taskIdToDelete = null;
        notify("Удалено", "error");
        renderTasksUI();
      }
    };

    document.getElementById("cancel-task-del").onclick = () => {
      delModal.style.display = "none";
      taskIdToDelete = null;
    };

    // --- ЧЕКБОКСЫ ---
    container.querySelectorAll(".complete-btn").forEach(btn => {
      btn.onchange = async () => {
        await dataService.completeTask(btn.dataset.id, true);
        notify("+10 очков!");
        renderTasksUI();
      };
    });
    
  } catch (err) { 
    console.error(err);
    container.innerHTML = `<p style="text-align:center; color:red; margin-top:20px;">Ошибка загрузки</p>`; 
  }
}