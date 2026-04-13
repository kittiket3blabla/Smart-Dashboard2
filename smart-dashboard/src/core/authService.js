export const authService = {
  // Проверяем, залогинен ли юзер (есть ли токен в памяти)
  isLoggedIn() {
    return !!localStorage.getItem("sb-access-token");
  },

  async register(email, password) {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  async login(email, password) {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    if (data.session) {
      // Сохраняем токен для сессии
      localStorage.setItem("sb-access-token", data.session.access_token);
    }
    return data;
  },

  logout() {
    localStorage.removeItem("sb-access-token");
    window.location.hash = "#/login";
    window.location.reload(); // Полный сброс состояния
  }
};