from pymongo import MongoClient
from fastapi import HTTPException
from weasyprint import HTML
from jinja2 import Environment, FileSystemLoader
from datetime import date
from pypdf import PdfWriter, PdfReader
from io import BytesIO


def collections_load(collection: str):
    try:
        CLIENT = MongoClient("mongodb://localhost:27017")

        db = CLIENT.tcDB
        
        
        collection_obj = db[collection]
        
        return collection_obj
    
    except Exception as e:
        print(f"Database connection error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Database connection failed: {str(e)}"
        )
    

def qc_temp_bytes(project_id : str):

    collections = collections_load("tcProjects")

    data = collections.find_one({"project_id" : project_id },
                            {
                                "_id" : 0,
                                "project_info" : 1,
                                "service_info" : 1,
                                "qc" : 1,
                                "sample_submission.service_technology" : 1,
                                "sample_submission.details.application" : 1
                            })

    project_info = data.get("project_info", {})
    service_info= data.get("service_info", {})
    qc_info  = data.get("qc", {})


    name = project_info.get("pi_name")
    institution = project_info.get("institution")
    lab_dept = project_info.get("lab_dept")
    report_date = date.today().strftime("%B %d, %Y")

    service_name = service_info.get("service_name")
    sample_type = service_info.get("sample_type")
    application = data.get("sample_submission").get("details").get("application")
    platform_conc = qc_info.get("concentration_technology")
    platform_int = qc_info.get("integrity_technology")
    extraction_needed = service_info.get("extraction_needed")
    sample_number = service_info.get("sample_number")
    qc_summary = qc_info.get("qc_summary")
    qc_same_details = qc_info.get("qc_sample_details",[])

    env = Environment(loader=FileSystemLoader('./templates'))
    template = env.get_template('qctemplate.html')

    html_content = template.render(
        project_id=project_id,
        name = name,
        institution = institution,
        lab_dept = lab_dept,
        date = report_date,
        service_name = service_name,
        sample_type = sample_type,
        application = application,
        platform_conc = platform_conc,
        platform_int = platform_int,
        extraction_needed = extraction_needed,
        sample_number = sample_number,
        qc_same_details = qc_same_details,
        qc_summary = qc_summary
    )

    inbytes = HTML(string=html_content).write_pdf()

    return inbytes


def lib_qc_bytes(project_id : str):

    collections = collections_load("tcProjects")

    data = collections.find_one({"project_id" : project_id},
                                {
                                    "_id" : 0,
                                    "project_info" : 1,
                                    "service_info" : 1,
                                    "qc" : 1,
                                    "library" : 1,
                                    "sample_submission.service_technology" : 1,
                                    "sample_submission.details.application" : 1
                                })
    
    project_info = data.get("project_info", {})
    service_info= data.get("service_info", {})
    qc_info = data.get("qc", {})
    libqc_info  = data.get("library", {})

    name = project_info.get("pi_name")
    institution = project_info.get("institution")
    lab_dept = project_info.get("lab_dept")
    report_date = date.today().strftime("%B %d, %Y")

    service_name = service_info.get("service_name")
    sample_type = service_info.get("sample_type")
    application = data.get("sample_submission").get("details").get("application")
    platform_conc = qc_info.get("concentration_technology")
    platform_int = qc_info.get("integrity_technology")
    extraction_needed = service_info.get("extraction_needed")
    sample_number = service_info.get("sample_number")
    libqc_summary = libqc_info.get("library_summary")
    libqc_same_details = libqc_info.get("qc_sample_details",[])

    evv = Environment(loader= FileSystemLoader("./templates"))
    template = evv.get_template("librqctemplate.html")

    html_content = template.render(
        project_id=project_id,
        name = name,
        institution = institution,
        lab_dept = lab_dept,
        date = report_date,
        service_name = service_name,
        sample_type = sample_type,
        application = application,
        platform_conc = platform_conc,
        platform_int = platform_int,
        extraction_needed = extraction_needed,
        sample_number = sample_number,
        qc_same_details = libqc_same_details,
        qc_summary = libqc_summary     
    )

    inbytes = HTML(string=html_content).write_pdf()

    return inbytes


def fin_report_collate(project_id :  str):

    collection = collections_load("tcProjects")

    data = collection.find_one({"project_id" : project_id},
                               {
                                   "_id" : 0,
                                   "bioinformatics.bioinformatics_report" : 1
                               })
    
    analysis_report_path = data.get("bioinformatics", {}).get("bioinformatics_report")

    try:

        with open("./templates/report_front_page.pdf", "rb") as f:
            first_page_bytes = f.read()

        try:
            with open (analysis_report_path, "rb") as f:
                analysis_report = f.read()
        except: analysis_report = None

        try : qc_report = qc_temp_bytes(project_id= project_id)
        except: qc_report = None

        try: libqc_report = lib_qc_bytes(project_id = project_id)
        except: libqc_report = None

        final_report = [first_page_bytes, qc_report, libqc_report, analysis_report]

        A4_WIDTH = 595 
        A4_HEIGHT = 842 

        writer = PdfWriter()

        for pdf_bytes in final_report:
            if not pdf_bytes:
                continue

            reader = PdfReader(BytesIO(pdf_bytes))

            for page in reader.pages:

                new_page = writer.add_blank_page(width=A4_WIDTH, height=A4_HEIGHT)
                or_width = float(page.mediabox.width)
                or_height = float(page.mediabox.height)
                x_scale = A4_WIDTH / or_width
                y_scale = A4_HEIGHT / or_height
                scale = min(x_scale, y_scale)

                page.scale_by(scale)

                x_off = (A4_WIDTH - (or_width * scale)) / 2
                y_off = (A4_HEIGHT - (or_height * scale)) / 2

                new_page.merge_translated_page(page, x_off, y_off)

        output = BytesIO()
        writer.write(output)

        return output.getvalue()


    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500,
            detail= "Merging failed"
        )

    

    
