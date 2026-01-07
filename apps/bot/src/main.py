import asyncio
import logging
import os

from aiogram import Bot, Dispatcher, F
from aiogram.filters import CommandStart
from aiogram.types import Message
from aiogram.utils.keyboard import ReplyKeyboardBuilder
from dotenv import load_dotenv


def main_menu_keyboard():
    kb = ReplyKeyboardBuilder()
    kb.button(text="🍽 Готовая еда")
    kb.button(text="🛒 Мои заказы")
    kb.button(text="ℹ️ Информация")
    kb.adjust(2, 1)  # 2 кнопки в первом ряду, 1 кнопка во втором
    return kb.as_markup(resize_keyboard=True, input_field_placeholder="Выберите действие")


async def main() -> None:
    load_dotenv()

    token = os.getenv("BOT_TOKEN")
    if not token:
        raise RuntimeError("BOT_TOKEN is not set in .env")

    logging.basicConfig(level=logging.INFO)

    bot = Bot(token=token)
    dp = Dispatcher()

    @dp.message(CommandStart())
    async def start_handler(message: Message) -> None:
        await message.answer(
            "Приветствуем в FoodFix! Это бот для заказа готовой еды в Белграде.\n\n"
            "Бесплатная доставка от 2 000 динар по Белграду.",
            reply_markup=main_menu_keyboard(),
        )

    @dp.message(F.text == "🍽 Готовая еда")
    async def food_handler(message: Message) -> None:
        await message.answer(
            "Чтобы открыть каталог, нажмите кнопку ниже (в следующем шаге будет WebApp)."
        )

    @dp.message(F.text == "🛒 Мои заказы")
    async def orders_handler(message: Message) -> None:
        await message.answer(
            "В данный момент у вас нет активных заказов.\n"
            "Позже здесь будет история заказов из SQLite."
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