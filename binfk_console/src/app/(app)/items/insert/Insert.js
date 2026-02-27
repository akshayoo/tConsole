import {ItemsNav} from '../components/ItemsNav'
import { InsertComp } from "./InsertComp";
import styles from '../Items.module.css'

export function Insert(){
    return(
        <div className={styles.container}>
            <ItemsNav />
            <InsertComp />
        </div>
    );
}