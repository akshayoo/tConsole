"use client"

import Link from 'next/link'
import Image from "next/image"
import styles from "./NavBar.module.css"


export function NavBar() {

    return (
        <nav className= {styles.navBar}>
            <Logo />
            <NavBtns />
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



function NavBtns() {
    return (
        <div className= {styles.navBtnsDiv}>
            <Link href= "/sample-submissions">
                <button
                    className= {styles.navBtns}>
                    
                </button>
            </Link>
        </div>
    );
}

