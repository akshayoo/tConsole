import { ItemsNav } from "./components/ItemsNav";
import { ItemsComp } from "./itemsComp";
import styles from "./Items.module.css"

export function Items(){
    return(
        <div className={styles.container}>
            <ItemsNav />
            <ItemsComp />
        </div>
    );
}