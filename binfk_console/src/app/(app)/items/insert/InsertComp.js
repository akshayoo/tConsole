"use client"
import styles from './Insert.module.css'
import { useState } from 'react';
import axiosApi from '@/lib/api';
import { toastSet } from '@/components/toastfunc';
import { MessageComp } from '@/components/messageComp';

export function InsertComp() {

    const [formData, setFormData] = useState({
        category : "",
        service_name : "",
        catalog_number : "",
        application : "",
        platform : "",
        sam_types : "",
        standard_deliverables : ""
    })

    const [toast, setToast] = useState(null)

    const [disbutton, setDisButton] = useState(false)

    async function submitItems(){

        if(!formData.category || !formData.service_name || !formData.catalog_number || !formData.platform
            || !formData.application || !formData.sam_types || !formData.standard_deliverables){
                toastSet(setToast, false, "Missing Fields")
                return
        }

        setDisButton(true)

        try {

            const response = await axiosApi.post("/items/insert",
                formData
            )

            const data = response.data

            toastSet(setToast, data.status, data.message)

            setTimeout(() =>   setFormData({
                category : "",
                service_name: "",
                catalog_number: "",
                application: "",
                platform : "",
                sam_types: "",
                standard_deliverables: ""
            }), 2000)

            setDisButton(false)

        }
        catch(err) {
            console.log(err)
            toastSet(setToast, false, "Error uploading custom services")
            setDisButton(false)
        }
    }

    const handleChange = (e) => {

        const {name, value} = e.target

        setFormData(prev => ({
            ...prev, [name] : value
        }))
    }


    return (
       <div className={styles.ProgCompDiv}>
            <div className={styles.projDetSide}>
                <h2>Add Custom Service Items</h2>
                <p>You are about to create a Service Catalog. Please keep the following in mind before you continue.</p>
                <ul>
                    <li>All fields in this form may be <strong>mandatory</strong>.</li>
                    <li>Ensure the Service name, Catalog ID and Standard deliverables are clear.</li>
                    <li>Verify all details carefully.</li>
                    <li>Incorrect info may affect the depended processes.</li>
                    <li>Need admin privilages to add to service categories except Custom Services</li>
                </ul>
            </div>
        
            <div className={styles.MainFormPage}>
                <div className={styles.FormBox}>
                    <div className={styles.ForminBox}>

                        <div className={styles.InputcompDiv}>
                            <label>Service category</label>
                            <select value={formData.category} name="category" onChange={handleChange}>
                                <option value="">--select--</option>
                                <option value="Bulk Transcriptomics">Bulk Transcriptomics</option>
                                <option value="Metagenomics & Applied Genomics">Metagenomics & Applied Genomics</option>
                                <option value="Human Genetic Analysis">Human Genetic Analysis</option>
                                <option value="Applied">Applied</option>
                                <option value="Targeted pathway interrogation (RUO)">Targeted pathway interrogation (RUO)</option>
                                <option value="Human tumour biology">Human tumour biology</option>
                                <option value="Custom services">Custom Services</option>
                            </select>
                        </div>
                        
                        <div className={styles.InputcompDiv}>
                            <label>Service Name</label>
                            <input name="service_name" type="text" onChange={handleChange} />
                        </div>
                        
                        <div className={styles.InputcompDiv}>
                            <label>Catalog Number</label>
                            <input name="catalog_number" type="text" onChange={handleChange} />
                        </div>
                    </div>

                    <div className={styles.ForminBox}>

                        <div className={styles.InputcompDiv}>
                            <label>Application</label>
                            <textarea name="application" type="text" rows={6} onChange={handleChange} />
                        </div>

                        <div className={styles.InputcompDiv}>
                            <label>Platform</label>
                            <select name="platform" onChange={handleChange}>
                                <option value="">--select--</option>
                                <option value="Illumina">Illumina</option>
                                <option value="Oxford Nanopore Technologies (ONT)">Oxford Nanopore Technologies (ONT)</option>
                                <option value="Illumina/Oxford Nanopore Technologies (ONT)">Illumina/Oxford Nanopore Technologies (ONT)</option>
                                <option value="Bruker NanoString nCounter Sprint Profiler">Bruker NanoString nCounter Sprint Profiler</option>
                                <option value="GeoMx Digital Spatial Profiler">GeoMx Digital Spatial Profiler</option>
                                <option value="MGI DNBSEQ">MGI DNBSEQ</option>
                                <option value="10X Genomics">10X Genomics</option>
                            </select>
                        </div>

                        <div className={styles.InputcompDiv}>
                            <label>Accepted sample types</label>
                            <textarea placeholder='Separate each with a comma' name="sam_types" type="text" rows={6} onChange={handleChange} />
                        </div>
                    
                    </div>

                    <div className={styles.ForminBox}>
                        <div className={styles.InputcompDiv}>
                            <label>Standard Deliverables</label>
                            <textarea placeholder='Separate each standard deliverables with a comma' 
                            name="standard_deliverables" type="text" rows={12} onChange={handleChange} />
                        </div>
                    </div>

                    <SubmitBtn submitItems={submitItems} disButton={disbutton} />

                </div>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
       </div>
    );
}

function SubmitBtn({submitItems, disButton}){
    return(
        <div className={styles.SendAppButton}>
            <button onClick={submitItems} disabled={disButton} >
                {disButton ? <>Processing</> : <>UPDATE</>}
            </button>
        </div>
    );
}