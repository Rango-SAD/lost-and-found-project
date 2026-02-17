from dataclasses import dataclass

@dataclass
class LoginDTO:
    username: str
    password: str

@dataclass
class TokenDTO:
    access_token: str
    token_type: str = "bearer"