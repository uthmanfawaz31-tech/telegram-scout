from telethon import TelegramClient, events, functions, types
from telethon.sessions import StringSession
from app.core.config import settings
import logging
import re
import random

logger = logging.getLogger(__name__)

class TelegramService:
    def __init__(self, session_string: str = None):
        self.api_id = settings.TELEGRAM_API_ID
        self.api_hash = settings.TELEGRAM_API_HASH
        self.client = TelegramClient(
            StringSession(session_string),
            self.api_id,
            self.api_hash
        )

    async def connect(self):
        if not self.api_id or not self.api_hash:
            logger.error("TELEGRAM_API_ID or TELEGRAM_API_HASH is missing in .env")
            raise ValueError("Telegram API credentials (ID and Hash) are missing. Please add them to your .env file.")
        
        if not self.client.is_connected():
            await self.client.connect()

    async def disconnect(self):
        if self.client.is_connected():
            await self.client.disconnect()

    async def send_otp(self, phone: str):
        await self.connect()
        logger.info(f"Sending OTP request for {phone}")
        return await self.client.send_code_request(phone)

    async def sign_in(self, phone: str, code: str, phone_code_hash: str):
        await self.connect()
        try:
            user = await self.client.sign_in(phone, code, phone_code_hash=phone_code_hash)
            session_str = self.client.session.save()
            return user, session_str
        except Exception as e:
            logger.error(f"Sign in error: {e}")
            raise e

    async def get_dialogs(self):
        await self.connect()
        dialogs = await self.client.get_dialogs()
        return [{"id": d.id, "name": d.name, "is_group": d.is_group, "is_channel": d.is_channel} for d in dialogs]

    async def send_message(self, peer_id: int, message: str):
        await self.connect()
        # Simple anti-ban delay (should be more sophisticated in production)
        import random
        import asyncio
        await asyncio.sleep(random.uniform(2, 5))
        return await self.client.send_message(peer_id, message)

    async def scrape_groups(self, keyword: str):
        await self.connect()
        # This is a complex operation in Telethon, usually involving searching for public chats
        from telethon.tl.functions.contacts import SearchRequest
        result = await self.client(SearchRequest(q=keyword, limit=100))
        return [{"id": c.id, "title": c.title} for c in result.chats if hasattr(c, 'title')]

    async def join_group(self, group_link: str):
        await self.connect()
        from telethon.tl.functions.messages import ImportChatInviteRequest
        from telethon.tl.functions.channels import JoinChannelRequest
        try:
            if "t.me/joinchat/" in group_link:
                hash = group_link.split("/")[-1]
                await self.client(ImportChatInviteRequest(hash))
            else:
                await self.client(JoinChannelRequest(group_link))
            return True
        except Exception as e:
            logger.error(f"Join error: {e}")
            return False

    @staticmethod
    def parse_spintax(text: str) -> str:
        pattern = re.compile(r'\{([^{}]*)\}')
        while True:
            match = pattern.search(text)
            if not match:
                break
            options = match.group(1).split('|')
            text = text[:match.start()] + random.choice(options) + text[match.end():]
        return text
