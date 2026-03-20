from pydantic import BaseModel, EmailStr
from typing import List, Dict, Optional, Any

class ProjectSubmission(BaseModel):
    project_id: str
    pi_name: str
    email: EmailStr
    phone: str
    institution: str
    labdept: str
    offering_type: str
    service_name: str
    sam_number: int
    duplicates: str
    extraction: str
    sample_type: str
    platform: str
    standard_deliverables: List[str]
    added_deliverables: List[str]

class ProjId(BaseModel):
    project_id : str

class ProjToken(BaseModel):
    project_token : str

class ProjIdStatus(BaseModel):
    project_id : str
    project_status : str

class NgsForm(BaseModel):
    project_id: str
    technology: str
    application: str
    replicates: str
    extraction_needed: str

    dnase_treated: Optional[str] = None
    rna_kit_name: Optional[str] = None
    rna_assessment: Optional[str] = None

    rnase_treated: Optional[str] = None
    dna_kit_name: Optional[str] = None
    dna_assessment: Optional[str] = None

    bioinformatics_needed: str
    key_objectives: Optional[str] = None
    differential_comparisons: Optional[str] = None
    additional_analysis: Optional[str] = None
    reference_study: Optional[str] = None

    table: List[Dict[str, Any]]


class NcounterForm(BaseModel):
    project_id: str
    technology : str
    application: str
    replicates: str
    extraction_needed: str

    rna_prep: Optional[str] = None 
    rna_kit_name: Optional[str] = None
    dnase_treated: Optional[str] = None
    rna_assessment: Optional[str] = None


    bioinformatics_needed: str
    key_objectives: Optional[str] = None
    differential_comparisons: Optional[str] = None
    additional_analysis: Optional[str] = None
    reference_study: Optional[str] = None

    table: List[Dict[str, Any]]

class EmailCont(BaseModel):
    project_id : str
    section : str
    email_cc : Optional[str] = None
    mail_subject : str
    mail_content : str

class ProjComments(BaseModel):
    project_id : str
    project_comments : str


class TaskUpdate(BaseModel):
    project_id : str
    task : int
    sec : str

class TaskAdd(BaseModel):
    project_id : str
    project_task : str

class AuthLogin(BaseModel):
    username : str
    password : str

class AuthSignup(BaseModel):
    name : str
    username : str
    password : str
    password_re : str

class CustomServics(BaseModel):
    category : str
    service_name : str
    catalog_number : str
    application : str
    platform : str
    sam_types : str
    standard_deliverables : str

class ConversationPop(BaseModel):
    convo_id : str

class Inference(BaseModel):
    new_chat : bool 
    convo_id : Optional[str] = None
    user_message: str

class Email(BaseModel):
    email : EmailStr

class ValidateSignup(BaseModel):
    name : str
    username : EmailStr
    code : str


class GenCatNo(BaseModel):
    category : str
    service_name : str

class EditCheck(BaseModel):
    project_id : str
    meta : str