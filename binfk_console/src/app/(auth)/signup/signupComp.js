"use client"

import { useState } from 'react';
import axiosApi from '@/lib/api';
import styles from './signupComp.module.css'
import Image from "next/image"
import Link from 'next/link';
import { toastSet } from '@/components/toastfunc';
import { MessageComp } from '@/components/messageComp';
import { sendStatusCode } from 'next/dist/server/api-utils';

export function SignupComp() {

    const [toast, setToast] = useState(null)

    const [getCode, setGetCode] = useState(null)

    const [signUpMail, setSignUpMail] = useState({
        "email" : ""
    })

    const handleEmailChange = (e) => {
        const {name, value} = e.target
        setSignUpMail(prev => ({
            ...prev, [name] : value
        }))  
    }

    async function sendSignupCode(e){

        e.preventDefault()

        if(!signUpMail.email){
            toastSet(setToast, false, "Missing email")
        }
        try{

            const response = await axiosApi.post("/auth/signupmail", signUpMail)
            const data = response.data

            if(!data.status){
                toastSet(setToast, false,  data.message)
                return
            }

            toastSet(setToast, data.status, data.message)
            if(!data.payload){
                toastSet(setToast, false,  data.message)
                return
            } 

            setGetCode(data.payload)
            toastSet(setToast, data.status, data.message)
        }
        catch(err){
            console.log(err)
            toastSet(setToast, false, "Unable to process requests right now, Please try again after some time")
        }
    }

    return (
        <div className={styles.loginPage}>

            <div className={styles.loginCard}>
                <div className={styles.loginImg}>
                    <Image src="/logo.webp" alt="Theracues logo" width={125} height={40} className={styles.navLogo} />
                </div>
                <h1 className={styles.loginTitle}>tCONSOLE</h1>
                <p className={styles.loginSubtitle}>Register as a user</p>
                <p className={styles.loginSubtitle}><Link className={styles.Link} href="/login">Sign in</Link></p>

                {getCode ? <GetCode /> : <SighUp sendSignupCode={sendSignupCode} handleEmailChange={handleEmailChange} />}

                <p className={styles.loginFooter}>
                    Authorized personnel only
                </p>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
        </div>
  );
}

function SighUp({sendSignupCode, handleEmailChange}) {

    return(

        <form className={styles.loginForm} onSubmit={sendSignupCode}>
            <div className={styles.formGroup}>
                <label>Employee Email</label>
                <input name="email" type="text" placeholder="eg: user@theracues.com" onChange={handleEmailChange}/>
            </div>

            <button type="submit" className={styles.loginBtn}>Get code</button>
        </form>
    );
}

function GetCode() {

    return(

        <form className={styles.loginForm} onSubmit={sendSignupCode}>
            <div className={styles.formGroup}>
                <label>Code</label>
                <input name="username" type="text" placeholder="Enter the code" onChange={handleChange}/>
            </div>

            <button type="submit" className={styles.loginBtn}>Submit</button>
        </form>
    );
}


function PasswdComp(){
    return(
  
        <form className={styles.loginForm} onSubmit={signUp} >
            <div className={styles.formGroup}>
                <label>Type Password</label>
                <input name="password" type="password" placeholder="Enter your password" onChange={handleChange}/>
            </div>

            <div className={styles.formGroup}>
                <label>Re-type Password</label>
                <input name="password_re" type="password" placeholder="Re-enter your password" onChange={handleChange}/>
            </div>

            <button type="submit" className={styles.loginBtn}>Sign Up</button>
        </form>
    );
}

