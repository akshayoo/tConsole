"use client"

import styles from './ViewComp.module.css'
import { useState, useEffect } from 'react';
import axiosApi from '@/lib/api';
import { SampleSubDetailsComp, QcSamDetailsComp, LibSamDetailsComp, BiinfoDetailsComp } from './components/elements';
import { QcReportPushForm, LibQcReportPushForm, BinfReportPushForm } from './components/elemoptions';
import { EmailReports } from './components/elementsent';
import { MessageComp } from '@/components/messageComp';
import { toastSet } from '@/components/toastfunc';

export function ViewComp(){

    const [ projectCont, setProjectCont ] = useState(null)
    const [samsubDetails, setSamsubDetails] = useState({})
    const [qcDetails, setQcDetails] = useState({})
    const [libqcDetails, setLibqcDetails] = useState({})
    const [binfDetails, setBinfDetails] = useState({})

    return(
        <>

            <div className={styles.View}>
                <ViewSideBar setProjectCont={setProjectCont} 
                setSamsubDetails={setSamsubDetails}
                setQcDetails={setQcDetails}
                setLibqcDetails = {setLibqcDetails}
                setBinfDetails ={setBinfDetails}/>


                <ViewWin projectCont={projectCont} 
                samsubDetails ={samsubDetails} 
                setSamsubDetails = {setSamsubDetails}
                qcDetails = {qcDetails}
                setQcDetails = {setQcDetails}
                libqcDetails={libqcDetails}
                setLibqcDetails={setLibqcDetails}
                binfDetails ={binfDetails}
                setBinfDetails = {setBinfDetails}/>

                

            </div>
        </>
    );
}

function ViewSideBar({setProjectCont, setSamsubDetails, setQcDetails, setLibqcDetails, setBinfDetails}){

    const [projectPipeline, setProjectPipeline] = useState([])
    
    const [toast, setToast] = useState(null);

    useEffect(() => {
        async function ProjectsPipeline() {
            try{
                const response = await axiosApi.get("http://localhost:6050/project/projects"
                )
                const data = await response.data

                console.log(data.message)

                setProjectPipeline(data.payload)

            }
            catch(error) {
                console.log(error)
            }
        }
        ProjectsPipeline()
    }, [])


    const ProjectPop = async(projectId, projectStatus) => {

        if(!projectId) return
        if(!projectStatus) return

        try{

            const response = await axiosApi.post("/project/projectcomp",
                {
                    "project_id" : projectId,
                    "project_status" : projectStatus 
                }
            )   
            const data = response.data

            if(!data.status){
                setToast({
                    condition : false,
                    message : data.message
                })

                setTimeout(() => {
                    setToast(null)
                }, 2000)

                return
            }

            console.log(data.message)


            setProjectCont(data.payload)
            setSamsubDetails({})
            setQcDetails({})
            setLibqcDetails({})
            setBinfDetails({})

        }
        catch(error) {

            console.log(error)
            setToast({
                condition: false,
                message: "Error fetching project details"
            });
            setTimeout(() => {
                setToast(null);
            }, 2000);

        }
    }



    return(

        <div className={styles.SideB}>
            <h2>Projects</h2>
            <div className={styles.RecEnt}>
                {
                    projectPipeline.map((project) => {
                        const percent = project.percent
                        return(

                            <button key={project.project_id} className={styles.projectBtns} onClick={() => ProjectPop(project.project_id, project.status)}>
                                <div className={styles.BtnsHeader}>
                                    <span id='projectId' className={styles.projectId}>{project.project_id}</span>
                                    <span className={`${styles.statusBadge} ${styles.accepted}`}>{project.status}</span>
                                </div>
                                
                                <div className={styles.progressContainer}>
                                    <div className={styles.progressText}>
                                        <span>Completion</span>
                                        <span>{`${project.percent}%`}</span>
                                    </div>
                                    <div className={styles.progressBar}>
                                        <div className={styles.progressFill} style={{ width: `${percent}%` }}></div>
                                    </div>
                                </div>
                            </button>
                        )
                    })
                }
            </div> 
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
        </div>
        
    );
}


function ViewWin ({projectCont, samsubDetails, setSamsubDetails, 
    qcDetails, setQcDetails, libqcDetails, setLibqcDetails, binfDetails, setBinfDetails}){
    return(
        <div className={styles.ViewWin}>
            <div className={styles.contentWin}>
                {projectCont && 
                
                    <div className={styles.ProjectView}>
                        <ViewProjDetails projectCont={projectCont} />
                        <StatusPop projectCont={projectCont} />
                        <SampleSubDetails projectCont={projectCont} samsubDetails ={samsubDetails} setSamsubDetails={setSamsubDetails} />
                        <QcSamDetails projectCont={projectCont} qcDetails ={qcDetails} setQcDetails = {setQcDetails} />
                        <LibSamDetails projectCont={projectCont} libqcDetails={libqcDetails} setLibqcDetails={setLibqcDetails} />
                        <BiInfoDetails projectCont={projectCont} binfDetails={binfDetails} setBinfDetails={setBinfDetails}/>
                        <Reports projectCont={projectCont} />
                        
                    </div>
                    
                
                }
            </div>
        </div>
    );
}


function ViewProjDetails({projectCont}) {
    return(
        <>
            <div className={styles.ProjectSection}>
                <div className={styles.IdComponent}>
                    <div>Project ID</div>
                    <div>{projectCont.project_id}</div>
                </div>
                <div className={styles.ProjectHealth}>
                    <div>{projectCont.project_status}</div>
                </div>
            </div>

            <div className={styles.ProjectComp}>
                <h2 className={styles.sech}>Client Information</h2>
                <div className={styles.GridTwo}>
                    <div className={styles.ProjecIn}>
                        <div>PI Name</div>
                        <div>{projectCont.pi_name}</div>
                    </div>
                    <div className={styles.ProjecIn}>
                        <div>Client Email</div>
                        <div>{projectCont.email}</div>
                    </div>
                </div>
                <div className={styles.ProjectCustomer}>
                    <div className={styles.ProjecIn}>
                        <div>Phone</div>
                        <div>{projectCont.phone}</div>
                    </div>
                    <div className={styles.ProjecIn}>
                        <div>Organization/Institution</div>
                        <div>{projectCont.institution}</div>
                    </div>
                    <div className={styles.ProjecIn}>
                        <div>Lab/Department</div>
                        <div>{projectCont.lab_dept}</div>
                    </div>
                    <div className={styles.ProjecIn}>
                        <div>Offering Type</div>
                        <div>{projectCont.offering_type}</div>
                    </div>
                </div>
            </div>
        </>
    );
}


function StatusPop({projectCont}){

    const [toast, setToast] = useState(null)

    async function updateTaskstage(sec, projectId, task){

        try {

            const response = await axiosApi.post("/project/taskstatusupdate",
                {
                    "project_id" : projectId,
                    "task" : task,
                    "sec" : sec
                }
            )

            const data = response.data

            if(!data.status){

                setToast({
                    condition : false,
                    message : data.message
                })

                setTimeout(() =>{
                    setToast(null)
                }, 2000)
                return
            }

            setToast({
                condition : true,
                message : data.message
            })

            setTimeout(() =>{
                setToast(null)
            }, 2000)
            return
            
        }

        catch(err) {
            console.log(err)

            setToast({
                condition : false,
                message : "Updating task failed"
            })

            setTimeout(() =>{
                setToast(null)
            }, 2000)
            return
        }

    }

    return(

        <div className={styles.ProjectComp}>
            <div className={styles.HeadComp}>
                <h2 className={styles.sech}>Project Tasks</h2>
            </div>

            <div >
                <div className={styles.TaskProp}>
                    <div>Standard Tasks</div>
                    {projectCont.std_del.map((stdDel) => {
                        return(
                            <div key={stdDel.task_number} className={styles.TaskComp}>
                                <div>{stdDel.label}</div>
                                <button onClick={() => updateTaskstage("std", projectCont.project_id, stdDel.task_number)} className={styles.TrueBtn} disabled={stdDel.completed}>&#10004;</button>
                            </div>
                        );
                    })}
                </div>
                <div className={styles.TaskProp}>
                    <div>Added Tasks</div>
                    {projectCont.add_del.map((addDel) => {
                        return(
                            <div key={addDel.task_number} className={styles.TaskComp}>
                                <div>{addDel.label}</div>
                                <button onClick={() => updateTaskstage("adel", projectCont.project_id, addDel.task_number)} className={styles.TrueBtn} disabled={addDel.completed}>&#10004;</button>
                            </div>
                        );
                    })}             
                </div>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message}/>}
        </div>
    );
}


function SampleSubDetails({projectCont, samsubDetails, setSamsubDetails}){

    const [toast, setToast] = useState(null)


    async function SampleSub(projectId) {

        try {

            const response = await axiosApi.post("/project/samsubdetails",
                {"project_id" : projectId}
            )

            const data = response.data

            if (!data.status){

                setToast({
                    condition : false,
                    message : data.message
                })

                setTimeout(() => {
                    setToast(null)
                }, 3000)
                return
            } 

            console.log(data.message)
            setSamsubDetails(data.payload)

        }
        catch(error){
            console.log(error)

            setToast({
                condition : false,
                message : "Error fetching sample submission details"
            })
            
            setTimeout(() => {
                setToast(null)
            }, 3000)
        }
    }

    return(
        <div className={styles.ProjectComp}>
            <div className={styles.HeadComp}>
                <h2 className={styles.sech}>Sample Submission Details</h2>
                <button className={styles.fieldPop} onClick={() => SampleSub(projectCont.project_id)}>&#8693;</button>
                {toast && <MessageComp condition={toast.condition} message={toast.message} />}
            </div>
            {
                Object.keys(samsubDetails).length > 0 && (
                <SampleSubDetailsComp samsubDetails={samsubDetails} projectId={projectCont.project_id}
                setSamsubDetails = {setSamsubDetails}/>)
            }
        </div>
    )
}


function QcSamDetails({projectCont, qcDetails, setQcDetails}) {

    const [qcDataForm, setQcDataForm] = useState(false)

    const[toast, setToast] = useState(null)

    async function QcSub(projectId){
        
        try{

            const response = await axiosApi.post("/project/qcsubdetails",
                {"project_id" : projectId}
            )

            const data = response.data

            if (!data.status){
                toastSet(setToast, false, data.message)
                return
            }
            
            console.log(data.message)
            setQcDetails(data.payload)

        }

        catch(error) {
            console.log(error)
            toastSet(setToast, false, "Error fetching QC details")
        }
    }

    return(
        <div className={styles.ProjectComp}>
            <div className={styles.HeadComp}>
                <h2 className={styles.sech}>QC Details</h2>
                <button className={styles.fieldPop} onClick={() => QcSub(projectCont.project_id)}>&#8693;</button>
            </div>
            {
                Object.keys(qcDetails).length > 0 && (
                    <QcSamDetailsComp qcDetails = {qcDetails} projectId = {projectCont.project_id} setQcDetails = {setQcDetails} />
                )
            }
            <div className={styles.GridThree}>
                <div className={styles.ProjecInOnBtn}>
                    <button className={styles.ProjecInBtn}>{`Download Template (.csv)`}</button>
                </div>
                <div className={styles.ProjecInOnBtn}>
                    <button className={styles.ProjecInBtn} onClick={() => setQcDataForm(true)}>{`Upload QC Report`}</button>
                    {qcDataForm && <QcReportPushForm projectId={projectCont.project_id} setQcDataForm={setQcDataForm}/>}
                </div>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
        </div>
    )
}


function LibSamDetails({projectCont, libqcDetails, setLibqcDetails}) {

    const [ libQcDataFrom , setLibQcDataForm] = useState(false)
    const[toast, setToast] = useState(null)

    async function LibSub(projectId){

        try{

            const response = await axiosApi.post("/project/libqcsubdetails",
                {"project_id" : projectId}
            )

            const data = response.data

            if(!data.status){
                toastSet(setToast, false, data.message)
                return
            }

            console.log(data.message)
            setLibqcDetails(data.payload)

        }

        catch(err){
            console.log(err)
            toastSet(setToast, false, "Error fetching library QC details")
        } 
    }

    return(
        <div className={styles.ProjectComp}>
            <div className={styles.HeadComp}>
                <h2 className={styles.sech}>Library QC Details</h2>
                <button className={styles.fieldPop} onClick={() => LibSub(projectCont.project_id)}>&#8693;</button>
            </div>
            {
                Object.keys(libqcDetails).length > 0 && (<LibSamDetailsComp libqcDetails = {libqcDetails} projectId={projectCont.project_id}
                    setLibqcDetails={setLibqcDetails} />)
            }
            <div className={styles.GridThree}>
                <div className={styles.ProjecInOnBtn}>
                    <button className={styles.ProjecInBtn}>{`Download Template (.csv)`}</button>
                </div>
                <div className={styles.ProjecInOnBtn}>
                    <button className={styles.ProjecInBtn} onClick={() => setLibQcDataForm(true)}>{`Upload Lib QC Data`}</button>
                    {libQcDataFrom && <LibQcReportPushForm projectId={projectCont.project_id} setLibQcDataForm ={setLibQcDataForm} />}
                </div>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
        </div>
    )
}


function BiInfoDetails({projectCont, binfDetails, setBinfDetails}) {

    const [ binfDataForm, setBinfDataForm] = useState(false)

    const[toast, setToast] = useState(null)

    async function BinfSub(projectId) {
        try{
            const response = await axiosApi.post("/project/binfsubdetails",
                {"project_id" : projectId}
            )

            const data = response.data
            if(!data.status){
                toastSet(setToast, false, data.message)
                return
            }

            console.log(data.message)
            setBinfDetails(data.payload)


        }
        catch(error){
            console.log(error)
            toastSet(setToast, false, "Error fetching bioinformatics details")
        }
    }

    return(
        <div className={styles.ProjectComp}>
            <div className={styles.HeadComp}>
                <h2 className={styles.sech}>Analysis Details</h2>
                <button className={styles.fieldPop} onClick={() => BinfSub(projectCont.project_id)} >&#8693;</button>
            </div>
            {
                Object.keys(binfDetails).length > 0 && (<BiinfoDetailsComp binfDetails={binfDetails} projectId={projectCont.project_id}
                     setBinfDetails= {setBinfDetails} />)
            }
            <div className={styles.GridThree}>
                <div className={styles.ProjecInOnBtn}>
                    <button className={styles.ProjecInBtn} onClick={() => setBinfDataForm(true)}>{`Upload Analysis Data`}</button>
                    {binfDataForm && <BinfReportPushForm setBinfDataForm={setBinfDataForm} projectId = {projectCont.project_id} />}
                </div>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
        </div>
    )
}

function Reports({projectCont}) {

    const [finreportEmailTemp, setfinreportEmailTemp] = useState(false)
    
    const[toast, setToast] = useState(null)

    async function downlFinalRep(projectId) {
        try{

            const response = await axiosApi.post("/reports/genfinreportpdf",
                {"project_id" : projectId},
                {responseType : "blob"}
            )

            const blob = new Blob([response.data], {type : "application/pdf"})
            const url = window.URL.createObjectURL(blob)

            window.open(url, "_blank")

            setTimeout(() => {
                window.URL.revokeObjectURL(url)
            })

        }
        catch(error){

            console.log(error)
            setToast(setToast, false, "Downloading failed")

        }
    }

    async function closeProject(projectId){
        try{
    
            const response = await axios.post("/project/closeproject",
                {"project_id" : projectId}
            )

            const data = response.data
            toastSet(setToast, data.status, data.message)
            return
        }
        catch(error){
            console.log(error)
            toastSet(setToast, false, "Faliled to close project")
        }

    }

    return(
        <div className={styles.ProjectComp}>
            <div className={styles.HeadComp}>
                <h2 className={styles.sech}>Reports</h2>
            </div>
            <div className={styles.GridThree}>
                <div className={styles.ProjecInOnBtn}>
                    <button onClick={() => downlFinalRep(projectCont.project_id)} className={styles.ProjecInBtn}>{`Download Final Report (.pdf)`}</button>
                </div>
                <div className={styles.ProjecInOnBtn}>
                    <button onClick={()=>setfinreportEmailTemp(true)} className={styles.ProjecInBtn}>{`Send Final Report`}</button>
                    {finreportEmailTemp && <EmailReports projectId={projectCont.project_id} sec="finalreport" flow={"Final Project Report"} EmailTemp={setfinreportEmailTemp} />}
                </div>
                <div className={styles.ProjecIn}>
                    <button onClick={() => closeProject(projectCont.project_id)}>{`Close Project`}</button>
                </div>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
        </div>
        
    )
}


