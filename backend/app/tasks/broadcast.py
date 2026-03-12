from celery import Celery
from app.core.config import settings

celery_app = Celery("tasks", broker=settings.CELERY_BROKER_URL)
celery_app.conf.result_backend = settings.CELERY_RESULT_BACKEND

celery_app.autodiscover_tasks(["app.tasks"])

@celery_app.task(name="broadcast_message")
def broadcast_message_task(session_string: str, chat_id: int, message: str):
    import asyncio
    from app.services.telegram_service import TelegramService
    
    async def run():
        service = TelegramService(session_string)
        try:
            await service.send_message(chat_id, message)
            return {"status": "success", "chat_id": chat_id}
        except Exception as e:
            return {"status": "failed", "chat_id": chat_id, "error": str(e)}
        finally:
            await service.disconnect()
            
    return asyncio.run(run())
