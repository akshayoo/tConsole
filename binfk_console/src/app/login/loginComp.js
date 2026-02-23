"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import axiosApi from '@/lib/api';
import styles from './loginComp.module.css'
import Image from "next/image"
import Link from 'next/link';

export function LoginComp() {

    const router = useRouter();

    const [formData, setFormData] = useState({
        "username" : "",
        "password" : ""
    })

async function signIn(e) {

        console.log("SIGN IN CLICKED");
    
         e.preventDefault()

        if(!formData.username || !formData.password){
            alert("fields_missing")
            return
        }
        try {
            const response = await axiosApi.post(
                "/auth/login",
                formData
            )

            console.log(response.data)
            
            if (response.data.status === "success") {

                router.replace('/')
            } 
            else {
                alert(response.data.status)
            }
        }
        catch(error) {
            console.log(error);
            alert("Invalid username or password");
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
                <p className={styles.loginSubtitle}>Sign in to continue</p>
                <p className={styles.loginSubtitle}>Not Registered <Link className={styles.Link} href= '/signup'>Sign Up</Link> </p>

                <form className={styles.loginForm} onSubmit={signIn}>
                    <div className={styles.formGroup}>
                        <label>Username</label>
                        <input name="username" type="text" placeholder="user@theracues.com" onChange={handleChange}/>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Password</label>
                        <input name="password" type="password" placeholder="Enter your password" onChange={handleChange}/>
                    </div>

                    <button type="submit" className={styles.loginBtn}> Sign In</button>
                </form>

                <p className={styles.loginFooter}>
                    Authorized personnel only
                </p>
            </div>
        </div>
  );
}

