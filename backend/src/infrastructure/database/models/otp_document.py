from beanie import Document
from datetime import datetime, timedelta

class OTPDocument(Document):
    email: str
    otp_code: str
    expire_at: datetime

    class Settings:
        name = "otp_codes"