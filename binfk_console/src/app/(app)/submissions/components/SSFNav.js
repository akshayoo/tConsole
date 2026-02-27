import styles from './SSFNav.module.css'
import Link from 'next/link';

const dbFeatures = {
    "projectDetails" : "Initialization",
    "sampleQc" : "Intake"
}

export function SSFNav() {
    return(
        <div className={styles.DbFeatureDiv}>
            <Link href="/submissions/initialization">
                <button key= "view" className={styles.DbFeatureBtns} >{dbFeatures.projectDetails}</button>
            </Link>
            <Link href="/submissions/intake">
                <button key="push" className={styles.DbFeatureBtns} >{dbFeatures.sampleQc}</button>
            </Link>
        </div>
    );
}
