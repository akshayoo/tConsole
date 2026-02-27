import{SSFNav} from './components/SSFNav'
import styles from './SSF.module.css'
import {Sub} from './Sub'

export function SSF(){
    return(
        <div className={styles.container}>
            <SSFNav />
            <Sub />
        </div>
    );
}