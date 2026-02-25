from fastapi import APIRouter, HTTPException, Response, Depends
from jose import JWTError
from schemas.schema import AuthLogin, AuthSignup
from utils.dbfunc import collections_load
from utils.cache import to_hash, varify_hash
from utils.jwt_utils import create_access_token, parse_token
from datetime import datetime



router = APIRouter(prefix="/auth")

@router.post("/login")
async def login(payload : AuthLogin, response : Response):

    collection = collections_load("tcAuth")

    username = payload.username
    password = payload.password

    try:

        data = collection.find_one({"user_email" : username},
                            {
                                "_id" : 0,
                                "name" : 1,
                                "user_id" : 1,
                                "password_hash" : 1,
                                "role" : 1,
                                "is_active" : 1
                            })
        
        if not data : return {"status" : False,
                              "message" : "User not found, please sign up"}
        
        if data.get("is_active") == False : return {"status" : "Not an active user contact admin"}

        if not varify_hash(password, data.get("password_hash")):
            return {"status": False,
                    "message" : "Invalid credentials"}

        token = create_access_token({
            "name" : data.get("name"),
            "user_id" : data.get("user_id"),
            "role" : data.get("role"),
            "username" : username
        })

        response.set_cookie(
            key="auth_token",
            value=token,
            httponly=True,
            samesite="lax",     
            secure=False,       
            max_age=60*60*8,
            path="/"         
        )

        return {"status": True,
                "message" : "Logging you in"}

    
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Login unsuccessfull"
        )
    

@router.get("/whoami")
async def whoami(whoami : dict = Depends(parse_token)):
    try:

        return{
            "name" : whoami["name"],
            "user_id" : whoami["user_id"],
            "role" : whoami["role"].capitalize(),
            "username" : whoami["username"]
        }
    
    except JWTError as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Login not successfull"
        )


@router.post("/logout")
async def logout(response: Response):

    response.delete_cookie(
        key="auth_token",
        path="/",
        secure=False,
        samesite="lax"
    )

    return {
        "status": True,
        "message": "logged out"
    }



@router.post("/signup")
async def signup(payload: AuthSignup):

    username = payload.username.strip()
    password = payload.password

    user_collection = collections_load("tcUsers")   
    auth_collection = collections_load("tcAuth")    

    try:

        data = user_collection.find_one(
            {"user_email": username},
            {"_id": 0}
        )

        if not data:
            return {"status": "Not an authorized user"}

        if data.get("has_signed_up"):
            return {"status": "Already a user please login"}

        auth_doc = {
            "name": data.get("name"),
            "user_id": data.get("user_id"),
            "user_email": data.get("user_email"),
            "password_hash": to_hash(password),
            "role": data.get("role"),
            "is_active": True,
            "created_at": datetime.now(),
            "last_login": None
        }

        auth_collection.insert_one(auth_doc)

        user_collection.update_one(
            {"user_email": username},
            {
                "$set": {"has_signed_up": True}
            }
        )

        return {"status": "Sign Up completed please sign in"}

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500,
            detail="Signup failed"
        )

    