import { DbNav } from "../components/DbNav";
import { ViewComp } from './ViewComp';
import styles from '../LabDB.module.css'

export function View() {

  return (
    <>
      <div className={styles.container}>
        <DbNav />
        <ViewComp />
      </div>
    </>
  );
}
