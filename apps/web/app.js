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
    function applyTheme() {
  if (!tg) return;

  const p = tg.themeParams || {};
  const root = document.documentElement;

  const isDark = (tg.colorScheme === "dark");

  // Фолбэк дефолты, если Telegram не дал themeParams (часто в Desktop)
  const fallback = isDark ? {
    bg: "#0f172a",
    text: "#e5e7eb",
    hint: "#94a3b8",
    card: "#111827",
    button: "#3b82f6",
    buttonText: "#ffffff",
  } : {
    bg: "#ffffff",
    text: "#111827",
    hint: "#6b7280",
    card: "#f3f4f6",
    button: "#2ea6ff",
    buttonText: "#ffffff",
  };

  root.style.setProperty("--bg", p.bg_color || fallback.bg);
  root.style.setProperty("--text", p.text_color || fallback.text);
  root.style.setProperty("--hint", p.hint_color || fallback.hint);
  root.style.setProperty("--card", p.secondary_bg_color || fallback.card);
  root.style.setProperty("--button", p.button_color || fallback.button);
  root.style.setProperty("--button-text", p.button_text_color || fallback.buttonText);
}
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