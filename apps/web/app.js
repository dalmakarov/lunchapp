const tg = window.Telegram?.WebApp;

const debugEl = document.getElementById("debug");
function debug(obj) {
  debugEl.textContent = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
}

if (tg) {
  tg.ready();
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