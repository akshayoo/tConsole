import styles from '../LabForm.module.css'


export function GeoMxForm({projectId}) {

    return(
        <div className={styles.MainFormPage}>
            <div className={styles.FormBox}>
                <div className={styles.FormFirSec}>
                    <div className={styles.FFComp}>
                        <div>Profiling mRNA or miRNA</div>
                        <div className={styles.FRad}>
                            <input type="radio" id="mrna" name="profiling" value="mRNA" />
                            <label htmlFor="mrna">mRNA</label>

                            <input type="radio" id="mirna" name="profiling" value="miRNA" />
                            <label htmlFor="mirna">miRNA</label>
                        </div>
                    </div>
                    <div className={styles.FFComp}>
                        <div>Does sample need miRNA profiling</div>
                        <div className={styles.FRad}>
                            <input type="radio" id="n-mrna" name="needmirna" value="yes" />
                            <label htmlFor="n-mrna">Yes</label>

                            <input type="radio" id="n-mirna" name="needmirna" value="no" />
                            <label htmlFor="n-mirna">No</label>
                        </div>
                    </div>
                    <div className={styles.FFComp}>
                        <div>Has Total RNA prep been used</div>
                        <div className={styles.FRad}>
                            <input type="radio" id="rnaprep-yes" name="totalrnaprep" value="yes" />
                            <label htmlFor="rnaprep-yes">Yes</label>

                            <input type="radio" id="rnaprep-no" name="totalrnaprep" value="no" />
                            <label htmlFor="rnaprep-no">No</label>
                        </div>
                    </div>
                    <div className={styles.FFComp}>
                        <label>Name of the Kit</label>
                        <input />
                    </div>  
                    <div className={styles.FFComp}>
                        <div>Has sample been treated with DNAase</div>
                        <div className={styles.FRad}>
                            <input type="radio" id="dnaase-yes" name="dnaase" value="yes" />
                            <label htmlFor="dnaase-yes">Yes</label>

                            <input type="radio" id="dnaase-no" name="dnaase" value="no" />
                            <label htmlFor="dnaase-no">No</label>
                        </div>
                    </div>
                    <div className={styles.FFComp}>
                        <label>Method used to estimate sample concentration</label>
                        <select>
                            <option>Qubit</option>
                            <option>Nanodrop</option>
                            <option>Bio-Analyzer</option>
                            <option>TapeStation</option>
                            <option>Other</option>
                        </select>
                    </div>  
                    <div className={styles.FFComp}>
                        <div>Are there duplicates</div>
                        <div className={styles.FRad}>
                            <input type="radio" id="dup-yes" name="dup" value="yes" />
                            <label htmlFor="dup-yes">Yes</label>

                            <input type="radio" id="dup-no" name="dup" value="no" />
                            <label htmlFor="dup-no">No</label>
                        </div>
                    </div>
                    <div className={styles.FFComp}>
                        <label>Panel Selection For the run</label>
                        <select>
                            <option>Qubit</option>
                            <option>Nanodrop</option>
                            <option>Bio-Analyzer</option>
                            <option>TapeStation</option>
                            <option>Other</option>
                        </select>
                    </div>  
                </div>

                <div className={styles.FormSceSec}>
                    <div className={styles.FormTableSec}>
                        <DisplayTable />
                    </div>
                </div>
            </div>
        </div>
    );
    
}

function DisplayTable(){
    return(
        <>
            <div className={styles.DisplayTable}>

                <div className={styles.TableDiv}>
                    <table className= {styles.DispTab} >
                        <thead>
                            <tr>
                                <th >Sample ID</th>
                                <th>Description</th>
                                <th>RNA Conc.</th>
                                <th>Notes</th>
                                <th>{"Replicate(Group Name)"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>SAM_ID- 1</td>
                                <td>Sample Description- 1</td>
                                <td>Sample RNA Conc.- 1</td>
                                <td>Notes</td>
                                <td>Group Name</td>
                            </tr>                               
          

                            <tr>
                                <td>SAM_ID- 2</td>
                                <td>Sample Description- 2</td>
                                <td>Sample RNA Conc.- 2</td>
                                <td>Notes</td>
                                <td>Group Name</td>
                            </tr>                                

                            <tr>
                                <td>SAM_ID- 2</td>
                                <td>Sample Description- 2</td>
                                <td>Sample RNA Conc.- 2</td>
                                <td>Notes</td>
                                <td>Group Name</td>
                            </tr>                                

                            <tr>
                                <td>SAM_ID- 2</td>
                                <td>Sample Description- 2</td>
                                <td>Sample RNA Conc.- 2</td>
                                <td>Notes</td>
                                <td>Group Name</td>
                            </tr>                                

                            <tr>
                                <td>SAM_ID- 2</td>
                                <td>Sample Description- 2</td>
                                <td>Sample RNA Conc.- 2</td>
                                <td>Notes</td>
                                <td>Group Name</td>
                            </tr>                                

                            <tr>
                                <td>SAM_ID- 2</td>
                                <td>Sample Description- 2</td>
                                <td>Sample RNA Conc.- 2</td>
                                <td>Notes</td>
                                <td>Group Name</td>
                            </tr>                                

                            <tr>
                                <td>SAM_ID- 2</td>
                                <td>Sample Description- 2</td>
                                <td>Sample RNA Conc.- 2</td>
                                <td>Notes</td>
                                <td>Group Name</td>
                            </tr>                                

                            <tr>
                                <td>SAM_ID- 2</td>
                                <td>Sample Description- 2</td>
                                <td>Sample RNA Conc.- 2</td>
                                <td>Notes</td>
                                <td>Group Name</td>
                            </tr>                                

                            <tr>
                                <td>SAM_ID- 2</td>
                                <td>Sample Description- 2</td>
                                <td>Sample RNA Conc.- 2</td>
                                <td>Notes</td>
                                <td>Group Name</td>
                            </tr>                                

                            <tr>
                                <td>SAM_ID- 2</td>
                                <td>Sample Description- 2</td>
                                <td>Sample RNA Conc.- 2</td>
                                <td>Notes</td>
                                <td>Group Name</td>
                            </tr>                                

                            <tr>
                                <td>SAM_ID- 2</td>
                                <td>Sample Description- 2</td>
                                <td>Sample RNA Conc.- 2</td>
                                <td>Notes</td>
                                <td>Group Name</td>
                            </tr>                                

                            <tr>
                                <td>SAM_ID- 2</td>
                                <td>Sample Description- 2</td>
                                <td>Sample RNA Conc.- 2</td>
                                <td>Notes</td>
                                <td>Group Name</td>
                            </tr>                                

                            <tr>
                                <td>SAM_ID- 2</td>
                                <td>Sample Description- 2</td>
                                <td>Sample RNA Conc.- 2</td>
                                <td>Notes</td>
                                <td>Group Name</td>
                            </tr>                                

                            <tr>
                                <td>SAM_ID- 2</td>
                                <td>Sample Description- 2</td>
                                <td>Sample RNA Conc.- 2</td>
                                <td>Notes</td>
                                <td>Group Name</td>
                            </tr>                                

                            <tr>
                                <td>SAM_ID- 2</td>
                                <td>Sample Description- 2</td>
                                <td>Sample RNA Conc.- 2</td>
                                <td>Notes</td>
                                <td>Group Name</td>
                            </tr>                                

                            <tr>
                                <td>SAM_ID- 2</td>
                                <td>Sample Description- 2</td>
                                <td>Sample RNA Conc.- 2</td>
                                <td>Notes</td>
                                <td>Group Name</td>
                            </tr>                                

                            <tr>
                                <td>SAM_ID- 2</td>
                                <td>Sample Description- 2</td>
                                <td>Sample RNA Conc.- 2</td>
                                <td>Notes</td>
                                <td>Group Name</td>
                            </tr>                                

                            <tr>
                                <td>SAM_ID- 2</td>
                                <td>Sample Description- 2</td>
                                <td>Sample RNA Conc.- 2</td>
                                <td>Notes</td>
                                <td>Group Name</td>
                            </tr>                                


                            <tr>
                                <td>SAM_ID- 2</td>
                                <td>Sample Description- 2</td>
                                <td>Sample RNA Conc.- 2</td>
                                <td>Notes</td>
                                <td>Group Name</td>
                            </tr>                                

                            <tr>
                                <td>SAM_ID- 2</td>
                                <td>Sample Description- 2</td>
                                <td>Sample RNA Conc.- 2</td>
                                <td>Notes</td>
                                <td>Group Name</td>
                            </tr>                                

                            <tr>
                                <td>SAM_ID- 2</td>
                                <td>Sample Description- 2</td>
                                <td>Sample RNA Conc.- 2</td>
                                <td>Notes</td>
                                <td>Group Name</td>
                            </tr>                                

                            <tr>
                                <td>SAM_ID- 2</td>
                                <td>Sample Description- 2</td>
                                <td>Sample RNA Conc.- 2</td>
                                <td>Notes</td>
                                <td>Group Name</td>
                            </tr>                                
                        </tbody>
                    </table>
                </div>
                <div className= {styles.DispUpbtn}>
                    <button>Download Template</button>
                    <button>Upload File</button>
                </div>
                <SendButton />
                
            </div>
        </>

    );
}


function SendButton(){
    return(
        <div className={styles.SendAppButton}>
            <button>Submit</button>
        </div>
    );
}