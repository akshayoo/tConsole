import styles from '../LabForm.module.css'
import { useState } from 'react';
import axiosApi from '@/lib/api';
import { toastSet } from '@/components/toastfunc';
import { MessageComp } from '@/components/messageComp';

export function NcounterForm({projectId}) {

    const [extChange, setExtChange] = useState(false)
    const [binfAnalysis, setBinfanalysis] = useState(false)

    const [file, setFile] = useState(null)
    const [tablePopulate, setTablePopulate] = useState([])

    const [formData, setFormData] = useState({
        project_id: projectId,
        technology: "nCounter",
        application : "",
        replicates : "",
        extraction_needed : "",

        rna_prep : "",
        dnase_treated : "",
        rna_kit_name : "",
        rna_assessment : "",

        bioinformatics_needed : "",
        key_objectives: "",
        differential_comparisons: "",
        additional_analysis: "",
        reference_study: ""
    })

    const [toast, setToast] = useState(null)

    const [buttonDis, setButtonDis] = useState(false)

    const handleFieldChange = (e) => {
        const{name, value} = e.target
        setFormData(prev =>({
            ...prev, [name] : value
        }))

    }

    const handleRadiooptChange = (e) => {
        const{name, value} = e.target
        setFormData(prev =>({
            ...prev, [name] : value
        }))
    }


    const fileIn = (e) => {
        const selFile = e.target.files[0]
        setFile(selFile)
    }


    
    async function fileUpload(){

        try{

            if (!file){
                toastSet(setToast, false, "Upload the file")
                return
            }

            const uploadData = new FormData()
            uploadData.append("file" , file)

            const response = await axiosApi.post("/intake/tablepopulate",
                uploadData
            )
            const data = response.data  

            if(!data.status){
                toastSet(setToast, false, data.message)
                return
            }

            console.log(data.message)
            
            const formPop = data.submission

            setTablePopulate(formPop)
            setFile(null)

        }

        catch(error) {
            console.log(error)
            toastSet(setToast, false, "Error uploading the table")
        }
    }


    async function sendNcounterForm() {
        if(!formData.application || !formData.replicates || 
            !formData.extraction_needed || !formData.bioinformatics_needed)
            {toastSet( setToast, false, "Missing fields"); return}
        
        if (!tablePopulate.length){toastSet(setToast, false, "Upload sample tables"); return}

        const payload = {...formData, table: tablePopulate}

        setButtonDis(true)

        try{
            const response = await axiosApi.post("/intake/ncounterform", payload)

            const data = response.data

            toastSet(setToast, data.status, data.message)

            setTimeout(() => window.location.reload(), 2000)

        }
        catch(error) {
            console.log(error)
            toastSet(setToast, false, "Error submitting the form")
        }
    }

    

    return(
        <div className={styles.MainFormPage}>
            <div className={styles.FormBox}>
                <div className={styles.FormFirSec}>
                    <div className={styles.FFComp}>
                        <h2>nCounter Sample Submission Window</h2>
                    </div>
                    <div className={styles.FFComp}>
                        <div>Profiling mRNA or miRNA</div>
                        <div className={styles.FRad}>
                            <input type="radio" id="mrna" name="application" value="mRNA" onChange={handleRadiooptChange} />
                            <label htmlFor="mrna">mRNA</label>

                            <input type="radio" id="mirna" name="application" value="miRNA" onChange={handleRadiooptChange} />
                            <label htmlFor="mirna">miRNA</label>
                        </div>
                    </div>
                    <div className={styles.FFComp}>
                        <div>Are there Replicates</div>
                        <div className={styles.FRad}>
                            <input type="radio" id="rep-yes" name="replicates" value="yes" onChange={handleRadiooptChange}  />
                            <label htmlFor="rep-yes">Yes</label>

                            <input type="radio" id="rep-no" name="replicates" value="no" onChange={handleRadiooptChange}  />
                            <label htmlFor="rep-no">No</label>
                        </div>
                    </div>
                    <div className={styles.FFComp}>
                        <div>Extraction needed</div>
                        <div className={styles.FRad}>
                            <input type="radio" id="ext-yes" name="extraction_needed" value="yes" onChange={(e) => {setExtChange(false); handleRadiooptChange(e)}} />
                            <label htmlFor="ext-yes">Yes</label>

                            <input type="radio" id="ext-no" name="extraction_needed" value="no" onChange={(e) => {setExtChange(true); handleRadiooptChange(e)}}/>
                            <label htmlFor="ext-no">No</label>
                        </div>
                    </div>
                    {extChange ? <ExtCont handleFieldChange={handleFieldChange} handleRadiooptChange={handleRadiooptChange} /> : <></>}

                    <div className={styles.FFComp}>
                        <div>Needed Bioinformatics Analysis</div>
                        <div className={styles.FRad}>
                            <input type="radio" id="binf-yes" name="bioinformatics_needed" value="Yes" onChange={(e) => {setBinfanalysis(true); handleRadiooptChange(e)}} />
                            <label htmlFor="binf-yes">Yes</label>

                            <input type="radio" id="binf-no" name="bioinformatics_needed" value="No" onChange={(e) => {setBinfanalysis(false); handleRadiooptChange(e)}}/>
                            <label htmlFor="binf-no">No</label>
                        </div>
                    </div>

                    {
                        binfAnalysis ? <Binfo handleFieldChange={handleFieldChange} /> : <></>
                    }
                    
                </div>

                <div className={styles.FormSceSec}>
                    <div className={styles.FormTableSec}>
                        <DisplayTable fileIn={fileIn} fileUpload={fileUpload} tablePopulate={tablePopulate} sendNcounterForm={sendNcounterForm}
                        buttonDis={buttonDis} />
                    </div>
                </div>
                {toast && <MessageComp condition={toast.condition} message={toast.message} />}
            </div>
        </div>
    );
    
}


function ExtCont({handleFieldChange, handleRadiooptChange}) {
    return(

        <>
            <div className={styles.FFComp}>
                <div>Has Total RNA prep been used</div>
                <div className={styles.FRad}>
                    <input type="radio" id="rnaprep-yes" name="rna_prep" value="yes" onChange={handleRadiooptChange} />
                    <label htmlFor="rnaprep-yes">Yes</label>

                    <input type="radio" id="rnaprep-no" name="rna_prep" value="no" onChange={handleRadiooptChange} />
                    <label htmlFor="rnaprep-no">No</label>
                </div>
            </div>
            <div className={styles.FFComp}>
                <div>Has sample been treated with DNAase</div>
                <div className={styles.FRad}>
                    <input type="radio" id="dnaase-yes" name="dnase_treated" value="yes" onChange={handleRadiooptChange} />
                    <label htmlFor="dnaase-yes">Yes</label>

                    <input type="radio" id="dnaase-no" name="dnase_treated" value="no" onChange={handleRadiooptChange} />
                    <label htmlFor="dnaase-no">No</label>
                </div>
            </div>
            <div className={styles.FFComp}>
                <label>Name of the Kit</label>
                <input name="rna_kit_name" onChange={handleFieldChange} />
            </div>  
            <div className={styles.FFComp}>
                <label>Method used to estimate sample concentration</label>
                <select name="rna_assessment" onChange={handleFieldChange} >
                    <option value="Qubit">Qubit</option>
                    <option value="Nanodrop">Nanodrop</option>
                    <option value="Bio-Analyzer">Bio-Analyzer</option>
                    <option value="Tapestation">TapeStation</option>
                    <option value="Other">Other</option>
                </select>
            </div>  
        </>
    );
}

function DisplayTable({fileIn, fileUpload, tablePopulate, sendNcounterForm, buttonDis}){
    return(
        <>
            <div className={styles.DisplayTable}>

                <div className={styles.TableDiv}>
                    <table className= {styles.DispTab} >
                        <thead>
                            <tr>
                                <th >Sample ID</th>
                                <th>Description</th>
                                <th>Conc.</th>
                                <th>Notes</th>
                                <th>{"Replicate(Group Name)"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tablePopulate.length > 0 ? (
                                tablePopulate.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row["sample_id"]}</td>
                                        <td>{row["description"]}</td>
                                        <td>{row["concentration"]}</td>
                                        <td>{row["notes"]}</td>
                                        <td>{row["replicate_group"]}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: "center" }}>
                                        NO DATA
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className= {styles.DispUpbtn}>
                    <a href='/template.ncounter.csv' download><button>Download Template</button></a>
                    <label id='fileupload'>Select the file</label>
                    <input onChange={fileIn} htmlFor='fileupload' type='file' accept='.csv, .xlsx' />
                    <button onClick={fileUpload}>Upload File</button>
                </div>
                <SendButton sendNcounterForm={sendNcounterForm} buttonDis={buttonDis} />
                
            </div>
        </>

    );
}

function Binfo({handleFieldChange}) {
    return(
        <>
            <div className={styles.FFComp}>
                <div>Key Objectives</div>
                <textarea name="key_objectives" onChange={handleFieldChange} rows={5} />
            </div>

            <div className={styles.FFComp}>
                <div>Comparisons for differential analysis</div>
                <textarea name="differential_comparisons" onChange={handleFieldChange} rows={5} />
            </div>

            <div className={styles.FFComp}>
                <div>Any additional analysis</div>
                <textarea name="additional_analysis" onChange={handleFieldChange} rows={5} />
            </div>

            <div className={styles.FFComp}>
                <div>Any reference study to follow for the analysis</div>
                <textarea name="reference_study" onChange={handleFieldChange} rows={5} />
            </div>
        </>
    );
}

function SendButton({ sendNcounterForm, buttonDis }) {

    return (
        <div className={styles.SendAppButton}>
        <button onClick={sendNcounterForm} disabled={buttonDis}>
            {buttonDis ? <>Processing</> : <>SUBMIT</>}
        </button>
        </div>
    )
}