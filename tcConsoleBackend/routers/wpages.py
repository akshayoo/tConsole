from fastapi import APIRouter, HTTPException, Form
from utils.confgmail import email_config
from utils.dbfunc import collections_load_web
from jinja2 import Environment, FileSystemLoader
import tempfile
import os

router = APIRouter(prefix="/webpages")

@router.post("/brochure")
async def brochure_dwnld(
    fullname: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    service: str = Form(...)
):

    collection = collections_load_web("tcBrochures")

    tmpb_file_path = None 

    try:

        brochure = service.strip()

        doc = {
            "fullname" : fullname,
            "email" : email,
            "phone" : phone,
            "brochure" : service
        }

        collection.insert_one(doc)

        with open(f'./web/brochures/{brochure}.pdf', "rb") as f:
            send_brochure = f.read()

            env = Environment(loader=FileSystemLoader("./templates"), autoescape=True)
            template = env.get_template("reportsmailtemplate.html")

            subject = "theraCUES Brochures"

            header = f"{brochure} Brochure"

            content ="""
                Thank you for your interest. Please find the attached brochure for your reference.
                Feel free to reach out if you need any additional information.
            """

            mail_html = template.render(
                header=header,
                mail_body=content
            )

            with tempfile.NamedTemporaryFile(mode="wb", delete=False, suffix=".pdf") as tmp:
                tmp.write(send_brochure)
                tmpb_file_path = tmp.name

            status = await email_config(
                subject=subject,
                cc_mail=['cues@theracues.com'],
                to_mail=[email],
                mail_html=mail_html,
                attachments=[{
                    "file": tmpb_file_path,
                    "filename": f'./web/brochures/{brochure}.pdf'
                }]
            )

            return{
                "status" : True,
                "message" : "You will recieve the documents shortly"
            }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500,
            detail="Not able process the request"
        )

    finally:
        if tmpb_file_path:
            os.unlink(tmpb_file_path)
        else: pass