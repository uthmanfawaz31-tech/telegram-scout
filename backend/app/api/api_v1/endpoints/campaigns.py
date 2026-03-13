from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from typing import Any, List
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models import models
from app.schemas import schemas
from app.services.telegram_service import TelegramService
import asyncio
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

async def run_broadcast(campaign_id: int, session_string: str, chat_ids: List[int], message: str, db: Session):
    db_campaign = db.query(models.Campaign).filter(models.Campaign.id == campaign_id).first()
    if not db_campaign:
        return

    db_campaign.status = "running"
    db.commit()

    service = TelegramService(session_string)
    try:
        await service.connect()
        for chat_id in chat_ids:
            try:
                await service.send_message(chat_id, message)
                log = models.BroadcastLog(
                    campaign_id=campaign_id,
                    group_id=str(chat_id),
                    status="success"
                )
                db.add(log)
            except Exception as e:
                logger.error(f"Failed to send to {chat_id}: {e}")
                log = models.BroadcastLog(
                    campaign_id=campaign_id,
                    group_id=str(chat_id),
                    status="failed",
                    error_message=str(e)
                )
                db.add(log)
            db.commit()
            # Anti-ban delay is already in service.send_message
    except Exception as e:
        logger.error(f"Broadcast error: {e}")
        db_campaign.status = "failed"
    finally:
        db_campaign.status = "completed"
        db.commit()
        await service.disconnect()

@router.post("/", response_model=schemas.Campaign)
async def create_campaign(
    campaign_in: schemas.CampaignCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
) -> Any:
    """
    Create a new broadcast campaign.
    """
    # For now, we'll just broadcast to all dialogs of the first connected account
    # In a real app, you'd select which account and which groups
    account = db.query(models.TelegramAccount).filter(models.TelegramAccount.is_connected == True).first()
    if not account or not account.session_string:
        raise HTTPException(status_code=400, detail="No connected Telegram account found")

    db_campaign = models.Campaign(
        name=campaign_in.name,
        message_text=campaign_in.message_text,
        scheduled_at=campaign_in.scheduled_at,
        status="pending"
    )
    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)

    # Get dialogs to broadcast to
    service = TelegramService(account.session_string)
    try:
        dialogs = await service.get_dialogs()
        chat_ids = [d["id"] for d in dialogs if d["is_group"] or d["is_channel"]]
        
        # Start background task
        background_tasks.add_task(
            run_broadcast,
            db_campaign.id,
            account.session_string,
            chat_ids,
            campaign_in.message_text,
            db # Note: In production, you should create a new session in the background task
        )
    except Exception as e:
        db_campaign.status = "failed"
        db.commit()
        raise HTTPException(status_code=400, detail=f"Failed to fetch dialogs: {str(e)}")
    finally:
        await service.disconnect()

    return db_campaign

@router.get("/", response_model=List[schemas.Campaign])
def list_campaigns(db: Session = Depends(get_db)) -> Any:
    """
    List all campaigns.
    """
    return db.query(models.Campaign).all()
