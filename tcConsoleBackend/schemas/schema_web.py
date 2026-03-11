from pydantic import BaseModel, EmailStr

class BrochureDwnld(BaseModel):
    service : str
    fullname : str
    email : EmailStr
    phone: str