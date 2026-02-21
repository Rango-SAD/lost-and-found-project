from fastapi import APIRouter, HTTPException, Depends
from src.api.schemas.auth_schema import (
    LoginRequest, 
    LoginResponse, 
    EmailRequest,          
    RegisterFinalRequest    
)
from src.application.use_cases.login import LoginUseCase
from src.application.use_cases.register import RegisterUseCase 
from src.application.dto.auth_dto import LoginDTO
from src.domain.interfaces.repositories.user_repository import UserRepository

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_login_use_case():
    repo = UserRepository()
    return LoginUseCase(repo)

@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest, use_case: LoginUseCase = Depends(get_login_use_case)):
    try:
        dto = LoginDTO(username=payload.username, password=payload.password)
        result = await use_case.execute(dto)
        return LoginResponse(access_token=result.access_token)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
    

@router.post("/send-otp")
async def send_otp(payload: EmailRequest):
    use_case = RegisterUseCase()
    return await use_case.send_otp(payload.email)

@router.post("/register/confirm")
async def confirm_registration(payload: RegisterFinalRequest):
    use_case = RegisterUseCase()
    return await use_case.verify_and_register(payload)