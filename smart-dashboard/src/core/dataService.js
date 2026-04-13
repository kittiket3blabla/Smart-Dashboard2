export const dataService = {
  getToken() { return localStorage.getItem("sb-access-token"); },

  // ЗАДАЧИ
  async getTasks() {
    try {
      const res = await fetch("/api/tasks", { headers: { "Authorization": this.getToken() } });
      const data = await res.json();
      localStorage.setItem("cache_tasks", JSON.stringify(data));
      return data;
    } catch { return JSON.parse(localStorage.getItem("cache_tasks") || "[]"); }
  },
  async createTask(title) {
    return fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": this.getToken() },
      body: JSON.stringify({ title })
    }).then(r => r.json());
  },
  async updateTask(id, title) {
    return fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": this.getToken() },
      body: JSON.stringify({ title })
    }).then(r => r.json());
  },
  async deleteTask(id) {
    return fetch(`/api/tasks/${id}`, { method: "DELETE", headers: { "Authorization": this.getToken() } });
  },
  async completeTask(id, is_completed) {
    return fetch(`/api/tasks/${id}/complete`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "Authorization": this.getToken() },
      body: JSON.stringify({ is_completed })
    }).then(r => r.json());
  },

  // ЗАМЕТКИ
  async getNotes() {
    try {
      const res = await fetch("/api/notes", { headers: { "Authorization": this.getToken() } });
      const data = await res.json();
      localStorage.setItem("cache_notes", JSON.stringify(data));
      return data;
    } catch { return JSON.parse(localStorage.getItem("cache_notes") || "[]"); }
  },
  async createNote(title, content) {
    return fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": this.getToken() },
      body: JSON.stringify({ title, content })
    }).then(r => r.json());
  },
  async updateNote(id, title, content) {
    return fetch(`/api/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": this.getToken() },
      body: JSON.stringify({ title, content })
    }).then(r => r.json());
  },
  async deleteNote(id) {
    return fetch(`/api/notes/${id}`, { method: "DELETE", headers: { "Authorization": this.getToken() } });
  },

  async getLeaderboard() {
    return fetch("/api/leaderboard").then(r => r.json());
  }
};