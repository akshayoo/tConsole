import styles from "./Sub.module.css";
import Link from "next/link";

export function Sub() {
  return (
    <div className={styles.HomePage}>
        <div className={styles.Cont}>

            <section className={styles.HeadCont}>
                <h1 className={styles.HeadTitle}>Submissions</h1>
                <p className={styles.HeadSubt}>Manage all submission workflows</p>
            </section>

            <section className={styles.Section}>
                <h2 className={styles.SectionTitle}>Explore Submissions</h2>

                <div className={styles.CardGrid}>

                    <div className={styles.Card}>
                        <h3>Initialization</h3>
                        <p>Initiate projects</p>
                        <Link href="/SSubTrack/ProjectDetails" className={styles.CardLink}>
                            Explore →
                        </Link>
                    </div>


                    <div className={styles.Card}>
                        <h3>Intake</h3>
                        <p>Manage sample submission forms</p>

                        <div className={styles.ActionRow}>
                            <Link href="/SSubTrack/LabForm" className={styles.CardLink}>
                                Explore →
                            </Link>
                        </div>
                    </div>

                </div>
            </section>

        </div>
    </div>
  );
}
