from datetime import datetime, timedelta
from fastapi import HTTPException
from src.infrastructure.database.models.otp_document import OTPDocument
from src.infrastructure.database.models.user_document import UserDocument
from src.infrastructure.security.email_handler import EmailHandler
from src.infrastructure.security.auth_handler import AuthHandler
from src.api.schemas.auth_schema import RegisterFinalRequest

class RegisterUseCase:
    async def send_otp(self, email: str):
        existing_user = await UserDocument.find_one(UserDocument.email == email)
        if existing_user:
            raise HTTPException(status_code=400, detail="User with this email already exists")

        otp = EmailHandler.generate_otp()
        expires = datetime.utcnow() + timedelta(minutes=5)
        
        otp_entry = await OTPDocument.find_one(OTPDocument.email == email)
        if otp_entry:
            await otp_entry.update({"$set": {"otp_code": otp, "expire_at": expires}})
        else:
            otp_doc = OTPDocument(email=email, otp_code=otp, expire_at=expires)
            await otp_doc.insert()
        
        await EmailHandler.send_verification_email(email, otp)
        return {"message": "Verification code sent to email"}

    async def verify_and_register(self, data: RegisterFinalRequest):
        otp_entry = await OTPDocument.find_one(
            OTPDocument.email == data.email,
            OTPDocument.otp_code == data.otp_code
        )

        if data.password != data.confirm_password:
            raise HTTPException(status_code=400, detail="Passwords do not match")

        if not otp_entry:
            raise HTTPException(status_code=400, detail="Invalid or incorrect OTP code")

        if otp_entry.expire_at < datetime.utcnow():
            await otp_entry.delete()
            raise HTTPException(status_code=400, detail="OTP has expired")

        user_exists = await UserDocument.find_one(UserDocument.username == data.username)
        if user_exists:
            raise HTTPException(status_code=400, detail="Username is already taken")

        hashed_password = AuthHandler.hash_password(data.password)
        new_user = UserDocument(
            username=data.username,
            email=data.email,
            password=hashed_password
        )
        await new_user.insert()

        await otp_entry.delete()
        
        return {"message": "Account created successfully!"}