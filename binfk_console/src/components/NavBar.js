"use client"

import Link from 'next/link'
import Image from "next/image"
import styles from "./NavBar.module.css"
import { useEffect, useState } from 'react';
import axiosApi from '@/lib/api';


export function NavBar() {

    const [whoami, setWhoami] = useState({})

    useEffect(() => {

        async function WhoAmi(){

            const response = await axiosApi.get("/auth/whoami",
            )

            const data = response.data

            setWhoami(data)
        }

        WhoAmi()

    }, [])

    return (
        <nav className= {styles.navBar}>
            <Logo />
            <NavBtns />
            <UserProfile whoami = {whoami} />
        </nav>
    )
}

function Logo() {
    return (
        <Image
            src="/logo.webp"
            alt="Theracues logo"
            width={120}
            height={60}
            className={styles.navLogo}
        />
    );
}

const navLink = {
    home: "Home",
    projects: "Projects",
    servitems: "Items",
    aws: "AWSup",
    aichat: "CuesAI",
    intake : "Submissions",
    items : "Items"
}


function NavBtns() {
    return (
        <div className= {styles.navBtnsDiv}>
            <Link href= "/">
                <button
                    className= {styles.navBtns}>
                    {navLink.home}
                </button>
            </Link>

            <Link href = "/CuesAI">
                <button
                    className= {styles.navBtns}>
                    {navLink.aichat}
                </button>
            </Link>

            <Link href="/LabDB">
                <button
                    className= {styles.navBtns}>
                    {navLink.projects}
                </button>
            </Link>

            <Link href="/Items">
                <button
                    className= {styles.navBtns}>
                    {navLink.items}
                </button>
            </Link>

            <Link href="/SSubTrack">
                <button 
                    className= {styles.navBtns}>
                    {navLink.intake}
                </button>
            </Link>
        </div>
    );
}

function UserProfile({whoami}) {

    const [open, setOpen] = useState(false)

    const userLogout = async() =>{

        try{

            const response = await axiosApi.post("/auth/logout"
            )

            const data = response.data

            if(!data.status){
                alert("logout failed")
                return
            }

            window.location.href = "/"

        }
        catch(error) {
            console.log(error)
        }
    }

    return(
        <>
            <button 
                className={styles.UserButton}
                onClick={() => setOpen(true)}
            >
                Hi, {whoami.name} &#128100;
            </button>

            {open && <div 
                className={styles.overlay}
                onClick={() => setOpen(false)}
            />}

            <div className={`${styles.sidePanel} ${open ? styles.open : ""}`}>
                <div className={styles.panelHeader}>
                    <div className={styles.closeHead}>
                        <button onClick={() => setOpen(false)}>✕</button>
                    </div>
                </div>
                <div className={styles.UserPanel}>
                    <div className={styles.panelSide}>
                        <div>&#xf110;</div>
                    </div>
                    <div className={styles.panelBody}>
                        <p>{whoami.name}</p>
                        <p>{whoami.username}</p>
                        <p>{whoami.user_id}</p>
                        <p>{whoami.role}</p>
                    </div>
                </div>

                <div className={styles.panelFooter}>
                    <div>My Account</div>
                    <div><button onClick={userLogout} className={styles.logoutBtn}>Logout</button></div>
                </div>
            </div>
        </>
    )
}

