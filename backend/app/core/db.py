from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models.models import Base

engine_args = {}
# Check if it's a LibSQL connection (libsql://, https://...turso.io, or explicitly prefixed)
if "libsql" in settings.DATABASE_URL or "turso.io" in settings.DATABASE_URL:
    engine_args["connect_args"] = {"auth_token": settings.TURSO_AUTH_TOKEN}

engine = create_engine(settings.SQLALCHEMY_DATABASE_URI, **engine_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
