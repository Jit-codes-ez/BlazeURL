#Its used to clean database after a certain period of time. It is scheduled to run every 24 hours using a cron job.
#After deployment, I have to set up a cron job to run this script every 24 hours. This will ensure that expired URLs are removed from the database and Redis cache, keeping the system clean and efficient.

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