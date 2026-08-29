from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import temp_urls

# Import every model module here so Base.metadata knows about its table
# before create_all runs. Only temp_url exists for now — add the others
# (url, user, url_click) to this import line as you build them out.
from app.models import temp_url  # noqa: F401

# Creates tables if they don't exist yet. Fine for early development;
# switch to Alembic migrations once this is live, so schema changes
# are tracked and reversible instead of silently auto-created.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BlazeURL API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(temp_urls.router)
