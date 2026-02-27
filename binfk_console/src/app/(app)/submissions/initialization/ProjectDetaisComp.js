"use client"
import styles from './ProjectDetails.module.css'
import { useState, useEffect } from 'react';
import axiosApi from '@/lib/api';
import { toastSet } from '@/components/toastfunc';
import { MessageComp } from '@/components/messageComp';


export function ProjectDetailsComp() {
    
    const [servicesClass, setServicesClass] = useState({})
    const [classServices, setClassServices] = useState([])
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedServ, setSelectedServ] = useState("");
    const [selectedServProps, setSelectedServProps] = useState(null);
    const [projectDesc, setProjectDesc] = useState("");
    
    const [formData, setFormData] = useState({
        project_id: "",
        pi_name: "",
        email: "",
        phone: "",
        institution: "",
        labdept: "",
        offering_type: "",
        service_name: "",
        sam_number: "",
        duplicates: "",
        extraction: "",
        sample_type: "",
        platform: "",
        standard_deliverables: [],  
        added_deliverables: []      
    })

    const[toast, setToast] = useState(null)

    const [submitDis, setSubmitDis] = useState(false)






    
    useEffect(() =>{
        async function DataLoad(){
            try{
                const response = await axiosApi.get("/initialization/popservices")
                setServicesClass(response.data)
            }
            catch(error){
                console.log(error)
            }
        }
        DataLoad()
    }, [])

    
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }


    
    const handleRadioChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }


    
    const onClassChange = (e) => {
        const value = e.target.value;
        setSelectedClass(value);
        setClassServices(servicesClass[value] || [])
        
        setFormData(prev => ({
            ...prev,
            offering_type: value
        }));
    }


    
    const onServiceSelct = (e) => {
        const serv_value = e.target.value;
        setSelectedServ(serv_value);
        
        const selectedServiceObj = classServices.find(
            s => s.service_name === serv_value
        );
        
        setSelectedServProps(selectedServiceObj || null);
        
        if (selectedServiceObj) {
            const sd = selectedServiceObj.standard_deliverables;
            let standardDeliverables = [];
            
            if (sd) {
                const reports = sd.reports || [];
                const addons = sd["add-ons"] || [];
                standardDeliverables = [...reports, ...addons];
            }
            
            setProjectDesc("");
            
            setFormData(prev => ({
                ...prev,
                service_name: serv_value,
                platform: selectedServiceObj.instrumentation?.platform || "",
                standard_deliverables: standardDeliverables,  
                added_deliverables: []  
            }))
        }
    }



    
    const validateForm = () => {
        const requiredFields = ['project_id', 'pi_name', 'email', 'institution', 'labdept', 
                                'offering_type', 'service_name', 'sam_number', 'duplicates', 
                                'extraction', 'sample_type', 'platform'];
        
        for (const key of requiredFields) {
            if (!formData[key] || formData[key].toString().trim() === "") {
                toastSet(setToast, false, `Missing required field: ${key.replaceAll("_", " ")}`)
                return false;
            }
        }
        return true;
    }



    
    const SendProjectInfo = async () => {

        if (!validateForm()) return Promise.reject("Invalid Form")

        const addedDeliverablesArray = projectDesc
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)

        const payload = {
            ...formData,
            added_deliverables: addedDeliverablesArray
        }

        setSubmitDis(true)

        try {
            const response = await axiosApi.post("/initialization/startproject",
                payload,
                {headers: { "Content-Type": "application/json" } }
            )

            const data = response.data

            if(!data.status){
                toastSet(setToast, false, data.message)
                setSubmitDis(false)
                return
            }

            toastSet(setToast, true, data.message)
            setTimeout(() => window.location.reload(), 2000)
            

        } catch (error) {

            console.error(error)
            toastSet(setToast, false, "Submission failed")   
            setSubmitDis(false) 
        }
    }
    
    return(
        <div className={styles.ProgCompDiv}>
            <SideWin />
            <MainFormPage 
                servicesClass={servicesClass}
                onClassChange={onClassChange}
                classServices={classServices}
                onServiceSelct={onServiceSelct}
                selectedServProps={selectedServProps}
                projectDesc={projectDesc}
                setProjectDesc={setProjectDesc}
                handleChange={handleChange}
                handleRadioChange={handleRadioChange}
                SendProjectInfo={SendProjectInfo}
                submitDis = {submitDis}
                setToast={setToast}
                setFormData = {setFormData}
                formData ={formData}
            />
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
        </div>
    )
}

function SideWin(){
    return(
        <div className={styles.projDetSide}>
            <h2>Project Initiation Window</h2>
            <p>You are about to create a new project. Please keep the following in mind before you continue.</p>
            <ul>
                <li>All fields in this form are <strong>mandatory</strong>.</li>
                <li>Ensure the project name and description are clear.</li>
                <li>Some settings cannot be modified later.</li>
                <li>Verify all sample details carefully.</li>
                <li>Incorrect info may affect downstream analysis.</li>
            </ul>
        </div>
    );
}

function MainFormPage({
    servicesClass,
    onClassChange,
    classServices,
    onServiceSelct,
    selectedServProps,
    projectDesc,
    setProjectDesc,
    handleChange,
    handleRadioChange,
    SendProjectInfo,
    submitDis,
    setToast,
    setFormData,
    formData
}) {
    
    const getStandardDeliverables = () => {
        if (!selectedServProps?.standard_deliverables) return [];
        
        const sd = selectedServProps.standard_deliverables;
        const reports = sd.reports || [];
        const addons = sd["add-ons"] || [];
        
        return [...reports, ...addons];
    };


    async function getProjectId(){
        try{
            const response = await axiosApi.post("/initialization/genprojectid")
            const data = response.data

            setFormData(prev => ({
                ...prev,
                project_id: data.payload.project_id
            }))

            toastSet(setToast, data.status, data.message);
        }
        catch(err){
            console.log(err)
            toastSet(setToast, false, "Unable to process request")
        }
    }
    
    return(
        <div className={styles.MainFormPage}>
            <div className={styles.FormBox}>
                <div className={styles.ForminBox}>
                    
                    <div className={styles.InputcompDiv}>
                        <label>Project ID <button onClick={getProjectId} className={styles.GenCatno} >Get Project ID</button> </label>
                        <input name="project_id" value={formData.project_id} type="text" onChange={handleChange} />
                    </div>
                    
                    <div className={styles.InputcompDiv}>
                        <label>PI Name</label>
                        <input name="pi_name" type="text" onChange={handleChange} />
                    </div>
                    
                    <div className={styles.InputcompDiv}>
                        <label>Email</label>
                        <input name="email" type="email" onChange={handleChange} />
                    </div>

                    <div className={styles.InputcompDiv}>
                        <label>Phone</label>
                        <input name="phone" type="tel" onChange={handleChange} />
                    </div>
                    
                    <div className={styles.InputcompDiv}>
                        <label>Organization/Institution</label>
                        <input name="institution" type="text" onChange={handleChange} />
                    </div>
                    
                    <div className={styles.InputcompDiv}>
                        <label>Lab/Department</label>
                        <input name="labdept" type="text" onChange={handleChange} />
                    </div>
                </div>
                
                <div className={styles.ForminBox}>
                    
                    <div className={styles.InputcompDiv}>
                        <label>Offerings Type</label>
                        <select name="offering_type" onChange={onClassChange}>
                            <option value="">Select Offering Type</option>
                            {Object.keys(servicesClass).map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className={styles.InputcompDiv}>
                        <label>Recommended Application</label>
                        <select name="service_name" onChange={onServiceSelct}>
                            <option value="">Select Service</option>
                            {classServices.map((servs) => (
                                <option key={servs.service_name} value={servs.service_name}>
                                    {servs.service_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className={styles.InputcompDiv}>
                        <label>Type of samples</label>
                        <select name="sample_type" onChange={handleChange}>
                            <option value="">Select sample type</option>
                            {selectedServProps?.supported_sample_types?.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className={styles.InputcompDiv}>
                        <label>Number of samples</label>
                        <input name="sam_number" type="number" onChange={handleChange} />
                    </div>
                    
                    <div className={styles.InputcompDiv}>
                        <label>Are there replicates</label>
                        <div>
                            <input type="radio" name="duplicates" id="dupyes" value="yes" onChange={handleRadioChange} />
                            <label htmlFor="dupyes">Yes</label>
                            <input type="radio" name="duplicates" id="dupno" value="no" onChange={handleRadioChange} />
                            <label htmlFor="dupno">No</label>
                        </div>
                    </div>
                    
                    <div className={styles.InputcompDiv}>
                        <label>Samples Extraction needed</label>
                        <div>
                            <input type="radio" name="extraction" id="extyes" value="yes" onChange={handleRadioChange} />
                            <label htmlFor="extyes">Yes</label>
                            <input type="radio" name="extraction" id="extno" value="no" onChange={handleRadioChange} />
                            <label htmlFor="extno">No</label>
                        </div>
                    </div>
                    
                    <div className={styles.InputcompDiv}>
                        <label>Platform</label>
                        <div className={styles.OutCont}>
                            {selectedServProps?.instrumentation?.platform || "No Info"}
                        </div>
                    </div>
                    
                    <div className={styles.InputcompDiv}>
                        <label>Application</label>
                        <div className={styles.OutCont}>
                            {selectedServProps?.applications || "No Info"}
                        </div>
                    </div>
                    
                    <div className={styles.InputcompDiv}>
                        <label>Standard Deliverables</label>
                        <div className={styles.OutCont}>
                            {getStandardDeliverables().length > 0 ? (
                                <ul className={styles.List}>
                                    {getStandardDeliverables().map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            ) : (
                                <span>No Info</span>
                            )}
                        </div>
                    </div>
                    
                    <div className={styles.InputcompDiv}>
                        <label>Added deliverables (one per line)</label>
                        <textarea
                            rows={12}
                            value={projectDesc}
                            placeholder="Enter additional deliverables (one per line)"
                            onChange={(e) => {
                                setProjectDesc(e.target.value);
                            }}
                        />
                    </div>
                    
                    <SendButton SendProjectInfo={SendProjectInfo} submitDis={submitDis} />
                </div>
            </div>
        </div>
    );
}

function SendButton({ SendProjectInfo, submitDis }) {


    return (
        <div className={styles.SendAppButton}>
            <button onClick={SendProjectInfo} disabled={submitDis}>
                {submitDis ? <><span className={styles.loader}></span></> : <>SUBMIT</>}
            </button>
        </div>
    )
}