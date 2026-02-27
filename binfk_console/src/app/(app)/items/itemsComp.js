import styles from "./ItemsComp.module.css";
import Link from "next/link";

export function ItemsComp() {
  return (
    <div className={styles.HomePage}>
        <div className={styles.Cont}>

            <section className={styles.HeadCont}>
                <h1 className={styles.HeadTitle}>Items</h1>
                <p className={styles.HeadSubt}>Manage all Service Items</p>
            </section>

            <section className={styles.Section}>
                <h2 className={styles.SectionTitle}>Explore Submissions</h2>

                <div className={styles.CardGrid}>

                    <div className={styles.Card}>
                        <h3>Catalog</h3>
                        <p>View Services</p>
                        <Link href="/Items/Catalog" className={styles.CardLink}>
                            Explore →
                        </Link>
                    </div>


                    <div className={styles.Card}>
                        <h3>Insert</h3>
                        <p>Insert custom services</p>
                        <div className={styles.ActionRow}>
                            <Link href="/Items/Insert" className={styles.CardLink}>
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
