"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import axiosApi from '@/lib/api';
import styles from './loginComp.module.css'
import Image from "next/image"
import Link from 'next/link';
import { toastSet } from '@/components/toastfunc';
import { MessageComp } from '@/components/messageComp';

export function LoginComp() {

    const router = useRouter();

    const [formData, setFormData] = useState({
        "username" : "",
        "password" : ""
    })

    const [toast, setToast] = useState(null)

    const [buttonDis, setButtonDis] = useState(false)

async function signIn(e) {

    
        e.preventDefault()

        if(!formData.username || !formData.password){
            toastSet(setToast, false, "Missing fields")
            return
        }

        setButtonDis(true)

        try {
            const response = await axiosApi.post(
                "/auth/login",
                formData
            )
            
            if (response.data.status) {
                toastSet(setToast, response.data.status, response.data.message)
                setTimeout(() => router.replace("/"), 2000)
            } 
            else {
                toastSet(setToast, response.data.status, response.data.message)
                setButtonDis(false)
                return
            }
        }
        catch(error) {
            console.log(error)
            setButtonDis(false)
            toastSet(setToast, false, "Unable to reach the servers please try after some time")
        }
    }
    
    const handleChange = (e) => {

        const{name, value} = e.target

        setFormData(prev =>({
            ...prev, [name] : value
        }))
    }


    return (
        <div className={styles.loginPage}>

            <div className={styles.loginCard}>
                <div className={styles.loginImg}>
                    <Image src="/logo.webp" alt="Theracues logo" width={125} height={40} className={styles.navLogo} />
                </div>
                <h1 className={styles.loginTitle}>tConsole</h1>
                <p className={styles.loginSubtitle}>Sign in to continue</p>
                <p className={styles.loginSubtitle}>Not Registered <Link className={styles.Link} href= '/signup'>Sign Up</Link> </p>

                <form className={styles.loginForm} onSubmit={signIn}>
                    <div className={styles.formGroup}>
                        <label>Username</label>
                        <input name="username" type="text" placeholder="eg: user@theracues.com" onChange={handleChange}/>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Password</label>
                        <input name="password" type="password" placeholder="Enter your password" onChange={handleChange}/>
                    </div>

                    <button type="submit" className={styles.loginBtn} disabled={buttonDis} >
                        {buttonDis ? <><span className={styles.loader}></span></> : <>Sign In</>}
                    </button>
                </form>

                <p className={styles.loginSubtitle}><Link className={styles.Link} href= '/forgot-password'>Forgot password</Link> </p>

                <p className={styles.loginFooter}>
                    Authorized personnel only
                </p>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} /> }
        </div>
  );
}

