from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean(), default=True)
    is_superuser = Column(Boolean(), default=False)

class TelegramAccount(Base):
    __tablename__ = "telegram_accounts"
    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String, unique=True, index=True)
    session_string = Column(String)
    api_id = Column(String)
    api_hash = Column(String)
    is_connected = Column(Boolean(), default=True)

class Campaign(Base):
    __tablename__ = "campaigns"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    message_text = Column(Text)
    scheduled_at = Column(DateTime)
    status = Column(String, default="pending") # pending, running, completed, cancelled
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class BroadcastLog(Base):
    __tablename__ = "broadcast_logs"
    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"))
    group_id = Column(String)
    group_name = Column(String)
    status = Column(String) # success, failed
    error_message = Column(String, nullable=True)
    sent_at = Column(DateTime, default=datetime.datetime.utcnow)
