from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import temp_urls, users, user_urls, link_redirect



Base.metadata.create_all(bind=engine)

app = FastAPI(title="BlazeURL API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://blazeurl.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/api")
app.include_router(temp_urls.router)
app.include_router(user_urls.router)
app.include_router(link_redirect.router)