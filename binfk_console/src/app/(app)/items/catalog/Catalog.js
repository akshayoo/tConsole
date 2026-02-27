import {ItemsNav} from '../components/ItemsNav'
import { CatalogComp } from "./CatalogComp";
import styles from '../Items.module.css'

export function Catalog(){
    return(
        <div className={styles.container}>
            <ItemsNav />
            <CatalogComp />
        </div>
    );
}