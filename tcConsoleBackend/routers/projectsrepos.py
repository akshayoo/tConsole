from fastapi import APIRouter, Response, HTTPException, Depends
from utils.confgmail import email_config
from utils.dbfunc import collections_load, qc_temp_bytes, lib_qc_bytes,  fin_report_collate
from schemas.schema import ProjId, EmailCont
from utils.jwt_utils import parse_token
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
import os
import tempfile


router = APIRouter(prefix= "/reports")



@router.post("/genqcreportpdf")
async def gen_qcreport(payload : ProjId, _ : dict = Depends(parse_token)):
    
    project_id = payload.project_id.strip()

    try: 
        qc_bytes = qc_temp_bytes(project_id= project_id)

        return Response(
            content=qc_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=qc_report_{project_id}.pdf"}
        )
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Unable to generate report"
        )
        



@router.post("/genlibqcreportpdf")
async def lib_qcgen(payload : ProjId, _ : dict = Depends(parse_token)):


    project_id = payload.project_id

    try:
        libqc_bytes = lib_qc_bytes(project_id= project_id)

        return Response(
            content= libqc_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=libqc_report_{project_id}.pdf"}
        )
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail="Unable to generate report"
        )
    

@router.post("/genfinreportpdf")
async def fin_report_gen(payload : ProjId, _ : dict = Depends(parse_token)):

    project_id = payload.project_id

    try: 

        collection = collections_load("tcProjects")

        data = collection.find_one({"project_id" : project_id},
                                {
                                    "_id" : 0,
                                    "bioinformatics.bioinformatics_report" : 1
                                })
        
        if not data.get("bioinformatics", {}).get("bioinformatics_report"):
            return{"status" : "No analysis report found"}
        
        final_report_bytes = fin_report_collate(project_id= project_id)

        return Response(
            content= final_report_bytes,
            media_type= "application/pdf",
            headers= {"Content-Disposition": f"attachment; filename=libqc_report_{project_id}.pdf"}
        )
    
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Failed merging reports"
        )



@router.post("/samplesubreportpdf")

async def samsub_gen(payload : ProjId, _ : dict = Depends(parse_token)):

    collections = collections_load("tcProjects")

    project_id = payload.project_id

    try:

        data = collections.find_one({"project_id" : project_id},
                                    {
                                        "_id" : 0,
                                        "project_info" : 1,
                                        "service_info" : 1,
                                        "sample_submission" : 1
                                    })
        
        project_info = data.get("project_info", {})
        service_info= data.get("service_info", {})
        ss_info = data.get("sample_submission", {})


        name = project_info.get("pi_name")
        institution = project_info.get("institution")
        lab_dept = project_info.get("lab_dept")
        email = project_info.get("email")
        phone = project_info.get("phone")

        service_name = service_info.get("service_name")
        sample_type = service_info.get("sample_type")
        application = data.get("sample_submission").get("details").get("application")
        sample_number = service_info.get("sample_number")
        extraction_needed = service_info.get("extraction_needed")
        replicates = "YES" if ss_info.get("replicates") == True else "NO"
        bin_req  = "YES" if ss_info.get("bioinformatics_required") == True else "NO"


        sample_sub_details = ss_info.get("details").get("sample_details", [])

        env = Environment(loader= FileSystemLoader("./templates"))
        template = env.get_template("samsubtemplate.html")

        html_content = template.render(
            project_id = project_id,
            name = name,
            institution = institution,
            lab_dept = lab_dept,
            email = email,
            phone = phone,

            service_name = service_name,
            sample_type = sample_type,
            application = application,
            sample_number = sample_number,
            extraction_needed = extraction_needed,
            replicates = replicates,
            bin_req = bin_req,

            sample_sub_details = sample_sub_details

        )

        samsub_bytes = HTML(string= html_content).write_pdf()

        return Response(
            content= samsub_bytes,
            media_type= "application/pdf",
            headers={"Content-Disposition": f"attachment; filename=libqc_report_{project_id}.pdf"}
        )
    
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Unable to fetch report"
        )




@router.post("/sendemail")
async def send_mail(payload: EmailCont, usertok : dict = Depends(parse_token)):
    
    project_id = payload.project_id
    section = payload.section.strip()
    subject = payload.mail_subject
    content = payload.mail_content
    
    temp_file_path = None

    try: 

        collections = collections_load("tcProjects")

        data = collections.find_one(
            {"project_id": project_id},
            {
                "_id": 0, 
                "project_info.email": 1,
                "bioinformatics.bioinformatics_report": 1
            }
        )
        
        
        to_email = data.get("project_info").get("email")
        
        to = [to_email]
        
        if payload.email_cc:
            cc_mails = [payload.email_cc]
        else:
            cc_mails = []

        if section == "analysis":

            if usertok["role"] == "bd" or usertok["role"] == "projects":
                return{
                    "status" : False,
                    "message" : "No permission"
                }
            
            try:

                header = "theraCUES Bioinformatics Report"
                filename = f"{project_id}_Analysis_Report.pdf"
                report_path = data["bioinformatics"]["bioinformatics_report"]

                if not os.path.exists(report_path):
                    return {"status": "Report not found"}

                with open(report_path, "rb") as f:
                    binf_report = f.read()

                env = Environment(loader=FileSystemLoader("./templates"), autoescape=True)
                template = env.get_template("reportsmailtemplate.html")

                mail_html = template.render(
                    header=header,
                    mail_body=content
                )

                with tempfile.NamedTemporaryFile(mode="wb", delete=False, suffix=".pdf") as tmp:
                    tmp.write(binf_report)
                    tmpb_file_path = tmp.name

                status = await email_config(
                    subject=subject,
                    cc_mail=cc_mails,
                    to_mail=to,
                    mail_html=mail_html,
                    attachments=[{
                        "file": tmpb_file_path,
                        "filename": filename
                    }]
                )

                return {
                    "status": True,
                    "message": status
                }

            except Exception as e:
                print(str(e))
                return {"status": False,
                        "message" : "Mail not sent: Contact admin"}
            
                
            finally:
                if tmpb_file_path and os.path.exists(tmpb_file_path):
                    try:
                        os.unlink(tmpb_file_path)
                    except Exception as e:
                        pass


        elif section == "finalreport":

            if usertok["role"] == "bd":
                return{
                    "status" : False,
                    "message" : "No permission"
                }
            
            try:

                header = "theraCUES Project Final Report"
                filename = f"{project_id}_Final_Report.pdf"

                final_report = fin_report_collate(project_id)

                env = Environment(loader=FileSystemLoader("./templates"), autoescape=True)
                template = env.get_template("reportsmailtemplate.html")

                mail_html = template.render(
                    header=header,
                    mail_body=content
                )

                with tempfile.NamedTemporaryFile(mode="wb", delete=False, suffix=".pdf") as tmp:
                    tmp.write(final_report)
                    tmp_finalrep_path = tmp.name

                status = await email_config(
                    subject=subject,
                    cc_mail=cc_mails,
                    to_mail=to,
                    mail_html=mail_html,
                    attachments=[{
                        "file": tmp_finalrep_path,
                        "filename": filename
                    }]
                )

                return {
                    "status": True,
                    "message": status
                }
            
            except Exception as e:
                print(str(e))
                return {"status": False,
                        "message" : "Mail not sent: Contact admin"}
            
                
            finally:
                if tmp_finalrep_path and os.path.exists(tmp_finalrep_path):
                    try:
                        os.unlink(tmp_finalrep_path)
                    except Exception as e:
                        pass


        elif section == "qc":

            if usertok["role"] == "bd" or usertok["role"] == "analysis":
                return{
                    "status" : False,
                    "message" : "No permission"
                }

            header = "theraCUES QC Report"
            filename = f"{project_id}_QC_Report.pdf"
            pdf_bytes = qc_temp_bytes(project_id=project_id)

            
        elif section == "library":

            if usertok["role"] == "bd" or usertok["role"] == "analysis":
                return{
                    "status" : False,
                    "message" : "No permission"
                }

            header = "theraCUES Library QC Report"
            filename = f"{project_id}_Library_QC_Report.pdf"
            pdf_bytes = lib_qc_bytes(project_id=project_id)

        env = Environment(loader=FileSystemLoader("./templates"), autoescape=True)
        template = env.get_template("reportsmailtemplate.html")

        mail_html = template.render(
            header=header,
            mail_body=content
        )
        
        with tempfile.NamedTemporaryFile(mode='wb', delete=False, suffix='.pdf') as temp_file:
            temp_file.write(pdf_bytes)
            temp_file_path = temp_file.name

        status = await email_config(
            subject= subject,
            cc_mail= cc_mails,
            to_mail= to,
            mail_html= mail_html,
            attachments= [{
                "file" : temp_file_path,
                "filename" : filename
            }]
        )
        
        return {
            "status": True,
            "message": status
        }
    
    except Exception as e:
        print(str(e))
        return {"status": False,
                "message" : "Mail not sent: Contact admin"}
    
    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.unlink(temp_file_path)
            except Exception as e:
                pass