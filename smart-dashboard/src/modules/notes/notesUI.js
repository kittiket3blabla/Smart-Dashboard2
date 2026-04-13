import { dataService } from "../../core/dataService.js";
import { getMainContainer } from "../../core/uiContainer.js";

export async function renderNotesUI() {
  const container = getMainContainer();
  container.innerHTML = `<h2 style="color: white;">Загрузка заметок...</h2>`;

  try {
    const notes = await dataService.getNotes();
    
    container.innerHTML = `
      <div style="max-width: 800px; margin: 0 auto; color: white;">
        <h2 style="margin-bottom: 20px;">📝 Мои Заметки</h2>
        
        <!-- Форма -->
        <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <input type="text" id="note-title" placeholder="Заголовок заметки" style="width: 100%; padding: 10px; margin-bottom: 10px; background: #1e1e1e; border: 1px solid #444; color: white; border-radius: 4px;">
          <textarea id="note-content" placeholder="Текст заметки..." style="width: 100%; padding: 10px; height: 100px; background: #1e1e1e; border: 1px solid #444; color: white; border-radius: 4px; margin-bottom: 10px;"></textarea>
          <button id="add-note-btn" style="width: 100%; padding: 10px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Сохранить заметку</button>
        </div>

        <!-- Список заметок (сетка) -->
        <div id="notes-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;">
          ${notes.map(note => `
            <div style="background: #333; padding: 15px; border-radius: 8px; position: relative;">
              <h3 style="margin-top: 0; color: #4caf50;">${note.title}</h3>
              <p style="font-size: 14px; line-height: 1.5; color: #ccc;">${note.content}</p>
              <button class="del-note-btn" data-id="${note.id}" style="margin-top: 10px; background: #f44336; border: none; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">Удалить</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Логика добавления
    document.getElementById("add-note-btn").onclick = async () => {
      const title = document.getElementById("note-title").value;
      const content = document.getElementById("note-content").value;
      if (!title || !content) return alert("Заполни заголовок и текст!");
      
      await dataService.createNote(title, content);
      renderNotesUI();
    };

    // Логика удаления
    container.querySelectorAll(".del-note-btn").forEach(btn => {
      btn.onclick = async () => {
        if (confirm("Удалить заметку?")) {
          await dataService.deleteNote(btn.dataset.id);
          renderNotesUI();
        }
      };
    });

  } catch (err) {
    container.innerHTML = `<p style="color: red;">Ошибка: ${err.message}</p>`;
  }
}