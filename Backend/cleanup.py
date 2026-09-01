from app.database import SessionLocal
from app.services import temp_url_service

def main():
    db = SessionLocal()
    try:
        temp_url_service.delete_expired_urls(db)
        print("Cleanup done.")
    finally:
        db.close()

if __name__ == "__main__":
    main()