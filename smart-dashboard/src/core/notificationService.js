export const notify = (text, type = "success") => {
  const toast = document.createElement("div");
  toast.innerText = text;
  toast.style = `
    position: fixed; top: 20px; right: 20px; padding: 12px 24px; border-radius: 30px;
    color: white; z-index: 10000; font-family: sans-serif; transition: 0.4s ease;
    box-shadow: 0 4px 15px rgba(0,0,0,0.4); font-weight: bold;
    background: ${type === "success" ? "#4caf50" : "#f44336"};
    transform: translateX(100px); opacity: 0;
  `;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.transform = "translateX(0)"; toast.style.opacity = "1"; }, 10);
  setTimeout(() => { 
    toast.style.opacity = "0"; 
    toast.style.transform = "translateX(100px)";
    setTimeout(() => toast.remove(), 500); 
  }, 3000);
};