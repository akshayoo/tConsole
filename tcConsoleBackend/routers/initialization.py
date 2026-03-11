from fastapi import APIRouter, Request, Depends
from utils.dbfunc import collections_load
from utils.confgmail import email_config
from schemas.schema import ProjectSubmission, ProjId
from jinja2 import FileSystemLoader, Environment
from fastapi.exceptions import HTTPException
from datetime import datetime
from uuid import uuid1
from utils.jwt_utils import parse_token


router =  APIRouter(prefix= "/initialization")


@router.get("/popservices")
async def prilim_info( _ : dict = Depends(parse_token)):

    try:

        collection = collections_load(collection = "tcStdDeliverables")

        categories = collection.find({}, {"category": 1, "_id": 0})

        category_services = {}  

        for cat in categories:
            category = cat["category"]

            items = collection.find(
                {"category": category},
                {
                    "services.service_name" : 1,
                    "_id" : 0,
                    "services.applications": 1,
                    "services.supported_sample_types" : 1,
                    "services.instrumentation" : 1,
                    "services.process_map" : 1,
                    "services.standard_deliverables" : 1
                }
            )

            service_list = []

            for doc in items:

                for service in doc.get("services", []):
                    service_name = service.get("service_name")
                    application = service.get("applications")
                    supported_sample_types = service.get("supported_sample_types")
                    instrumentation = service.get("instrumentation")
                    process_map = service.get("process_map")
                    standard_deliverables = service.get("standard_deliverables")

                    serv = {
                        "service_name" : service_name,
                        "applications" : application,
                        "supported_sample_types" : supported_sample_types,
                        "instrumentation" : instrumentation,
                        "process_map" : process_map,
                        "standard_deliverables" : standard_deliverables
                    }

                    service_list.append(serv)

            category_services[category] = service_list
        
        return category_services
    
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500, detail= "Not found"
        )



@router.post("/startproject")
async def form_fetch_mail(payload: ProjectSubmission, usertok : dict = Depends(parse_token)):

    if usertok["role"] == "projects" : 
        return {
            "status" : False,
            "message" : "User not allowed"
        }

    collection = collections_load(collection = "tcProjects") 

    std_del_list = []
    added_del_list = []

    for i, std_deliverables in enumerate(payload.standard_deliverables):
        std_dict = {
            "label" : std_deliverables,
            "task_number" : i,
            "completed" : False,
            "completed_at" : None,
            "updated_user" : None,
            "user_id" : None,
            "username" : None
        }
        std_del_list.append(std_dict)
    
    for i, added_deliverables in enumerate(payload.added_deliverables):
        add_dict = {
            "label" : added_deliverables,
            "task_number" : i,
            "completed" : False,
            "completed_at" : None,
            "updated_user" : None,
            "user_id" : None,
            "username" : None
        }
        added_del_list.append(add_dict)

    project_token = str(uuid1())


    document = {
        "project_id": payload.project_id,
        "project_token" : project_token,
        "project_comments" : "",
        "project_info": {
            "pi_name": payload.pi_name,
            "email": payload.email,
            "phone" : payload.phone,
            "institution": payload.institution,
            "lab_dept": payload.labdept,
        },
        "service_info": {
            "offering_type": payload.offering_type,
            "service_name": payload.service_name,
            "platform": payload.platform,
            "sample_type": payload.sample_type,
            "sample_number": payload.sam_number,
            "replicates_present": payload.duplicates,
            "extraction_needed": payload.extraction,
        },
        "project_details": {
            "standard_deliverables": std_del_list ,
            "added_deliverables": added_del_list,
        },
        "project_status": {
            "project_info": True,
            "service_info": True,
            "project_details": True,
            "sample_submission": False,
            "method": False,
            "qc": False,
            "library": False,
            "bioinformatics": False
        },
        "audit": {
            "created_at": datetime.now(),
            "created_user" : usertok["name"],
            "user_id" : usertok["user_id"],
            "username" : usertok["username"],
            "role" : usertok["role"]
        }
    }

    try:
        collection.insert_one(document)

        env = Environment(loader= FileSystemLoader("./templates"))
        template = env.get_template("project_initialization.html")

        html_cont = template.render(

            project_id = payload.project_id,
            project_token = project_token,
            pi_name = payload.pi_name,

            offering_type =  payload.offering_type,
            service_name =  payload.service_name,
            platform = payload.platform,
            sample_type = payload.sample_type,
            sam_number = payload.sam_number, 
            duplicates = payload.duplicates, 
            extraction = payload.extraction,  

            standard_deliverables = payload.standard_deliverables,
            added_deliverables = payload.added_deliverables,
        ) 

        email_status = await email_config(subject= "Project Created Successfully",
                                    to_mail= [payload.email],
                                    cc_mail= [usertok["username"], "cues@theracues.com", "analysis@theracues.com", "projectmgt@theracues.com"],
                                    mail_html= html_cont)

        return {
            "status" : True,
            "message": f"Project added and {email_status}"
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500,
            detail="Project submission failed"
        )
    

@router.post("/genprojectid")
async def gen_projectid(_ : dict = Depends(parse_token)):

    collection = collections_load("tcProjects")

    try:
        latest_proj = collection.find_one({},
                                          {
                                              "_id": 0,
                                              "project_id": 1,
                                              "audit.created_at": 1
                                          },
                                          sort=[("audit.created_at", -1)])

        
        if not latest_proj or "project_id" not in latest_proj:
            next_projid = "TCP_2627_01"
        else:
            last_proj = latest_proj["project_id"]
            proj_number = int(last_proj.replace("TCP_2627_", ""))
            next_projid = f"TCP_2627_0{proj_number+1}"

        return{
            "status" : True,
            "message" : "Generated project_id",
            "payload" : {
                "project_id" : next_projid
            }
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Unable to generate project id"
        )
    pass


@router.post("/samsubresend")
async def resend_submission(payload : ProjId, usertok : dict = Depends(parse_token)):

    project_id = payload.project_id
    collection = collections_load("tcProjects")

    try:

        data = collection.find_one({"project_id" : payload.project_id},
                                   {
                                       "_id" : 0,
                                       "project_token" : 1,
                                       "project_info.pi_name" : 1,
                                       "project_info.email" : 1

                                   })

        env = Environment(loader= FileSystemLoader("./templates"))
        template = env.get_template("samplesubresend.html")

        html_cont = template.render(
            project_id = project_id,
            project_token = data.get("project_token"),
            pi_name = data.get("project_info", {}).get("pi_name"),
        ) 

        email_status = await email_config(subject= "Sample Submission Form",
                                    to_mail= [data.get("project_info", {}).get("email")],
                                    cc_mail= [usertok["username"],"projectmgt@theracues.com", "analysis@theracues.com"],
                                    mail_html= html_cont)

        return {
            "status" : True,
            "message": email_status
        }



    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Unable to resend sample submission details"
        )