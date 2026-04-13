import { dataService } from "../../core/dataService.js";
import { getMainContainer } from "../../core/uiContainer.js";

let editNoteId = null; 
let noteIdToDelete = null; // Для кастомного удаления

export async function renderNotesUI() {
  const container = getMainContainer();
  container.innerHTML = `<h2 style="text-align:center; color:#a0aec0;">Загрузка...</h2>`;

  try {
    const res = await dataService.getNotes();
    const notes = Array.isArray(res) ? res : []; 
    
    container.innerHTML = `
      <div class="notes-container">
        <h2 class="notes-header">Заметки</h2>
        
        <div class="notes-form">
          <input type="text" id="note-title" placeholder="Название заметки..." class="notes-input">
          <textarea id="note-content" placeholder="Важный текст..." class="notes-input" style="height: 80px; resize:none;"></textarea>
          <button id="add-note-btn" class="notes-add-btn">${editNoteId ? 'Обновить' : 'Сохранить'}</button>
          ${editNoteId ? '<button id="cancel-note-edit" class="notes-add-btn" style="background:#718096; margin-top:5px;">Отмена</button>' : ''}
        </div>

        <div class="notes-grid">
          ${notes.map(note => `
            <div class="note-card">
              <h3 class="note-title">${note.title}</h3>
              <p class="note-content">${note.content}</p>
              <div style="display:flex; gap:10px; margin-top:10px;">
                <button class="edit-note-btn" data-id="${note.id}" style="background:var(--input-bg); border:none; padding:6px 12px; border-radius:8px; cursor:pointer; color:var(--text-main); font-size:12px; font-weight:bold;">Редактировать</button>
                <button class="note-del-btn" data-id="${note.id}">Удалить</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- КАСТОМНОЕ ОКНО УДАЛЕНИЯ -->
      <div id="delete-note-modal" class="add-task-overlay" style="display:none; align-items:center; justify-content:center; background: rgba(0,0,0,0.7);">
        <div class="task-input-card" style="text-align:center; max-width:300px; margin: auto; position:relative; top:30%;">
          <h3 style="color:var(--text-main); margin-bottom:20px;">Удалить заметку?</h3>
          <div style="display:flex; gap:10px;">
            <button id="confirm-note-del" class="btn-save" style="position:static; background:#f56565; flex:1;">Да</button>
            <button id="cancel-note-del" class="btn-save" style="position:static; background:#a0aec0; flex:1;">Нет</button>
          </div>
        </div>
      </div>
    `;

    const titleInp = document.getElementById("note-title");
    const contentInp = document.getElementById("note-content");

    if (editNoteId) {
      const note = notes.find(n => n.id == editNoteId);
      if (note) {
        titleInp.value = note.title;
        contentInp.value = note.content;
      }
    }

    document.getElementById("add-note-btn").onclick = async () => {
      if (!titleInp.value || !contentInp.value) return alert("Заполни поля!");
      if (editNoteId) {
        await dataService.updateNote(editNoteId, titleInp.value, contentInp.value);
        editNoteId = null;
      } else {
        await dataService.createNote(titleInp.value, contentInp.value);
      }
      renderNotesUI();
    };

    if (editNoteId) {
      document.getElementById("cancel-note-edit").onclick = () => {
        editNoteId = null;
        renderNotesUI();
      };
    }

    container.querySelectorAll(".edit-note-btn").forEach(btn => {
      btn.onclick = () => {
        editNoteId = btn.dataset.id;
        renderNotesUI();
        window.scrollTo(0,0);
      };
    });

    // ЛОГИКА КРАСИВОГО УДАЛЕНИЯ
    const delModal = document.getElementById("delete-note-modal");
    container.querySelectorAll(".note-del-btn").forEach(btn => {
      btn.onclick = () => {
        noteIdToDelete = btn.dataset.id;
        delModal.style.display = "block";
      };
    });

    document.getElementById("confirm-note-del").onclick = async () => {
      if (noteIdToDelete) {
        await dataService.deleteNote(noteIdToDelete);
        noteIdToDelete = null;
        renderNotesUI();
      }
    };

    document.getElementById("cancel-note-del").onclick = () => {
      delModal.style.display = "none";
      noteIdToDelete = null;
    };

  } catch (err) {
    container.innerHTML = `<p style="color:red; text-align:center;">Ошибка: ${err.message}</p>`;
  }
}