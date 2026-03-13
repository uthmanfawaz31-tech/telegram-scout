from fastapi import APIRouter, Depends, HTTPException, Body
from typing import Any, List
from app.services.telegram_service import TelegramService
from app.core.config import settings
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models import models

router = APIRouter()

# Global dictionary to store phone_code_hash and active services per phone number
# (In-memory for demo, should use Redis/DB for production horizontal scaling)
code_hashes = {}
active_services = {}

def get_service(phone: str) -> TelegramService:
    if phone not in active_services:
        active_services[phone] = TelegramService()
    return active_services[phone]

@router.post("/send-code")
async def send_code(phone: str = Body(..., embed=True)) -> Any:
    """
    Send OTP to Telegram phone number.
    """
    try:
        service = get_service(phone)
        result = await service.send_otp(phone)
        code_hashes[phone] = result.phone_code_hash
        return {"msg": "OTP sent", "phone_code_hash": result.phone_code_hash}
    except Exception as e:
        # If error occurs, clear service so next try starts fresh
        active_services.pop(phone, None)
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def telegram_login(
    phone: str = Body(...), 
    code: str = Body(...),
    phone_code_hash: str = Body(...),
    db: Session = Depends(get_db)
) -> Any:
    """
    Login with OTP to Telegram.
    """
    try:
        service = get_service(phone)
        user, session_str = await service.sign_in(phone, code, phone_code_hash)
        
        # Save session to DB
        account = db.query(models.TelegramAccount).filter(models.TelegramAccount.phone == phone).first()
        if not account:
            account = models.TelegramAccount(
                phone=phone,
                session_string=session_str,
                api_id=settings.TELEGRAM_API_ID,
                api_hash=settings.TELEGRAM_API_HASH,
                is_connected=True
            )
            db.add(account)
        else:
            account.session_string = session_str
            account.is_connected = True
        db.commit()

        # Clean up service after successful login
        active_services.pop(phone, None)
        code_hashes.pop(phone, None)
        
        return {
            "msg": "Login successful",
            "user": {
                "id": getattr(user, 'id', None),
                "first_name": getattr(user, 'first_name', None),
                "username": getattr(user, 'username', None),
            },
            "session_string": session_str
        }
    except Exception as e:
        # Don't pop service yet in case they just mistyped the code
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/groups")
async def get_groups(db: Session = Depends(get_db)) -> Any:
    """
    Fetch user groups and channels.
    """
    account = db.query(models.TelegramAccount).filter(models.TelegramAccount.is_connected == True).first()
    if not account or not account.session_string:
        raise HTTPException(
            status_code=401, 
            detail="SESSION_MISSING: Your Telegram session has expired or is not found. Please login again."
        )
        
    try:
        service = TelegramService(account.session_string)
        groups = await service.get_dialogs()
        return groups
    except Exception as e:
        logger.error(f"Error fetching groups: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/scrape")
async def scrape_groups(keyword: str = Body(..., embed=True)) -> Any:
    """
    Group scraper by keyword.
    """
    try:
        service = TelegramService()
        groups = await service.scrape_groups(keyword)
        return groups
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/join")
async def join_group(group_link: str = Body(..., embed=True)) -> Any:
    """
    Ability to join groups.
    """
    try:
        service = TelegramService()
        success = await service.join_group(group_link)
        return {"success": success}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
