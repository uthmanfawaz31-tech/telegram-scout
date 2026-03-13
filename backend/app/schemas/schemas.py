from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class TelegramAccountBase(BaseModel):
    phone: str
    api_id: str
    api_hash: str

class TelegramAccountCreate(TelegramAccountBase):
    pass

class TelegramAccount(TelegramAccountBase):
    id: int
    is_connected: bool

    class Config:
        from_attributes = True

class CampaignBase(BaseModel):
    name: str
    message_text: str
    scheduled_at: datetime

class CampaignCreate(CampaignBase):
    chat_ids: Optional[List[int]] = None

class Campaign(CampaignBase):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
