import asyncio
import json
import logging
import os

from aiogram import Bot, Dispatcher, F
from aiogram.filters import CommandStart
from aiogram.types import Message, WebAppInfo
from aiogram.utils.keyboard import ReplyKeyboardBuilder
from dotenv import load_dotenv


def main_menu_keyboard(webapp_url: str):
    kb = ReplyKeyboardBuilder()

    kb.button(text="🍽 Готовая еда", web_app=WebAppInfo(url=webapp_url))
    kb.button(text="🛒 Мои заказы")
    kb.button(text="ℹ️ Информация")
    kb.adjust(2, 1)
    return kb.as_markup(resize_keyboard=True, input_field_placeholder="Выберите действие")


async def main() -> None:
    load_dotenv()

    token = os.getenv("BOT_TOKEN")
    if not token:
        raise RuntimeError("BOT_TOKEN is not set in .env")

    webapp_url = os.getenv("WEBAPP_URL")
    if not webapp_url:
        raise RuntimeError("WEBAPP_URL is not set in .env")

    logging.basicConfig(level=logging.INFO)

    bot = Bot(token=token)
    dp = Dispatcher()

    @dp.message(CommandStart())
    async def start_handler(message: Message) -> None:
        await message.answer(
            "Приветствуем в LaunchApp! Это бот для заказа готовой еды в Белграде.\n"
            "Бесплатная доставка от 2 000 динар по Белграду.",
            reply_markup=main_menu_keyboard(webapp_url),
        )

    @dp.message(F.web_app_data)
    async def webapp_data_handler(message: Message) -> None:
        raw = message.web_app_data.data  # строка
        try:
            payload = json.loads(raw)
        except Exception:
            await message.answer(f"Получены данные из WebApp, но это не JSON:\n{raw}")
            return

        # На первом шаге просто подтверждаем, что получили payload.
        # Потом сюда добавим: расчёт доставки, запись в SQLite, отправку в админ-чат.
        await message.answer(
            "✅ Получил данные из WebApp.\n"
            f"Тип: {payload.get('type')}\n"
            f"Позиции: {len(payload.get('items', []))}"
        )

        logging.info("WebApp payload: %s", payload)

    @dp.message(F.text == "🛒 Мои заказы")
    async def orders_handler(message: Message) -> None:
        await message.answer(
            "Пока история заказов не подключена.\n"
            "Следующий шаг — сохранять подтверждённые заказы в SQLite."
        )

    @dp.message(F.text == "ℹ️ Информация")
    async def info_handler(message: Message) -> None:
        await message.answer(
            "ℹ️ Информация:\n"
            "— Заказ еды в Белграде\n"
            "— Бесплатная доставка от 2 000 RSD\n"
            "— Оплата при получении"
        )

    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())