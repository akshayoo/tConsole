"use client"

import styles from './LabForm.module.css'
import { useState } from 'react';
import { NcounterForm } from './nCounter/NcounterForm';
import { NgSForm } from './NGS/NgSForm';
import { GeoMxForm } from './GeoMx/GeoMxForm';
import axiosApi from '@/lib/api';


const applications = {
    "ncounter": "nCounter",
    "ngs": "NGS",
    "geomx" : "GeoMx"
}

export function LabFormComp() {

    const [searchValue, setSearchValue] = useState({})

    const [searchCont, setSearchCont] = useState("")

    const [techNology, setTechNology] = useState("")

    const [projectId,  setProjectID] = useState("")

    async function projectSearch(){

        if (!searchCont.trim()){
            alert("No Token found")
            return
        }

        try {
            const response =  await axiosApi.post("/intake/initialinfo",
                {"project_token" : searchCont}
            )

            const data = response.data

            if (!data.status){
                alert(`No project initiated, Please initialte a project`)
                return
            }
            
            console.log(data.status)

            const payload = data.payload

            setSearchValue(payload)
            setTechNology(payload.technology)
            setProjectID(payload.project_id)
        }

        catch(error) {
            console.log(error)
            alert(`Not a valid token: Error loading the data`)
            return
        }
    }

    
    const handleSearch = (e) => {

        const value = e.target.value
        setSearchCont(value)
    }

    const FORM_BY_TECH = {
        NGS: <NgSForm projectId={projectId} />,
        nCounter: <NcounterForm projectId={projectId} />,
        GeoMx: <GeoMxForm projectId={projectId} />
    }

    return(
        <div  className={styles.ProgCompDiv}>
            <SideWin handleSearch={handleSearch} 
            searchCont={searchCont} 
            projectSearch={projectSearch} 
            searchValue={searchValue}
            />
            {FORM_BY_TECH[techNology] ?? null}
            
        </div>
    );
}


function SideWin({handleSearch, searchCont, projectSearch, searchValue}){
    return(
        <>
            <div className={styles.projDetSide}>
                <div className={styles.SideFDiv}>
                    <label>Paste your project token</label>
                    <input onChange={handleSearch} value={searchCont}/>
                    <button onClick={projectSearch}>Search</button>
                </div>
                <div className={styles.SideSDiv}>
                    <div className={styles.SideInnerComp}>
                        <div>Project ID</div>
                        <div>{searchValue.project_id}</div>
                    </div>
                    <div className={styles.SideInnerComp}>
                        <div> PI Name</div>
                        <div>{searchValue.pi_name}</div>
                    </div> 
                    <div className={styles.SideInnerComp}>
                        <div> Institute</div>
                        <div>{searchValue.institution}</div>
                    </div> 
                    <div className={styles.SideInnerComp}>
                        <div>Department / Lab</div>
                        <div>{searchValue.lab_dept}</div>
                    </div>  
                    <div className={styles.SideInnerComp}>
                        <div>Contact Email</div>
                        <div>{searchValue.email}</div>
                    </div> 
                    <div className={styles.SideInnerComp}>
                        <div>Service Name</div>
                        <div>{searchValue.service_name}</div>
                    </div> 
                    <div className={styles.SideInnerComp}>
                        <div>Technology</div>
                        <div>{searchValue.technology}</div>
                    </div> 
                    <div className={styles.SideInnerComp}>
                        <div>Number of Samples</div>
                        <div>{searchValue.sample_number}</div>
                    </div> 
                </div>
            </div>
        </>
    );
}
