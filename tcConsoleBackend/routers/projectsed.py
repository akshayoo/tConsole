from fastapi import APIRouter, HTTPException, Depends
from utils.dbfunc import collections_load
from schemas.schema import EditCheck
from utils.jwt_utils import parse_token

router = APIRouter(prefix="/project")
collection = collections_load("tcProjects")

@router.post("editreq")
async def editdetails(payload :  EditCheck, usertok : dict = Depends(parse_token)):
    try:

        if usertok["role"] == "admin": pass 
        else: return{
            "status" : False,
            "message" : "You are not allowed to perform this action"
        }
        
        data = collection.find_one({"project_id" : payload.project_id},
                                   {
                                       "_id" : 0,
                                       f"project_status.{payload.meta}" : 1,
                                       f"{payload.meta}" :  1,
                                       "audit.username" : 1
                                   })
        
        if usertok["role"] == "bd":
        
            if not usertok["username"] == data.get("audit").get("username"):
                return{
                    "status" : False,
                    "message" : "User not allowed"
                }
            
        if not data.get("project_status").get(payload.meta):
            return{
                "status" : False,
                "message" : f"No {payload.meta.replace("_", " ")} submission found, Please submit one to perform this action"
            }
            
        return {
            "status" : True,
            "message" : payload.meta,
            "payload" : data.get(f"{payload.meta}", {})
        }


    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Unable to process request"
        )
