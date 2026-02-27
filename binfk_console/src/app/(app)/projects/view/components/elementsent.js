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

