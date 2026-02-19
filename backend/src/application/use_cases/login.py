from src.application.dto.auth_dto import LoginDTO, TokenDTO
from src.domain.interfaces.repositories.IUserRepository import IUserRepository

from src.infrastructure.security.auth_handler import AuthHandler
# سایر ایمپورت‌ها...

class LoginUseCase:
    def __init__(self, user_repo: IUserRepository):
        self.user_repo = user_repo

    async def execute(self, data: LoginDTO) -> TokenDTO:
        user = await self.user_repo.get_by_username(data.username)

        if not user or not AuthHandler.verify_password(data.password, user.password):
            raise Exception("نام کاربری یا رمز عبور اشتباه است.")

        token = AuthHandler.create_access_token({"sub": user.username})
        
        return TokenDTO(access_token=token)