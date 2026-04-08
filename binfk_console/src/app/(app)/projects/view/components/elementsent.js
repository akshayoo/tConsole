import styles from '../ViewComp.module.css'
import axiosApi from '@/lib/api'
import { toastSet } from '@/components/toastfunc'
import { MessageComp } from '@/components/messageComp'
import { useState } from 'react'


export function EmailReports({projectId, sec, flow, EmailTemp}) {


    const [formData, setFormData] = useState({
        "project_id" : projectId,
        "section" : sec,
        "email_cc" : "",
        "mail_subject" : "",
        "mail_content" : ""
    })

    const [toast, setToast] = useState(null)

    const [buttonDis, setButtonDis] = useState(false)

    async function sendEmail() {
 
        if(!formData.mail_subject || !formData.mail_content){

            toastSet(setToast, false, "Missing Mail Subject or Content")
            return
        }

        setButtonDis(true)
        
        try{
            const response = await axiosApi.post('/reports/sendemail',
                formData
            )

            const data = response.data
            toastSet(setToast, data.status, data.message)

            setTimeout(() => EmailTemp(false), 2000)
        }
        catch(error){
            console.log(error)
            toastSet(setToast, false, "Error sending mail")
        }
    }

    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData(prev => ({
            ...prev, [name] : value
        }))
    }

    return(
        <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>

                <div className={styles.modalHeader}>
                    <h3>Send {flow} Report</h3>
                    <button onClick={() => EmailTemp(false)} >X</button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.GridTwo}>
                        <div className={styles.formElem}>
                            <label>Add CC</label>
                            <textarea onChange={handleChange} name="email_cc" rows ='2' placeholder="Separate mail Id's by a ','" />
                        </div>
                    </div>
                    <div className={styles.formElemel}>
                        <label>Enter Subject</label>
                        <textarea onChange={handleChange} name="mail_subject" rows = '2' placeholder="Email Subject"/>
                    </div>
                    <div className={styles.formElemel}>
                        <label>Enter mail content</label>
                        <textarea onChange={handleChange} name="mail_content" rows = '8' placeholder="Email body"/>
                    </div>
                    <div className={styles.formElem}>
                        <button onClick={sendEmail} disabled={buttonDis}>
                            {buttonDis ? <>Processing</> : <>SEND</>}
                        </button>
                    </div>
                    {toast && <MessageComp condition={toast.condition} message={toast.message} />}
                </div>

            </div>
        </div>
    )
}



export function ProjectDetailsEdit({setQcDataForm, projectId}){

    const [formData, setFormData] = useState({
        "project_id" : projectId,
        "method_writeup" : "",
        "method_summary" : "",
        "concentration_technology" : "",
        "integrity_technology" : "",
        "qc_summary" : "",
        "qc_report" : null,
        "qc_data" : null
    })

    const[toast, setToast] = useState(null)
    
    const[disButton, setDisButton] = useState(false)

    async function updateQcData(){
        if(!formData.method_writeup || !formData.method_summary || !formData.concentration_technology ||  
            !formData.integrity_technology || !formData.qc_summary || !formData.qc_report || !formData.qc_data)

            {
                toastSet(setToast, false, "All entries are mandatory, Please fill the missing fields")
                return
            }


        try {

            setDisButton(true)

            const fd = new FormData();

            Object.entries(formData).forEach(([key,value])=>{
                fd.append(key, value);
            })

            const response = await axiosApi.post("/project/qcdataupdate", 
                fd
            )

            const data = response.data

            if(!data.status){
                toastSet(setToast, false, data.message)
                return
            }

            toastSet(setToast, true, data.message)
            setTimeout(() => setQcDataForm(false), 2000 ) 

        }
        catch (err){
            console.error(err);
            toastSet(setToast, false, "QC report can't be updated")
        }
        finally{
            setDisButton(false)
        }
    }

    const handleChange = (e) => {

        const{name, value} = e.target
        setFormData(prev => ({
            ...prev, [name] : value
        }))
    }


    return(
        <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>

            <div className={styles.modalHeader}>
                <h3>Edit Client details</h3>
                <button onClick={() => setQcDataForm(false)} >X</button>
            </div>

            <div className={styles.modalBody}>
                <div className={styles.GridTwo}>
                    <div className={styles.formElem}>
                        <label>PI Name</label>
                        <input name="pi_name" onChange={handleChange} />
                    </div>
                    <div className={styles.formElem}>
                        <label>Client Email</label>
                        <input name="email" onChange={handleChange} />
                    </div>
                </div>

                <div className={styles.GridTwo}>
                    <div className={styles.formElem}>
                        <label>Phone</label>
                        <input name="phone" onChange={handleChange} />
                    </div>
                    <div className={styles.formElem}>
                        <label>Organization/Institution</label>
                        <input name="organization" onChange={handleChange} />
                    </div>
                </div>

                <div className={styles.GridTwo}>
                    <div className={styles.formElem}>
                        <label>Lab/Department</label>
                        <textarea name="lab_dept" onChange={handleChange} />
                    </div>
                    <div className={styles.formElem}>
                        <label>Offering Type</label>
                        <textarea name="offering" onChange={handleChange} />
                    </div>
                </div>

                <div className={styles.formElem}>
                    <button onClick={updateQcData} disabled={disButton} >{disButton ? <>Processing...</> : <>Update details</>}</button>
                </div>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
            </div>
        </div>
    )
}


export function QcEdit({setQcDataForm, projectId}){

    const [formData, setFormData] = useState({
        "project_id" : projectId,
        "method_writeup" : "",
        "method_summary" : "",
        "concentration_technology" : "",
        "integrity_technology" : "",
        "qc_summary" : "",
        "qc_report" : null,
        "qc_data" : null
    })

    const[toast, setToast] = useState(null)
    
    const[disButton, setDisButton] = useState(false)

    async function updateQcData(){
        if(!formData.method_writeup || !formData.method_summary || !formData.concentration_technology ||  
            !formData.integrity_technology || !formData.qc_summary || !formData.qc_report || !formData.qc_data)

            {
                toastSet(setToast, false, "All entries are mandatory, Please fill the missing fields")
                return
            }


        try {

            setDisButton(true)

            const fd = new FormData();

            Object.entries(formData).forEach(([key,value])=>{
                fd.append(key, value);
            })

            const response = await axiosApi.post("/project/qcdataupdate", 
                fd
            )

            const data = response.data

            if(!data.status){
                toastSet(setToast, false, data.message)
                return
            }

            toastSet(setToast, true, data.message)
            setTimeout(() => setQcDataForm(false), 2000 ) 

        }
        catch (err){
            console.error(err);
            toastSet(setToast, false, "QC report can't be updated")
        }
        finally{
            setDisButton(false)
        }
    }

    const handleChange = (e) => {

        const{name, value} = e.target
        setFormData(prev => ({
            ...prev, [name] : value
        }))
    }


    return(
        <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>

            <div className={styles.modalHeader}>
                <h3>Upload QC and Method Data</h3>
                <button onClick={() => setQcDataForm(false)} >X</button>
            </div>

            <div className={styles.modalBody}>
                <div className={styles.GridTwo}>
                    <div className={styles.formElem}>
                        <label>Method Writeup</label>
                        <textarea name="method_writeup" rows='6' onChange={handleChange} />
                    </div>
                    <div className={styles.formElem}>
                        <label>Method Summary</label>
                        <textarea name="method_summary" rows ='6' onChange={handleChange} />
                    </div>
                </div>

                <div className={styles.GridTwo}>
                    <div className={styles.formElem}>
                        <div className={styles.formElemel}>
                            <label>Concentration assessed by</label>
                            <select name="concentration_technology" onChange={handleChange}>
                                <option value="">Select</option>
                                <option value="Qubit">Qubit</option>
                                <option value="NanoDrop">NanoDrop</option>
                                <option value="NanoDrop">NanoDrop & Qubit</option>
                            </select>
                        </div>
                        <div className={styles.formElemel}>
                            <label>Integrity assessed by</label>
                            <select name="integrity_technology" onChange={handleChange}>
                                <option value="">Select</option>
                                <option value="TapeStation">TapeStation</option>
                                <option value="BioAnalyzer">BioAnalyzer</option>
                                <option value="BioAnalyzer">Agarose Gel</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.formElem}>
                        <label>QC Summary</label>
                        <textarea name="qc_summary" rows='6' onChange={handleChange} />
                    </div>
                </div>
                <div className={styles.GridTwo}>
                    <div className={styles.formElem}>
                        <label>{`Upload QC Report(.pdf)`}</label>
                        <input name="qc_report" type='file' accept='.pdf' onChange={handleFileChange}/>
                    </div>
                    <div className={styles.formElem}>
                        <label>{`Upload QC data(.csv)`}</label>
                        <input name="qc_data" type='file' accept='.csv' onChange={handleFileChange}/>
                    </div>
                </div>
                <div className={styles.formElem}>
                    <button onClick={updateQcData} disabled={disButton} >{disButton ? <>Processing...</> : <>Submit</>}</button>
                </div>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
            </div>
        </div>
    )
}


export function LibQcEdit({setQcDataForm, projectId}){

    const [formData, setFormData] = useState({
        "project_id" : projectId,
        "method_writeup" : "",
        "method_summary" : "",
        "concentration_technology" : "",
        "integrity_technology" : "",
        "qc_summary" : "",
        "qc_report" : null,
        "qc_data" : null
    })

    const[toast, setToast] = useState(null)
    
    const[disButton, setDisButton] = useState(false)

    async function updateQcData(){
        if(!formData.method_writeup || !formData.method_summary || !formData.concentration_technology ||  
            !formData.integrity_technology || !formData.qc_summary || !formData.qc_report || !formData.qc_data)

            {
                toastSet(setToast, false, "All entries are mandatory, Please fill the missing fields")
                return
            }


        try {

            setDisButton(true)

            const fd = new FormData();

            Object.entries(formData).forEach(([key,value])=>{
                fd.append(key, value);
            })

            const response = await axiosApi.post("/project/qcdataupdate", 
                fd
            )

            const data = response.data

            if(!data.status){
                toastSet(setToast, false, data.message)
                return
            }

            toastSet(setToast, true, data.message)
            setTimeout(() => setQcDataForm(false), 2000 ) 

        }
        catch (err){
            console.error(err);
            toastSet(setToast, false, "QC report can't be updated")
        }
        finally{
            setDisButton(false)
        }
    }

    const handleChange = (e) => {

        const{name, value} = e.target
        setFormData(prev => ({
            ...prev, [name] : value
        }))
    }


    return(
        <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>

                <div className={styles.modalHeader}>
                    <h3>Upload QC and Method Data</h3>
                    <button onClick={() => setLibQcDataForm(false)} >X</button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.GridTwo}>
                        <div className={styles.formElem}>
                            <label>Lib Method</label>
                            <input name="library_method" onChange={handleChange}/>
                        </div>
                        <div className={styles.formElem}>
                            <label>Library Summary</label>
                            <textarea name="library_summary" rows ='6' onChange={handleChange} />
                        </div>
                    </div>
                    <div className={styles.GridTwo}>
                        <div className={styles.formElem}>
                            <label>{`Upload Lib Report(.pdf)`}</label>
                            <input name="library_report" type='file' accept='.pdf' onChange={handleFileChange} />
                        </div>
                        <div className={styles.formElem}>
                            <label>{`Upload Lib QC data(.csv)`}</label>
                            <input name="library_data" type='file' accept='.csv' onChange={handleFileChange} />
                        </div>
                    </div>    
                    <div className={styles.formElem}>
                        <button onClick={updateLibQcData} disabled={disButton} >{disButton ? <>Processing...</> : <>Submit</>}</button>
                    </div>  
                </div>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
        </div>
    )
}


export function AnalysisEdit({setQcDataForm, projectId}){

    const [formData, setFormData] = useState({
        "project_id" : projectId,
        "method_writeup" : "",
        "method_summary" : "",
        "concentration_technology" : "",
        "integrity_technology" : "",
        "qc_summary" : "",
        "qc_report" : null,
        "qc_data" : null
    })

    const[toast, setToast] = useState(null)
    
    const[disButton, setDisButton] = useState(false)

    async function updateQcData(){
        if(!formData.method_writeup || !formData.method_summary || !formData.concentration_technology ||  
            !formData.integrity_technology || !formData.qc_summary || !formData.qc_report || !formData.qc_data)

            {
                toastSet(setToast, false, "All entries are mandatory, Please fill the missing fields")
                return
            }


        try {

            setDisButton(true)

            const fd = new FormData();

            Object.entries(formData).forEach(([key,value])=>{
                fd.append(key, value);
            })

            const response = await axiosApi.post("/project/qcdataupdate", 
                fd
            )

            const data = response.data

            if(!data.status){
                toastSet(setToast, false, data.message)
                return
            }

            toastSet(setToast, true, data.message)
            setTimeout(() => setQcDataForm(false), 2000 ) 

        }
        catch (err){
            console.error(err);
            toastSet(setToast, false, "QC report can't be updated")
        }
        finally{
            setDisButton(false)
        }
    }

    const handleChange = (e) => {

        const{name, value} = e.target
        setFormData(prev => ({
            ...prev, [name] : value
        }))
    }


    return(
        <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>

            <div className={styles.modalHeader}>
                <h3>Upload Analysis Data</h3>
                <button onClick={() => setBinfDataForm(false)} >X</button>
            </div>

            <div className={styles.modalBody}>
                <div className={styles.GridTwo}>
                    <div className={styles.formElem}>
                        <label>Analysis Summary</label>
                        <textarea name="bioinformatics_summary" rows='6' onChange={handleChange}/>
                    </div>
                </div>
                <div className={styles.GridTwo}>
                    <div className={styles.formElem}>
                        <label>Expected hours spend for the analysis</label>
                        <input type='number' name= "estimated_hours" onChange={handleChange} />
                    </div>
                    <div className={styles.formElem}>
                        <label>Approximate hours spend for the analysis</label>
                        <input type='number' name="approximate_hours" onChange={handleChange} />
                    </div>
                </div>
                <div className={styles.formElem}>
                    <label>{`Upload Final Analysis Report(.pdf)`}</label>
                    <input name="bioinformatics_report" type='file' accept='.pdf' onChange={handleFileChange}/>
                </div>
                <div className={styles.formElem}>
                    <button onClick={updateBinfData} disabled={disButton} >{disButton ? <>Processing...</> : <>Submit</>}</button>
                </div>  
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
            </div>
        </div>
    )
}


/*
export function SampleSubEdit({setQcDataForm, projectId}){

    const [formData, setFormData] = useState({
        "project_id" : projectId,
        "method_writeup" : "",
        "method_summary" : "",
        "concentration_technology" : "",
        "integrity_technology" : "",
        "qc_summary" : "",
        "qc_report" : null,
        "qc_data" : null
    })

    const[toast, setToast] = useState(null)
    
    const[disButton, setDisButton] = useState(false)

    async function updateQcData(){
        if(!formData.method_writeup || !formData.method_summary || !formData.concentration_technology ||  
            !formData.integrity_technology || !formData.qc_summary || !formData.qc_report || !formData.qc_data)

            {
                toastSet(setToast, false, "All entries are mandatory, Please fill the missing fields")
                return
            }


        try {

            setDisButton(true)

            const fd = new FormData();

            Object.entries(formData).forEach(([key,value])=>{
                fd.append(key, value);
            })

            const response = await axiosApi.post("/project/qcdataupdate", 
                fd
            )

            const data = response.data

            if(!data.status){
                toastSet(setToast, false, data.message)
                return
            }

            toastSet(setToast, true, data.message)
            setTimeout(() => setQcDataForm(false), 2000 ) 

        }
        catch (err){
            console.error(err);
            toastSet(setToast, false, "QC report can't be updated")
        }
        finally{
            setDisButton(false)
        }
    }

    const handleChange = (e) => {

        const{name, value} = e.target
        setFormData(prev => ({
            ...prev, [name] : value
        }))
    }


    return(
        <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>

            <div className={styles.modalHeader}>
                <h3>Edit Client details</h3>
                <button onClick={() => setQcDataForm(false)} >X</button>
            </div>

            <div className={styles.modalBody}>
                <div className={styles.GridTwo}>
                    <div className={styles.formElem}>
                        <label>PI Name</label>
                        <input name="pi_name" onChange={handleChange} />
                    </div>
                    <div className={styles.formElem}>
                        <label>Client Email</label>
                        <input name="email" onChange={handleChange} />
                    </div>
                </div>

                <div className={styles.GridTwo}>
                    <div className={styles.formElem}>
                        <label>Phone</label>
                        <input name="phone" onChange={handleChange} />
                    </div>
                    <div className={styles.formElem}>
                        <label>Organization/Institution</label>
                        <input name="organization" onChange={handleChange} />
                    </div>
                </div>

                <div className={styles.GridTwo}>
                    <div className={styles.formElem}>
                        <label>Lab/Department</label>
                        <textarea name="lab_dept" onChange={handleChange} />
                    </div>
                    <div className={styles.formElem}>
                        <label>Offering Type</label>
                        <textarea name="offering" onChange={handleChange} />
                    </div>
                </div>

                <div className={styles.formElem}>
                    <button onClick={updateQcData} disabled={disButton} >{disButton ? <>Processing...</> : <>Update details</>}</button>
                </div>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
            </div>
        </div>
    )
}*/