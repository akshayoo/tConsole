from fastapi import APIRouter, HTTPException, Depends
from utils.llmcall import ModelLoad
from utils.jwt_utils import parse_token
from utils.dbfunc import collections_load
from schemas.schema import ConversationPop, Inference
from datetime import datetime
from uuid import uuid1
import time
from bson import ObjectId
from bson.errors import InvalidId

MODEL = "/home/ak/Projects/Models/TextGeneration/models--meta-llama--Meta-Llama-3-8B-Instruct/snapshots/8afb486c1db24fe5011ec46dfbe5b5dccdb575c2"
#MODEL = "/home/akshay/Projects/models/text/models--mistralai--Mistral-7B-Instruct-v0.3/snapshots/0d4b76e1efeb5eb6f6b5e757c79870472e04bd3a"

LLM = ModelLoad(path=MODEL)   
LLM.load_in4bit() 

router = APIRouter(prefix= "/cuesai")

@router.get("/history")
async def interaction(usertok : dict = Depends(parse_token)):

    user_collection = collections_load("tcUsers")
    convo_collection = collections_load("cuesaiConversations")

    try:
        userid = usertok["user_id"].strip()
        

        user = user_collection.find_one({"user_id" :userid},
                                                 {
                                                     "_id" : 1
                                                 })

        conversations = (convo_collection.find({"user_id": user["_id"],   "deleted": False }).sort("updated_at", -1))
        
        convo_obj = []

        for doc in conversations:
            doc["_id"] = str(doc["_id"])
            doc["user_id"] = str(doc["user_id"])
            convo_obj.append(doc)
        
        return{
            "status" : True,
            "message" : "Fetch successfull",
            "payload" : convo_obj
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Unable to load message"
        )
    



@router.post("/conversationspop")
async def conversation_pop(payload : ConversationPop, _ : dict = Depends(parse_token)):

    convo_id = payload.convo_id

    messages_collection = collections_load("cuesaiMessages")

    conversations_collection = collections_load("cuesaiConversations")

    try:
        try:
            convo_object_id = ObjectId(convo_id)
        except InvalidId:
            raise HTTPException(
                status_code=400,
                detail="Invalid conversation id"
            )

        check = conversations_collection.find_one(
            {"_id": convo_object_id}
        )


        check = conversations_collection.find_one({"_id" : convo_object_id})
        if not check:
            return{
                "status" : False,
                "message" : "Chat not accesible"
            }

        conversations = []
        data = messages_collection.find({"conversation_id" : convo_object_id}).sort("created_at", 1)

        for doc in data:
            doc["_id"] = str(doc["_id"])
            doc["conversation_id"] = str(doc["conversation_id"])
            conversations.append(doc)

        return{
            "status" : True,
            "message" : "Data fetched",
            "payload" : conversations
        }


    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Error loading conversations"
        )
    



@router.post("/llminference")
async def interaction(payload : Inference , usertok : dict = Depends(parse_token)):

    conversations_collection = collections_load("cuesaiConversations")
    messages_collection = collections_load("cuesaiMessages")
    user_collection = collections_load("tcUsers")

    try:

        userid = usertok["user_id"].strip()

        user = user_collection.find_one({"user_id" :userid},
                                                    {
                                                        "_id" : 1
                                                    })
        response = LLM.generate(query=payload.user_message, gencontext= True)

        if payload.new_chat:

            new_convo = {
                "user_id" : user["_id"],
                "title" : LLM.generate(query= response, title= True),
                "deleted" : False,
                "created_at" : datetime.now(),
                "updated_at" : datetime.now()
            }

            new_conversation = conversations_collection.insert_one(new_convo)
            convo_id =  new_conversation.inserted_id


        
        if not payload.new_chat:

            convo_id = ObjectId(payload.convo_id)

            conversations_collection.update_one({"_id" : convo_id},
                                                {
                                                    "$set" : {"updated_at" : datetime.now()}
                                                })

        user_message = {
            "conversation_id" : convo_id,
            "sender" : "user",
            "message" : payload.user_message,
            "created_at" : datetime.now()
        }
        
        messages_collection.insert_one(user_message)

        llm_message = {
            "conversation_id" : convo_id,
            "sender" : "assistant",
            "message" : response,
            "created_at" : datetime.now()
        }
            
        messages_collection.insert_one(llm_message)

        return{
            "status" : True,
            "message" : "Responded",
            "payload" : {
                "_id" : uuid1(),
                "sender" : "assistant",
                "message": response,
                "conversation_id": str(convo_id)
            }
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Internal server error"
        )


@router.post("/deletchat")
async def delet_chat(payload : ConversationPop, _ : dict = Depends(parse_token)):

    convo_id = payload.convo_id
    conversations_collection = collections_load("cuesaiConversations")

    try:
        
        delete_check = conversations_collection.find_one({"_id" : ObjectId(convo_id)},
                                                         {
                                                            "deleted" : 1
                                                         })
        
        if delete_check.get("deleted") :
            return{
                "status" : False,
                "message"  : "Conversation not found"
            }

        conversations_collection.update_one({"_id" : ObjectId(convo_id)},
                                            {
                                                "$set" : {
                                                    "deleted" : True
                                                }
                                            })
        
        return{
            "status" : True,
            "message"  : "Conversation deleted"
        }
        

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Deleting chat failed"
        )


