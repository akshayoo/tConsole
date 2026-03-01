import os
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, Request
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
TOKEN_EXPIRE_HOURS = 168

def create_access_token(data: dict):
    
    payload = data.copy()
    payload["exp"] = datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRE_HOURS)
    payload["iat"] = datetime.now(timezone.utc) 
    
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

def decode_token(token: str) -> dict:

    try:

        payload = jwt.decode(token, SECRET_KEY, algorithms= ALGORITHM)

        required_info = ["name", "user_id", "role", "username"]

        for info in required_info:
            if info not in payload:
                raise HTTPException(
                    status_code= 401,
                    detail= "Not a valid token"
                )
        
        return payload
    
    except jwt.ExpiredSignatureError:

        raise HTTPException(
            status_code= 402,
            detail="Token has expired. Please login again."
        )
    
    except jwt.JWTError as e:
        print(str(e))
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )
    

def parse_token(requests : Request):

    token = requests.cookies.get("auth_token")

    if not token: raise HTTPException(status_code= 402, detail= "Not authenticated")

    return decode_token(token)