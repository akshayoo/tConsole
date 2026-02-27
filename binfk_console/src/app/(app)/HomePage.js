import styles from "./HomePage.module.css";
import Link from "next/link";

export function HomePage() {
  return (
    <div className={styles.HomePage}>
        <div className={styles.Cont}>

            <section className={styles.HeadCont}>
                <h1 className={styles.HeadTitle}>tConsole</h1>
                <p className={styles.HeadSubt}>Manage all your services</p>
                <Link href="/" className={styles.Headbutton}>
                    Explore
                </Link>
            </section>

            <section className={styles.Section}>
                <h2 className={styles.SectionTitle}>Explore All Services</h2>

                <div className={styles.CardGrid}>

                    <div className={styles.Card}>
                        <h3>Cues AI</h3>
                        <p>AI- powered chat bot</p>
                        <Link href="/cuesai" className={styles.CardLink}>
                            Explore →
                        </Link>
                    </div>


                    <div className={styles.Card}>
                        <h3>Projects</h3>
                        <p>Create, view, and manage your projects.</p>

                        <div className={styles.ActionRow}>
                            <Link href="/projects" className={styles.CardLink}>
                                Explore →
                            </Link>
                        </div>
                    </div>


                    <div className={styles.Card}>
                        <h3>Items</h3>
                        <p>Browse and organize available items.</p>

                        <div className={styles.ActionRow}>
                            <Link href="/items" className={styles.CardLink}>
                                Explore →
                            </Link>
                        </div>
                    </div>

                    <div className={styles.Card}>
                        <h3>Submissions</h3>
                        <p>Track and review all submissions.</p>

                        <div className={styles.ActionRow}>
                            <Link href="/submissions" className={styles.CardLink}>
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
