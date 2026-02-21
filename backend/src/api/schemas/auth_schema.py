from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    username: str  
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class EmailRequest(BaseModel):
    email: EmailStr

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp_code: str

class RegisterFinalRequest(BaseModel):
    email: EmailStr
    username: str
    password: str
    confirm_password: str
    otp_code: str  

