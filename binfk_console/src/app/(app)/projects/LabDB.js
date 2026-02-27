import { DbNav } from "./components/DbNav";
import { ProjectsComp } from "./projectsComp";
import styles from './LabDB.module.css'

export function LabDB() {

  return (
    <div className={styles.container}>
      <DbNav />
      <ProjectsComp />
    </div>
  );
}
