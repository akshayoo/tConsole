"use client"

import { useState } from 'react';
import axiosApi from '@/lib/api';
import styles from './signupComp.module.css'
import Image from "next/image"
import Link from 'next/link';
import { toastSet } from '@/components/toastfunc';
import { MessageComp } from '@/components/messageComp';
import { useRouter } from 'next/navigation';

export function SignupComp() {

    const[buttonDis, setButtonDis] = useState(false)

    const [toast, setToast] = useState(null)

    const [getCode, setGetCode] = useState(null)

    const [signUpMail, setSignUpMail] = useState({
        "email" : ""
    })

    const [validCode, setValidCode] = useState({
        "code" : ""
    })

    const [passComp, setPassComp] = useState({
        "password" : "",
        "password_re" : ""
    })

    const [passWd, setPassWd] = useState(null)

    const handleEmailChange = (e) => {
        const {name, value} = e.target
        setSignUpMail(prev => ({
            ...prev, [name] : value
        }))  
    }

    const router = useRouter()

    async function sendSignupCode(e){

        e.preventDefault()

        if(!signUpMail.email.trim()){
            toastSet(setToast, false, "Missing values")
            return
        }

        if(!signUpMail.email.trim().endsWith("@theracues.com")){
            toastSet(setToast, false, "Use your organization email")
            return
        }

        setButtonDis(true)

        try{

            const response = await axiosApi.post("/auth/signupmail", signUpMail)
            const data = response.data

            if(!data.status){
                toastSet(setToast, false,  data.message)
                setButtonDis(false)
                return
            }

            if(!data.payload){
                toastSet(setToast, false,  data.message)
                setButtonDis(false)
                return
            } 

            toastSet(setToast, data.status, data.message)

            setGetCode(data.payload)
            
            setButtonDis(false)

            toastSet(setToast, data.status, data.message)
        }
        catch(err){
            console.log(err)
            setButtonDis(false)
            toastSet(setToast, false, "Unable to process requests right now, Please try again after some time")
        }
    }




    const handleValidCodeChange = (e) => {
        const {name, value} = e.target
        setValidCode(prev => ({
            ...prev, [name] : value
        }))
    }



    async function validateCode(Name , userName) {
        
        if(!validCode.code.trim()) {
            toastSet(setToast, false, "Paste your code")
            return
        }

        setButtonDis(true)
        
        try{

            const response = await axiosApi.post("/auth/signupcodeval",
                {
                    name : Name,
                    username : userName,
                    code : validCode.code
                }
            )

            const data = response.data

            if(!data.status){
                toastSet(setToast, data.status, data.message)
                setButtonDis(false)
                return
            }

            toastSet(setToast, data.status, data.message)
            setPassWd(data.payload)
            setButtonDis(false)
            setGetCode(null)
        }

        catch(err){
            console.log(err)
            setButtonDis(false)
            toastSet(setToast, false, "Server error please try after some time")
        }
    }


    const handlePasswd = (e) => {
        const {name, value} = e.target

        setPassComp(prev => ({
            ...prev, [name] : value
        }))
    }

    async function signUp(Name , userName) {

        if(!passComp.password || !passComp.password_re){
            toastSet(setToast, false, "Missing fields")
            return
        }

        if(passComp.password.length < 9){
            toastSet(setToast, false, "Password too short, choose a strong password")
            return
        }

        if(passComp.password !== passComp.password_re){
            toastSet(setToast, false, "Password does't match, please try again")
            return
        }

        setButtonDis(true)

        try{

            const response = await axiosApi.post("/auth/signup",
                {
                    name : Name,
                    username : userName,
                    password : passComp.password,
                    password_re : passComp.password_re
                }
            )

            const data = response.data

            if(!data.status){
                toastSet(setToast, data.status, data.message)
                setButtonDis(false)
                return
            }

            toastSet(setToast, data.status, data.message)
            setButtonDis(true)
            setTimeout(() => router.push("/login"), 2000)
        }

        catch(error){
            console.log(error)
            setButtonDis(false)
            toastSet(setToast, false, "Unable to process your request")
        }
    }

    return (
        <div className={styles.loginPage}>

            <div className={styles.loginCard}>
                <div className={styles.loginImg}>
                    <Image src="/logo.webp" alt="Theracues logo" width={125} height={40} className={styles.navLogo} />
                </div>
                <h1 className={styles.loginTitle}>tConsole</h1>
                <p className={styles.loginSubtitle}>Register as a user</p>
                <p className={styles.loginSubtitle}>Already a user <Link className={styles.Link} href="/login">Sign in</Link></p>

                {getCode ? <GetCode buttonDis={buttonDis} getCode={getCode} validateCode={validateCode} handleValidCodeChange={handleValidCodeChange} /> : 
                passWd ? <PasswdComp buttonDis={buttonDis} passWd={passWd} signUp={signUp} handlePasswd={handlePasswd} /> :
                <SignUp buttonDis={buttonDis} sendSignupCode={sendSignupCode} handleEmailChange={handleEmailChange} />}

                <p className={styles.loginFooter}>
                    Authorized personnel only
                </p>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
        </div>
  );
}

function SignUp({sendSignupCode, handleEmailChange, buttonDis}) {

    return(

        <form className={styles.loginForm} onSubmit={sendSignupCode}>
            <div className={styles.formGroup}>
                <label>Employee Email</label>
                <input name="email" type="email" placeholder="eg: user@theracues.com" onChange={handleEmailChange}/>
            </div>

            <button type="submit" className={styles.loginBtn} disabled={buttonDis} >
                {buttonDis ? <><span className={styles.loader}></span></> : <>Get Code</>}
            </button>
        </form>
    );
}

function GetCode({getCode, validateCode, handleValidCodeChange, buttonDis}) {

    return(
        <>
            <form className={styles.loginForm} onSubmit={(e) =>{e.preventDefault(); validateCode(getCode.name, getCode.username)}} >
                <div className={styles.formGroup}>
                    <label>Enter your varification code</label>
                    <input name="code" type="text" placeholder="Enter your varification code" onChange={handleValidCodeChange} />
                </div>

                <button type="submit" className={styles.loginBtn} disabled={buttonDis} >
                    {buttonDis ? <><span className={styles.loader}></span></> : <>Verify Code</>}
                </button>
            </form>
        </>
    );
}


function PasswdComp({passWd, signUp, handlePasswd, buttonDis}){
    return(
  
        <form className={styles.loginForm} onSubmit={(e) => {e.preventDefault(); signUp(passWd.name, passWd.username)}}  >
            <div className={styles.formGroup}>
                <label>Type your password(Min: 9 characters)</label>
                <input name="password" type="password" placeholder="Enter your password" onChange={handlePasswd} />
            </div>

            <div className={styles.formGroup}>
                <label>Re-type Password</label>
                <input name="password_re" type="password" placeholder="Re-enter your password" onChange={handlePasswd} />
            </div>

            <button type="submit" className={styles.loginBtn} disabled={buttonDis} >
                {buttonDis ? <><span className={styles.loader}></span></> : <>Sign UP</>}
            </button>
        </form>
    );
}

