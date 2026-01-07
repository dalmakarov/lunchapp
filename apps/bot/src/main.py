import asyncio
import logging
import os

from aiogram import Bot, Dispatcher
from aiogram.filters import CommandStart
from aiogram.types import Message
from dotenv import load_dotenv


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
            "Бесплатная доставка от 2 000 динар по Белграду."
        )

    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())