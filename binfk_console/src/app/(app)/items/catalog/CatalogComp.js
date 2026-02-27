"use client"

import styles from './Catalog.module.css'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import axiosApi from '@/lib/api'

export function CatalogComp(){

  const [catalogData, setCatalogData] = useState({})
  const [selectedService, setSelectedService] = useState(null)

  useEffect(() =>{
    
    async function fieldsData(){

      try{
        const response = await axiosApi.get("/items/catalog")
        console.log(response.data)
        setCatalogData(response.data)
      }
      catch{
        console.log("Error connecting to the server")
      }
    }
    fieldsData()
  }, [])

  return(
    <div className={styles.CatalogMainWin}>
      <SideBar 
        catalogData={catalogData}
        setSelectedService={setSelectedService}
      />
      <MainWin selectedService={selectedService}/>
    </div>
  )
}

function SideBar({ catalogData, setSelectedService }){

  const [openCategory, setOpenCategory] = useState(null)

  return(
    <div className={styles.sideBar}>

      {Object.keys(catalogData).map((category) => (

        <div key={category}>

          <div className={styles.sideBarIn}>
            <div>{category}</div>
            <button onClick={() => 
              setOpenCategory(openCategory === category ? null : category)
            }>
              <Image 
                className={styles.PushImage}
                src="/down.png"
                alt="push-down"
                width={20}
                height={20}
              />
            </button>
          </div>

          {openCategory === category && (
            <div className={styles.subList}>
              {catalogData[category].map((service, index) => (
                <button
                  key={index}
                  className={styles.InComp}
                  onClick={() => setSelectedService(service)}
                >
                  {service.service_name}
                </button>
              ))}
            </div>
          )}

        </div>

      ))}

    </div>
  )
}

function MainWin({ selectedService }){

  if(!selectedService){
    return(
        <div className={styles.MainWin}>
            <div className={styles.MainSub}>
                <div className={styles.ItemAppl}>
                    <div className={styles.ItemHead}>Service Actions</div>
                    <ul>
                        <li>Select a service from the sidebar to view full description</li>
                        <li>Compare multiple services</li>
                        <li>Download service brochure</li>
                        <li>To add new service, switch to the next window</li>
                        <li>New services always gets added to the Custom Services section</li>
                    </ul>
                </div>
            </div>
        </div>
    
    )
  }

  return(
        <div className={styles.MainWin}>
            <div className={styles.MainSub}>

                <div className={styles.ItemInitial}>
                    <div>{selectedService.service_name}</div>
                    <div>{selectedService.service_code}</div>
                </div>

                <div className={styles.ItemAppl}>
                    <div className={styles.ItemHead}>Application</div>
                    <div>{selectedService.applications}</div>
                </div>

                <div className={styles.ItemSamp}>

                    <div className={styles.ItemSampDiv}>
                        <div className={styles.ItemHead}>Platform</div>
                        <div>{selectedService.instrumentation?.platform}</div>
                    </div>

                    <div className={styles.ItemSampDiv}>
                        <div className={styles.ItemHead}>Sample Types</div>
                        <ul>
                            {selectedService.supported_sample_types?.map((s,i)=>(
                                <li key={i}>{s}</li>
                            ))}
                        </ul>
                    </div>

                </div>

                <div className={styles.ItemAppl}>
                    <div className={styles.ItemHead}>Standard Deliverables</div>

                    <ul>
                        {selectedService.standard_deliverables?.reports?.map((d,i)=>(
                        <li key={i}>{d}</li>
                        ))}
                    </ul>

                    {selectedService.standard_deliverables?.["add-ons"] && (
                        <>
                        <div className={styles.ItemHead}>Add-ons</div>
                        <ul>
                            {selectedService.standard_deliverables["add-ons"].map((a,i)=>(
                            <li key={i}>{a}</li>
                            ))}
                        </ul>
                        </>
                    )}

                </div>

            </div>
        </div>
  )
}
