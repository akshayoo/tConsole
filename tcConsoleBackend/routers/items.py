from fastapi import APIRouter, Depends, HTTPException
from utils.jwt_utils import parse_token
from utils.dbfunc import collections_load
from schemas.schema import CustomServics

router = APIRouter(prefix= "/items")

@router.get("/catalog")
async def items_catalog( _ : dict = Depends(parse_token)):
    
    collection = collections_load('tcStdDeliverables')

    try:

        categories = collection.find({}, {"category": 1, "_id": 0})

        category_services = {}  

        for cat in categories:
            category = cat["category"]

            items = collection.find(
                {"category": category},
                {"services.service_name" : 1,
                "_id" : 0,
                "services.applications": 1,
                "services.supported_sample_types" : 1,
                "services.instrumentation" : 1,
                "services.standard_deliverables" : 1,
                "services.service_code" : 1
                }
            )

            service_list = []

            for doc in items:

                for service in doc.get("services", []):
                    service_name = service.get("service_name")
                    service_code = service.get("service_code")
                    application = service.get("applications")
                    supported_sample_types = service.get("supported_sample_types")
                    instrumentation = service.get("instrumentation")
                    standard_deliverables = service.get("standard_deliverables")

                    serv = {
                        "service_name" : service_name,
                        "service_code" : service_code,
                        "applications" : application,
                        "supported_sample_types" : supported_sample_types,
                        "instrumentation" : instrumentation,
                        "standard_deliverables" : standard_deliverables
                    }

                    service_list.append(serv)

            category_services[category] = service_list
        
        return category_services

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Fetch failed"
        )



@router.post("/insert")
async def insert_std(payload : CustomServics, usertok : dict = Depends(parse_token)):

    if usertok["role"] in ["projects", "analysis"]:
        return{
            "status" : False,
            "message" : "No permission"
        }
    
    category = payload.category.strip()

    collection = collections_load("tcStdDeliverables")

    try:

        check = collection.find_one({"services.service_code": payload.catalog_number.strip()})
        
        if check:
            return {
                "status" : False,
                "message" : "Service already exists"
            }
        
        document = {
            "service_name" : payload.service_name.strip(),
            "service_code" : payload.catalog_number.strip(),
            "applications" : payload.application.strip(),
            "supported_sample_types": [sam.strip() for sam in payload.sam_types.split(",")],
            "instrumentation" : {
                "platform": payload.platform.strip()
            },
            "standard_deliverables" : {
                "reports" : [std.strip() for std in payload.standard_deliverables.split(",")]
            }
        }

        collection.update_one(
            {"category": category},
            {
                "$push": {"services": document}
            },
            upsert=True
        )
        
        return {
            "status" : True,
            "message" : "Service line updated successfully"
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Failed to update custom services"
        )
