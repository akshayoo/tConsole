import styles from './ChatWin.module.css';
import { toastSet } from '@/components/toastfunc';
import { MessageComp } from '@/components/messageComp';
import { useEffect, useState } from 'react';
import axiosApi from '@/lib/api';

export function ChatOption({chatHistId, setChatOptions}) {

    const [toast, setToast] = useState(null)

    const [deleting, setDeleting] = useState(false)    

    async function chatDelete(){
        const chat_id = chatHistId
        setDeleting(true)
        try{
            const response = await axiosApi.post("/cuesai/deletchat",
                {convo_id : chat_id}
            )

            const data = response.data

            toastSet(setToast, data.status, data.message)
            setTimeout(() =>setChatOptions(false), 2000)
        }

        catch(error){
            console.log(error)
            toastSet(setToast, false, "Failed to clear conversation")
            setDeleting(false)
        }
    }

    useEffect(() => {
        const handleClick = (e) => {
            if (!e.target.closest('.chatOptionsBtn') && !e.target.closest('.threeDotsBtn')) {
                setChatOptions(false)
            }
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    },[deleting])

    return (
        <>
            <div className={styles.chatOptionsFloating}>
                <button className={styles.chatOptionsBtn} onClick={chatDelete}>Delete</button>
            </div>  
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}      
        </>

    );
}