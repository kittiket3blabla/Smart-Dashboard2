import { dataService } from "../../core/dataService.js";
import { getMainContainer } from "../../core/uiContainer.js";
import { notify } from "../../core/notificationService.js";

export async function renderTasksUI() {
  const container = getMainContainer();
  container.innerHTML = `<h2 class="loading">Загрузка...</h2>`;

  try {
    const tasks = await dataService.getTasks();
    container.innerHTML = `
      <div class="task-page">
        <h2>✅ Мои задачи</h2>
        <div class="input-row">
          <input type="text" id="new-task" placeholder="Добавить новую задачу...">
          <button id="add-btn">Добавить</button>
        </div>
        <ul class="task-list">
          ${tasks.map(t => `
            <li class="task-item ${t.is_completed ? 'done' : ''}">
              <input type="checkbox" class="complete-btn" data-id="${t.id}" ${t.is_completed ? 'checked disabled' : ''}>
              <span class="text">${t.title}</span>
              <div class="actions">
                <button class="edit-btn" data-id="${t.id}" data-title="${t.title}">✏️</button>
                <button class="del-btn" data-id="${t.id}">✕</button>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>
    `;

    document.getElementById("add-btn").onclick = async () => {
      const val = document.getElementById("new-task").value;
      if (val) { await dataService.createTask(val); notify("Задача создана!"); renderTasksUI(); }
    };

    container.querySelectorAll(".complete-btn").forEach(btn => {
      btn.onchange = async () => {
        await dataService.completeTask(btn.dataset.id, true);
        notify("+10 очков!");
        renderTasksUI();
      };
    });

    container.querySelectorAll(".edit-btn").forEach(btn => {
      btn.onclick = async () => {
        const newTitle = prompt("Редактировать задачу:", btn.dataset.title);
        if (newTitle && newTitle !== btn.dataset.title) {
          await dataService.updateTask(btn.dataset.id, newTitle);
          notify("Обновлено");
          renderTasksUI();
        }
      };
    });

    container.querySelectorAll(".del-btn").forEach(btn => {
      btn.onclick = async () => {
        await dataService.deleteTask(btn.dataset.id);
        notify("Удалено", "error");
        renderTasksUI();
      };
    });
  } catch (err) { container.innerHTML = "Ошибка связи с сервером"; }
}