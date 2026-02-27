import { useState, useEffect } from 'react'
import axiosApi from '@/lib/api';
import styles from '../ViewComp.module.css'
import { toastSet } from '@/components/toastfunc';
import { MessageComp } from '@/components/messageComp';

export function QcReportPushForm({setQcDataForm, projectId}){

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

    async function updateQcData(){
        if(!formData.method_writeup || !formData.method_summary || !formData.concentration_technology ||  
            !formData.integrity_technology || !formData.qc_summary || !formData.qc_report || !formData.qc_data)

            {
                toastSet(setToast, false, "All entries are mandatory, Please fill the missing fields")
                return
            }

        try {

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
    }

    const handleChange = (e) => {

        const{name, value} = e.target
        setFormData(prev => ({
            ...prev, [name] : value
        }))
    }

    const handleFileChange = (e) => {
        const{name, files} = e.target
        setFormData(prev => ({
            ...prev, [name] : files[0]
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
                                <option value="Quibit">Qubit</option>
                                <option value="NanoDrop">NanoDrop</option>
                            </select>
                        </div>
                        <div className={styles.formElemel}>
                            <label>Integrity assessed by</label>
                            <select name="integrity_technology" onChange={handleChange}>
                                <option value="">Select</option>
                                <option value="TapeStation">TapeStation</option>
                                <option value="BioAnalyzer">BioAnalyzer</option>
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
                    <button onClick={updateQcData}>Submit</button>
                </div>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
            </div>
        </div>
    )
}





export function LibQcReportPushForm({setLibQcDataForm, projectId}){

    const [formData, setFormData] = useState({
        "project_id" : projectId,
        "library_method" : "",
        "library_summary" : "",
        "library_report" : null,
        "library_data" : null
    })

    const [toast, setToast] = useState(null)


    async function updateLibQcData() {
        
        if (!formData.library_method || !formData.library_summary || !formData.library_report
            || !formData.library_data)
            {
                toastSet(setToast, false, "All entries are mandatory, Please fill the missing fields")
                return
            }

        try {

            const formd = new FormData()

            Object.entries(formData).forEach(([key, value]) => {
                formd.append(key, value)
            })
            
            const response = await axiosApi.post("/project/libqcdataupdate",
                formd
            )

            const data = response.data

            if(!data.status){
                toastSet(setToast, false, data.message)
                return
            }

            toastSet(setToast, true, data.message)
            setTimeout(() => setLibQcDataForm(false), 2000)
        }
        catch(error){
            console.log(error)
            toastSet(setToast, false, "Library QC report can't be updated")
        }
        
    }

    const handleChange = (e) => {

        const{name, value} = e.target
        setFormData(prev => ({
            ...prev, [name] : value
        }))
    }

    const handleFileChange = (e) => {
        const {name, files} = e.target
        setFormData(prev => ({
            ...prev, [name] : files[0]
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
                        <button onClick={updateLibQcData}>Submit</button>
                    </div>  
                </div>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
        </div>
    )
}





export function BinfReportPushForm({setBinfDataForm, projectId}){

    const [toast, setToast] = useState(null)

    const [formData, setFormData] = useState({
        "project_id" : projectId,
        "bioinformatics_summary" : "",
        "estimated_hours" : "",
        "approximate_hours" : "",
        "bioinformatics_report" : null
    })

    async function updateBinfData() {

        if(!formData.bioinformatics_summary || !formData.estimated_hours || !formData.approximate_hours || !formData.bioinformatics_report)            
            {
                toastSet(setToast, false, "All entries are mandatory, Please fill the missing fields")
                return
            }
        try {
            const binff = new FormData()

            Object.entries(formData).forEach(([key, value]) =>{
                binff.append(key, value)
            })

            const response = await axiosApi.post("/project/binfkilldataupdate",
                binff
            )
            
            const data = response.data

            if(!data.status){
                toastSet(setToast, false, data.message)
                return
            }

            toastSet(setToast, true, data.message)
            setTimeout(() => setBinfDataForm(false), 2000)

        }
        catch(error){
            console.log(error)
            alert("Analysis report can't be updated")
        }
    }

    const handleChange = (e) => {
        const{name, value} = e.target
        setFormData(prev => ({
            ...prev, [name] : value
        }))
    }

    const handleFileChange = (e) => {
        const{name, files} = e.target
        setFormData(prev => ({
            ...prev, [name] : files[0]
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
                    <button onClick={updateBinfData} >Submit</button>
                </div>  
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
            </div>
        </div>
    )
}


export function ProjectCommentsForm({projectId, setProjectComments}){

    const [toast, setToast] = useState(null)

    const [formData, setFormData] = useState({
        "project_id" : projectId,
        "project_comments" : ""
    })

    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData(prev => ({
            ...prev, [name] : value
        }))
    }

    async function updateProjectComments() {
        if(!formData.project_comments){
            toastSet(setToast, false, "Missing fields")
            return
        }

        if(formData.project_comments.length > 500){
            toastSet(setToast, false, "Exceeded charecter limit make the comments short")
            return
        }

        try {
            const response = await axiosApi.post("/project/projcommupdate",
                formData
            )
            
            const data = response.data

            toastSet(setToast, data.status, data.message)
            setTimeout(() => setProjectComments(false), 2000)

        }
        catch(err){
            console.log(err)
            toastSet(setToast, false, "Failed to update comments")
        }
    }

    return(

        <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
                <div className={styles.modalHeader}>
                    <h3>Update a new project comment for {projectId}</h3>
                    <button onClick={() => setProjectComments(false)} >X</button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.formElem}>
                        <label>Update comment</label>
                        <textarea name="project_comments" placeholder='Maximum 500 charecters' rows='12' onChange={handleChange}/>
                    </div>
                    <div className={styles.formElem}>
                        <button onClick={updateProjectComments} >Submit</button>
                    </div>  
                </div>
                {toast && <MessageComp condition={toast.condition} message={toast.message} />}
            </div>
        </div>
    );
}