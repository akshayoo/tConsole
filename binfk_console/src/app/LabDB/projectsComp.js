"use client"

import { useState, useEffect } from 'react';
import axiosApi from '@/lib/api';
import styles from './LabDB.module.css'
import Link from 'next/link';

export function ProjectsComp(){

    const [dashboard, setDashboard] = useState({})

    useEffect(() =>{

        async function qetProjects() {

            try{
                const response = await axiosApi.get("/project/projectdash", 
                )
                const data = response.data
                setDashboard(data.payload)
                console.log("fetched")
            }
            catch(err){
                console.log(err);
            }
        }
        
        qetProjects()

    }, [])

    return(
        
        <div className={styles.ProjectComp}>

            <div className={styles.ProjectFr}>
                <div className={styles.ProjectHead}>
                    <div>
                        <div className={styles.ProjectP}>P</div>
                        <div className={styles.ProjectP}>R</div>
                        <div className={styles.ProjectP}>O</div>
                        <div className={styles.ProjectP}>J</div>
                        <div className={styles.ProjectP}>E</div>
                        <div className={styles.ProjectP}>C</div>
                        <div className={styles.ProjectP}>T</div>
                        <div className={styles.ProjectP}>S</div>
                    </div>   
                </div>
                <div className={styles.ProjectSide}>
                    <div>Total projects</div>
                    <div>{dashboard.total}</div>
                </div>
            </div>

            <div className={styles.ProjectInfo}>
                <div className={styles.ProjectInfoComp}>
                    <div>Initiated</div>
                    <div>{dashboard.initiated}</div>
                </div>
                <div className={styles.ProjectInfoComp}>
                    <div>Accepted</div>
                    <div>{dashboard.accepted}</div>
                </div>
                <div className={styles.ProjectInfoComp}>
                    <div>QC</div>
                    <div>{dashboard.qc}</div>
                </div>
                <div className={styles.ProjectInfoComp}>
                    <div>Lib QC</div>
                    <div>{dashboard.library}</div>
                </div>
                <div className={styles.ProjectInfoComp}>
                    <div>Analysis</div>
                    <div>{dashboard.bioinfo}</div>
                </div>
                <div className={styles.ProjectInfoComp}>
                    <div>Closed</div>
                    <div>{dashboard.closed}</div>
                </div>
            </div>

            <div className={styles.ProjectGraph}>
            <section className={styles.Section}>


                <div className={styles.CardGrid}>

                    <div className={styles.GridHead} >
                        <h2 className={styles.SectionTitle}>Explore Submissions</h2>
                    </div>

                    <div className={styles.Card}>
                        <h3>View</h3>
                        <p>View Projects</p>
                        <Link href="/LabDB/View" className={styles.CardLink}>
                            Explore →
                        </Link>
                    </div>

                </div>
            </section>
            </div>
        
        </div>

    );
}