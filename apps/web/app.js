const tg = window.Telegram?.WebApp;

const debugEl = document.getElementById("debug");
function debug(obj) {
  debugEl.textContent = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
}

function applyTheme() {
  if (!tg) return;

  const schemeFromTelegram = tg.colorScheme; // может быть всегда "light" на Desktop
  const schemeFromSystem = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  
  // если Telegram не даёт нормальную тему (themeParams пустой), доверяем системе
  const hasThemeParams = tg.themeParams && Object.keys(tg.themeParams).length > 0;
  const effectiveScheme = hasThemeParams ? schemeFromTelegram : schemeFromSystem;
  const isDark = effectiveScheme === "dark";
  const p = tg.themeParams || {};
  const root = document.documentElement;

  const fallback = isDark
    ? { bg: "#0f172a", text: "#e5e7eb", hint: "#94a3b8", card: "#111827", button: "#3b82f6", buttonText: "#ffffff" }
    : { bg: "#ffffff", text: "#111827", hint: "#6b7280", card: "#f3f4f6", button: "#2ea6ff", buttonText: "#ffffff" };

  root.style.setProperty("--bg", p.bg_color || fallback.bg);
  root.style.setProperty("--text", p.text_color || fallback.text);
  root.style.setProperty("--hint", p.hint_color || fallback.hint);
  root.style.setProperty("--card", p.secondary_bg_color || fallback.card);
  root.style.setProperty("--button", p.button_color || fallback.button);
  root.style.setProperty("--button-text", p.button_text_color || fallback.buttonText);

  debug({
    platform: tg.platform,
    version: tg.version,
    colorScheme: tg.colorScheme,
    effectiveScheme,
    hasThemeParams: tg.themeParams ? Object.keys(tg.themeParams).length : 0,
    themeParams: tg.themeParams || null,
  });
}

if (tg) {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener?.("change", applyTheme);
    mq.addListener?.(applyTheme); // для старых WebView
  tg.ready();

  applyTheme();

  tg.onEvent("themeChanged", applyTheme);

  // fallback для Desktop: не всегда шлёт themeChanged / не обновляет параметры
  let lastScheme = tg.colorScheme;
  setInterval(() => {
    if (tg.colorScheme !== lastScheme) {
      lastScheme = tg.colorScheme;
      applyTheme();
    }
  }, 400);

  document.addEventListener("visibilitychange", () => applyTheme());
  window.addEventListener("focus", () => applyTheme());
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
  tg.close();
});