import { dataService } from "../../core/dataService.js";
import { getMainContainer } from "../../core/uiContainer.js";

export async function renderTrackerUI() {
  const container = getMainContainer();
  container.innerHTML = `<h2 class="loading">Загрузка рейтинга...</h2>`;

  try {
    const tasks = await dataService.getTasks();
    const leaderboard = await dataService.getLeaderboard();
    
    const completed = tasks.filter(t => t.is_completed).length;
    const total = tasks.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    container.innerHTML = `
      <div class="tracker-page">
        <h2>📊 Твой прогресс</h2>
        <div class="progress-box">
          <div class="bar-bg"><div class="bar-fill" style="width: ${percent}%"></div></div>
          <p>${percent}% выполнено (${completed} из ${total})</p>
        </div>

        <div class="stats-row">
          <div class="leaderboard-card">
            <h3>🏆 Лидерборд</h3>
            <table>
              ${leaderboard.map((u, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${u.email.split('@')[0]}</td>
                  <td><b>${u.points}</b></td>
                </tr>
              `).join('')}
            </table>
          </div>
          <div class="chart-card">
             <h3>📈 Активность</h3>
             <canvas id="trackerChart"></canvas>
          </div>
        </div>
      </div>
    `;

    initChart(completed, total - completed);

  } catch (err) { container.innerHTML = "Ошибка загрузки данных"; }
}

function initChart(done, pending) {
  const setup = () => {
    new Chart(document.getElementById('trackerChart'), {
      type: 'doughnut',
      data: {
        labels: ['Завершено', 'В процессе'],
        datasets: [{ data: [done, pending], backgroundColor: ['#4caf50', '#333'], borderWidth: 0 }]
      },
      options: { plugins: { legend: { display: false } }, cutout: '70%' }
    });
  };
  if (!window.Chart) {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/chart.js";
    s.onload = setup;
    document.head.appendChild(s);
  } else { setup(); }
}