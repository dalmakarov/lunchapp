const tg = window.Telegram?.WebApp;

function applyTheme() {
  if (!tg) return;

  const p = tg.themeParams || {};
  const root = document.documentElement;

  root.style.setProperty("--bg", p.bg_color || "#ffffff");
  root.style.setProperty("--text", p.text_color || "#000000");
  root.style.setProperty("--hint", p.hint_color || "#6b7280");
  root.style.setProperty("--card", p.secondary_bg_color || "#f4f4f4");
  root.style.setProperty("--button", p.button_color || "#2ea6ff");
  root.style.setProperty("--button-text", p.button_text_color || "#ffffff");
}

const debugEl = document.getElementById("debug");
function debug(obj) {
  debugEl.textContent = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
}

if (tg) {
  tg.ready();
    applyTheme();
    tg.onEvent("themeChanged", applyTheme);
    
  debug({
    platform: tg.platform,
    version: tg.version,
    initDataUnsafe: tg.initDataUnsafe,
  });
} else {
  debug("Telegram WebApp API не найден. Откройте страницу внутри Telegram.");
}

document.getElementById("send").addEventListener("click", () => {
  const payload = {
    type: "test_order",
    items: [
      { id: "borsch", name: "Борщ", qty: 2, price: 400 },
      { id: "olivie", name: "Оливье", qty: 1, price: 450 },
    ],
    comment: "Тестовый заказ из WebApp",
  };

  if (!tg) {
    alert("Откройте WebApp внутри Telegram, иначе sendData не сработает.");
    return;
  }

  tg.sendData(JSON.stringify(payload));
  tg.close(); // можно убрать, если не хочешь закрывать окно после отправки
});