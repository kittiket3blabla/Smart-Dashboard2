import { dataService } from "../../core/dataService.js";
import { getMainContainer } from "../../core/uiContainer.js";

export async function renderTrackerUI() {
  const container = getMainContainer();
  container.innerHTML = `<h2 style="text-align:center; color:#a0aec0; margin-top:20px;">Загрузка статистики...</h2>`;

  try {
    const tasks = await dataService.getTasks();
    const stats = calculateWeeklyStats(tasks);

    container.innerHTML = `
      <div class="tracker-page">
        <h2 class="section-title">Статистика</h2>
        
        <!-- Круг прогресса -->
        <div class="stats-card">
          <div class="circle-chart" style="background: conic-gradient(#48bb78 ${stats.totalPercent * 3.6}deg, #e2e8f0 0deg);">
            <div class="circle-inner">${stats.totalPercent}%</div>
          </div>
          <div class="legend">
            <span class="l-green">Выполнено: ${stats.completed}</span>
            <span class="l-gray">Всего: ${stats.total}</span>
          </div>
        </div>

        <!-- Столбики за неделю -->
        <div class="stats-card">
          <h3 class="stats-title">Активность за неделю</h3>
          <div class="bar-chart">
             ${stats.days.map(d => `
               <div class="bar-column">
                 <div class="bar-fill" style="height: ${Math.max(d.val * 15, 5)}px"></div>
                 <span class="bar-label">${d.label}</span>
               </div>
             `).join('')}
          </div>
        </div>

        <div class="motivation-box">
          <div class="avatar">🙂</div>
          <div class="bubble">"Помни, ради чего ты начал. Твои усилия обязательно окупятся."</div>
        </div>
      </div>
    `;
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p style="color:red; text-align:center;">Ошибка загрузки данных</p>`;
  }
}

// ЛОГИКА ПОДСЧЕТА (ГРУППИРОВКА ПО created_at)
function calculateWeeklyStats(tasks) {
  const now = new Date();
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const weekData = [];

  // Считаем для последних 7 дней
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0]; // Формат YYYY-MM-DD
    
    // Считаем задачи, которые были созданы в этот день и выполнены
    const count = tasks.filter(t => 
      t.is_completed && t.created_at && t.created_at.startsWith(dateStr)
    ).length;

    weekData.push({ label: days[d.getDay()], val: count });
  }

  const completed = tasks.filter(t => t.is_completed).length;
  const total = tasks.length;

  return {
    completed: completed,
    total: total,
    totalPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
    days: weekData
  };
}