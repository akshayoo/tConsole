from fastapi import APIRouter, HTTPException, Depends
from utils.dbfunc import collections_load
from schemas.schema import ProjIdStatus, ProjId, TaskUpdate, ProjComments, TaskAdd
import os
from utils.jwt_utils import parse_token
from fastapi.responses import FileResponse
from urllib.parse import quote
from datetime import datetime 


router = APIRouter(prefix="/project")


@router.get("/projects")
async def projects_comp( _ : dict = Depends(parse_token)):

    try: 

        collections = collections_load("tcProjects")

        data = (collections.find({}, 
                                {"_id": 0,
                                "project_id" : 1,
                                "project_details.standard_deliverables.completed" : 1,
                                "project_details.added_deliverables.completed" : 1,
                                "project_status" : 1,
                                "audit.created_at" : 1
                                }).sort("audit.created_at" , -1))

        list_elements = []

        payload = []

        for doc in data:
            list_elements.append(doc)

        for i in range(len(list_elements)):
            project_id = list_elements[i].get("project_id", "")
            std_comp =  list_elements[i].get("project_details").get("standard_deliverables", [])
            add_comp = list_elements[i].get("project_details").get("added_deliverables", [])

            total_elem = len(std_comp) + len(add_comp)

            true_count = 0

            for std in std_comp:
                if std["completed"] is True:
                    true_count += 1

            for add in add_comp:
                if add["completed"] is True:
                    true_count += 1

            project_completion = round(true_count/total_elem *100)

            get_status =  list_elements[i].get("project_status")

            def get_project_status(flags: dict) -> str:

                if flags.get("closed"):
                    return "Closed"

                if flags.get("bioinformatics"):
                    return "Completed"

                if flags.get("library"):
                    return "Bioinformatics Stage"

                if flags.get("qc"):
                    return "Library Stage"

                if flags.get("method"):
                    return "In QC Stage"

                if flags.get("sample_submission"):
                    return "Accepted"

                return "Initiated"

            status = get_project_status(get_status)

            project = {
                "project_id" : project_id,
                "percent" : project_completion,
                "status" : status
            }

            payload.append(project)
        
        return{
            "status" : True,
            "message" : "Data fetched",
            "payload" : payload
        }
    
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Could not fetch projects"
        )
    



@router.get("/projectdash")
async def project_dashboard( _ : dict =  Depends(parse_token)):
    
    try:

        collection = collections_load("tcProjects")

        data = collection.find({},
                               {
                                   "_id" : 0,
                                   "project_status" : 1
                               })
        
        projects  = []

        for doc in data:
            projects.append(doc)
        
        total_projects = len(projects)

        closed = 0
        bioinformatics = 0
        library = 0
        qc = 0
        accepted = 0
        initiated = 0

        for project_stats in projects:
            stats = project_stats.get("project_status")

            if stats.get("closed"): closed += 1; continue
            if stats.get("bioinformatics"): bioinformatics += 1; continue
            if stats.get("library"): library += 1; continue
            if stats.get("qc") : qc += 1; continue
            if stats.get("sample_submission"): accepted += 1; continue
            if stats.get("service_info") : initiated += 1; continue

        print(closed)

        return{
            "status" : True,
            "message" : "Fetch successfull",
            "payload" : {
                "total" : total_projects,
                "closed" : closed,
                "bioinfo" : bioinformatics,
                "library" : library,
                "qc" : qc,
                "accepted" : accepted,
                "initiated" : initiated
            }
        }


    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Fetch failed"
        )




@router.post("/projectcomp")
async def projectcomp_pop(payload: ProjIdStatus, _ : dict = Depends(parse_token)):

    try:

        collections = collections_load("tcProjects")

        project_id = payload.project_id.strip()
        
        data = collections.find_one({"project_id" : project_id}, {"_id" : 0, "project_comments" : 1,
                                                "project_info.pi_name" : 1,
                                                "project_info.email" : 1,
                                                "project_info.phone": 1,
                                                "project_info.institution" : 1,
                                                "project_info.lab_dept" : 1,
                                                "service_info.offering_type" : 1,
                                                "service_info.platform" : 1,
                                                "project_details.standard_deliverables" : 1,
                                                "project_details.added_deliverables" : 1})
        
        if not data:
            return {
                "status": False,
                "message": "Project not found"
            }
        
        comments = data.get("project_comments", "")
        pi_name = data["project_info"]["pi_name"]
        email = data["project_info"]["email"]
        phone = data["project_info"]["phone"]
        institution = data["project_info"]["institution"]
        lab_dept =  data["project_info"]["lab_dept"]
        offering_type = data["service_info"]["offering_type"]
        platform = data["service_info"]["platform"]
        std_del = data["project_details"]["standard_deliverables"]
        add_del = data["project_details"]["added_deliverables"]

        return {
            "status" : True,
            "message" : "Data fetched",
            "payload" : {
                "project_id" : project_id,
                "project_comments" : comments,
                "project_status" : payload.project_status,
                "pi_name" : pi_name, 
                "email" : email, 
                "phone" : phone,
                "institution" : institution,
                "lab_dept" : lab_dept,
                "offering_type" : offering_type,
                "platform" : platform,
                "std_del" : std_del,
                "add_del" : add_del 
            }
        }
    
    except Exception as e:
        print(str(e))
        HTTPException(
            status_code=500,
            detail= "Failed to fetch project details"
        )






@router.post("/samsubdetails")
async def samsub_pop(payload : ProjId, _ : dict = Depends(parse_token)):

    collections = collections_load("tcProjects")

    project_id = payload.project_id.strip()

    try:

        data = collections.find_one({"project_id" : project_id},
                                    {
                                        "_id" : 0,
                                        "project_status.sample_submission": 1,
                                        "service_info.service_name" : 1,
                                        "service_info.sample_number" : 1,
                                        "sample_submission": 1
                                    })
        
        if data.get("project_status").get("sample_submission") == False:
            return {
                "status" : False,
                "message" : "No sample submission form found. Please contact the client"
            }
        
        def true_false(bool):
            if bool is True:
                return "Yes"
            elif bool is False:
                return "No"
            return bool
        
        def null_val(val):
            if val == "" or val == " " or val is None:
                return "No data available"
            return val
        
        service_info = data.get("service_info", {})
        sample_sub = data.get("sample_submission", {})
        details = sample_sub.get("details", {})

        return {
            "status": True,
            "message" : "Data fetched",
            "payload": {
                "service_name": service_info.get("service_name", "No data available"),
                "sample_number": service_info.get("sample_number", "No data available"),
                "service_technology": null_val(sample_sub.get("service_technology")),
                "application": null_val(details.get("application")),
                
                "replicates": true_false(details.get("replicates", "No data available")),
                "extraction_needed": true_false(details.get("extraction_needed", "No data available")),
                "total_rna_prep": null_val(details.get("total_rna_prep")),
                "nucleases": true_false(details.get("nucleases")),
                "kit_name": null_val(details.get("kit_name")),
                "qc_accessed": null_val(details.get("qc_accessed")),
                "bioinformatics_required": true_false(details.get("bioinformatics_required", "No data available")),
                "key_objectives": null_val(details.get("key_objectives")),
                "comparisons": null_val(details.get("comparisons")),
                "additional_analysis": null_val(details.get("additional_analysis")),
                "reference_studies": null_val(details.get("reference_studies")),
                "sample_details": details.get("sample_details", [])
            }
        }
    
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Sample submission details fetch failed"
        )



@router.post("/projcommupdate")
async def update_comments(payload :  ProjComments, _ : dict=Depends(parse_token)):

    collection = collections_load("tcProjects")

    try:

        project_id = payload.project_id.strip()

        collection.update_one({"project_id" : project_id},
                              {
                                  "$set" : {
                                      "project_comments" : payload.project_comments
                                  }
                              })

        return{
            "status" : True,
            "message" : "Comment updated",
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Comments update failed"
        )





@router.get("/reportspop")
async def reports_pop(fileandpath: str, _ : dict = Depends(parse_token)):

    current_dir = os.getcwd()

    file_path = os.path.join(current_dir, fileandpath)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Report not found")

    return FileResponse(
        path=file_path,
        media_type="application/pdf"
    )







@router.post("/qcsubdetails")
async def qc_sub_pop(payload : ProjId, _ : dict = Depends(parse_token)):
    
    collections = collections_load("tcProjects")
    project_id = payload.project_id

    try:

        data = collections.find_one({"project_id" : project_id},
                                    {
                                        "_id" : 0,
                                        "project_status.qc": 1,
                                        "method" : 1,
                                        "qc" : 1,
                                    })
        
        if not data:
            return{
                "status" : False,
                "message" : "No QC submission found. Please upload to view"
            }
        
        if data.get("project_status").get("qc") == False:
            return {
                "status" : False,
                "message" : "No QC submission found. Please upload to view"
            }
        
        method = data.get("method", {})
        qc = data.get("qc", {})

        qc_report_path = qc.get("qc_report")


        if qc_report_path:
            qc_report_url = f"/project/reportspop?fileandpath={quote(qc_report_path)}"
        else:
            qc_report_url = None

        return{
            "status" : True,
            "message" : "Data fetched",
            "payload" : {
                "writeup" : method.get("writeup", "No data available"),
                "method_summary" : method.get("method_summary", "No data available"),
                "concentration_technology" : qc.get("concentration_technology", "No data available"),
                "integrity_technology" : qc.get("integrity_technology", "No data available"),
                "qc_summary" : qc.get("qc_summary", "No data available"),
                "qc_report" : qc_report_url,
                "qc_sample_details" : qc.get("qc_sample_details")

            }
        }
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "QC details fetch failed"
        )





@router.post("/libqcsubdetails")
async def libqc_sub_pop(payload : ProjId, _ : dict = Depends(parse_token)):

    collections = collections_load("tcProjects")

    project_id = payload.project_id

    try:

        data = collections.find_one({"project_id" : project_id},
                                    {
                                        "_id" : 0,
                                        "project_status.library": 1,
                                        "library" : 1
                                    })
        
        if not data:
            return{
                "status" : False,
                "message" : "No Library QC submission found. Please upload one"
            }
        
        if not data.get("project_status", {}).get("library"):
            return{
                "status" : False,
                "message" : "No Library QC submission found. Please upload one"
            }
        
        library = data.get("library", {})

        library_report = library.get("library_report")

        if library_report:
            lib_report_url = f"/project/reportspop?fileandpath={quote(library_report)}"
        else:
            lib_report_url = None

        return{
            "status" : True,
            "message" : "Data fetched",
            "payload" : {
                "library_method" : library.get("library_method", "No data available"),
                "library_summary" : library.get("library_summary", "No data available"),
                "library_report" : lib_report_url,
                "qc_sample_details" : library.get("qc_sample_details", {}),

            }
        }
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Lib QC details fetch failed"
        )
    




@router.post("/binfsubdetails")
async def binf_sub_pop(payload : ProjId, _ : dict = Depends(parse_token)):

    collections = collections_load("tcProjects")

    project_id = payload.project_id

    try:

        data = collections.find_one({"project_id" : project_id},
                                {
                                    "_id" : 0,
                                    "project_status.bioinformatics": 1,
                                    "bioinformatics" : 1
                                })
        
        if not data:
            return{
                "status" : False,
                "message" : "No Analysis submissions found. Please upload one"
            }
        
        if data.get("project_status", {}).get("bioinformatics") == False:
            return{
                "status" : False,
                "message" : "No Analysis submissions found. Please upload one"
            }

        bioinformatics = data.get("bioinformatics", {})

        binf_report = bioinformatics.get("bioinformatics_report")

        if binf_report:
            binf_url = f"/project/reportspop?fileandpath={quote(binf_report)}"
        else:
            binf_url = None

        return{
            "status" :  True,
            "message" : "Data fetched",
            "payload" : {
                "bioinformatics_summary" : bioinformatics.get("bioinformatics_summary", "No data available"),
                "estimated_hours" : bioinformatics.get("estimated_hours", "No data available"),
                "approximate_hours" : bioinformatics.get("approximate_hours", "No data available"),
                "bioinformatics_report" : binf_url
            }
        }
    
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Unable to fetch analysis details"
        )
    





@router.post("/taskstatusupdate")
def task_update(payload : TaskUpdate, usertok : dict = Depends(parse_token)):

    if usertok["role"] == "bd": 
        return{
            "status" : False,
            "message" : "No permission"
        }

    collection = collections_load("tcProjects")

    project_id = payload.project_id
    task_num = payload.task
    sec  = payload.sec.strip()

    try:

        del_sec = "standard_deliverables" if sec == "std" else "added_deliverables"
            
        collection.update_one({"project_id" : project_id},
                            {
                                "$set" : {
                                    f"project_details.{del_sec}.$[elem].completed" : True,
                                    f"project_details.{del_sec}.$[elem].completed_at" : datetime.now(),
                                    f"project_details.{del_sec}.$[elem].updated_user" : usertok["name"],
                                    f"project_details.{del_sec}.$[elem].user_id" : usertok["user_id"],
                                    f"project_details.{del_sec}.$[elem].user_name" : usertok["username"]
                                },
                                
                            }, array_filters=[{"elem.task_number": task_num}])
        
        return{
            "status" : True,
            "message" : "Task completion updated"
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Failed to update task"
        )
    

@router.post("/taskdelete")
async def delete_task(payload:TaskUpdate, usertok :  dict = Depends(parse_token)):

    if usertok["role"] == "admin":
        pass
    else: 
        return{
            "status" : False,
            "message" : "No permission"
        }
    
    collection = collections_load("tcProjects")

    project_id = payload.project_id
    task_num = payload.task
    sec  = payload.sec.strip().lower()

    try:

        del_sec = "standard_deliverables" if sec == "std" else "added_deliverables"

        task = collection.update_one({"project_id" : project_id},
                              {
                                  "$pull" : {
                                      f"project_details.{del_sec}": {
                                          "task_number": task_num
                                          }
                                  }
                              })
        if task.modified_count == 0:
            return {"status": False, "message": "Task not found"}

        return{
            "status" : True,
            "message" : "Task deleted"
        }
    
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Failed to delete task"
        )
    

@router.post("/addtask")
async def add_task(payload : TaskAdd, usertok: dict = Depends(parse_token)):
    try:
        pass
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Failed to add the task"
        )
    
