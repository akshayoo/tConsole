import styles from './ItemsNav.module.css'
import Link from 'next/link';

const items = {
    "catalog" : "Catalog",
    "insert" : "Insert"
}

export function ItemsNav() {
    return(
        <div className={styles.DbFeatureDiv}>
            <Link href="/items/catalog">
                <button key= "view" className={styles.DbFeatureBtns} >{items.catalog}</button>
            </Link>
            <Link href="/items/insert">
                <button key="push" className={styles.DbFeatureBtns} >{items.insert}</button>
            </Link>
        </div>
    );
}
