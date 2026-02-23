"use client"

import { useState } from 'react';
import axiosApi from '@/lib/api';
import styles from './signupComp.module.css'
import Image from "next/image"
import Link from 'next/link';

export function SignupComp() {

    const [formData, setFormData] = useState({
        "username" : "",
        "password" : "",
        "password_re" : ""
    })

    async function signUp(e) {

         e.preventDefault()

        if(!formData.username || !formData.password || !formData.password_re){
            alert("Fields missing")
            return
        }

        if(formData.password !== formData.password_re){
            alert("Password missmatch")
            return
        }

        try{

            const response = await axiosApi.post("/auth/signup",
                formData
            )

            alert(response.data.status)

            window.location.href = "/login"

        }
        catch(error) {
            console.log(error);
            alert("Not a user");
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
                <h1 className={styles.loginTitle}>theraCONSOLE</h1>
                <p className={styles.loginSubtitle}>Register as a user</p>

                <form className={styles.loginForm} onSubmit={signUp}>
                    <div className={styles.formGroup}>
                        <label>Employee Email</label>
                        <input name="username" type="text" placeholder="user@theracues.com" onChange={handleChange}/>
                    </div>

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
                <p className={styles.loginSubtitle}><Link className={styles.Link} href="/login">Sign in</Link></p>

                <p className={styles.loginFooter}>
                    Authorized personnel only
                </p>
            </div>
        </div>
  );
}

