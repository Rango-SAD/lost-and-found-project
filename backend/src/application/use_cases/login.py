# src/application/use_cases/login.py
from src.application.dto.auth_dto import LoginDTO, TokenDTO
from src.domain.interfaces.repositories import IUserRepository

class LoginUseCase:
    def __init__(self, user_repo: IUserRepository):
        self.user_repo = user_repo

    def execute(self, data: LoginDTO) -> TokenDTO:
        user = self.user_repo.get_by_username(data.username)

        if not user or user.password != data.password:
            raise Exception("نام کاربری یا رمز عبور اشتباه است")

        return TokenDTO(access_token="mock-jwt-token-for-user-" + str(user.id))