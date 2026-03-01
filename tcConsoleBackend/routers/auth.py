from fastapi import APIRouter, HTTPException, Response, Depends
from jose import JWTError
from schemas.schema import AuthLogin, AuthSignup, Email, ValidateSignup
from utils.confgmail import email_config
from jinja2 import Environment, FileSystemLoader
import random
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
        
        if data.get("is_active") == False : return {"status" : False, "message" : "Not an active user contact admin"}

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
            secure=True,       
            max_age=60*60*24*7,
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
        secure=True,
        samesite="lax"
    )

    return {
        "status": True,
        "message": "logged out"
    }



@router.post("/signupmail")
async def send_signupcode(payload : Email):

    user_email = payload.email.lower().strip()
    user_collection = collections_load("tcUsers")    

    try:

        data = user_collection.find_one(
            {"user_email": user_email},
            {"_id": 0, "name" : 1, "has_signed_up" : 1}
        )

        if not data:
            return {"status": False,
                    "message" : "Not an authorized user",
                    "payload" : False}

        if data.get("has_signed_up"):
            return {"status": False,
                    "message" : "Already a user please login",
                    "payload" : False}
        
        signup_code = random.randint(100000, 999999)
        
        name = data.get("name")
        
        env = Environment(loader= FileSystemLoader("./templates"), autoescape= True)
        template = env.get_template("signupcodetemplate.html")

        mail_html = template.render(
            name=name,
            signup_code = signup_code
        )

        status = await email_config(
            subject="tConsole- Email Varification",
            cc_mail=[],
            to_mail=[user_email],
            mail_html=mail_html,
        )

        user_collection.update_one({"user_email": user_email},
                            {
                                "$set" : {"signup_code" : signup_code}
                            })

        if not status:
            return{
                "status" : False,
                "message" : "Unable to send code",
                "payload" : False
            }  

        return{
            "status" : True,
            "message" : "Sign-up code sent successfully, Please check your mail",
            "payload" : {
                "name" : name,
                "username" : user_email
            }
        }


    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Sign-up Failed"
        )



@router.post("/signupcodeval")
async def validate_signupcode(payload : ValidateSignup):
    
    name = payload.name
    username = payload.username
    user_collection = collections_load("tcUsers")  

    try:
        code = int(payload.code)

        data = user_collection.find_one(
            {"user_email": username},
            {"_id": 0, "signup_code" : 1}
        )

        if not data:return {"status": False, "message": "User not found", "payload": False}
        
        if not data.get("signup_code"):return { "status": False, "message": "No code generated. Please request a new code", "payload": False}

        if not code == data.get("signup_code"):
            return {
                "status" : False,
                "message" : "Not a valid varification code please try again with a valid one",
                "payload" : False
            }
        
        user_collection.update_one(
            {"user_email": username},
            {"$unset": {"signup_code": ""}}
        )
        
        return{
            "status" : True,
            "message" : "Varification successful, please provide a password",
            "payload" : {
                "name" : name,
                "username" : username
            } 
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Sign-up Failed"
        )


@router.post("/signup")
async def signup(payload: AuthSignup):

    username = payload.username.lower().strip()
    password = payload.password
    password_re = payload.password_re

    user_collection = collections_load("tcUsers")   
    auth_collection = collections_load("tcAuth")    

    try:

        if password != password_re:
            return{
                "status" : False,
                "message" : "Passwords do not match"
            }

        data = user_collection.find_one(
            {"user_email": username},
            {"_id": 0}
        )

        if not data:
            return {"status": False,
                    "message" : "Not an authorized user"}

        if data.get("has_signed_up"):
            return {"status": False,
                    "message" : "Already a user please login"}

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

        return {"status": True,
                "message" : "Sign-up complete, please login"}

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500,
            detail="Signup failed"
        )

    