import styles from '../SSF.module.css'
import { LabFormComp } from "./LabFormComp";

export function LabForm(){
    return(
        <div className={styles.container}>
            <LabFormComp />
        </div>
    );
}