"use client";

import Link from "next/link";
import styles from "./MobileDrawer.module.css";

export default function MobileDrawer({
                                         open,
                                         onClose,
                                     }: {
    open: boolean;
    onClose: () => void;
}) {
    if (!open) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.row}>
                    <div style={{ fontWeight: 900 }}>Menu</div>
                    <button className="btn btn-ghost" onClick={onClose}>
                        Close
                    </button>
                </div>

                <nav className={styles.nav}>
                    <Link className={styles.navItem} href="/courses" onClick={onClose}>
                        Courses
                    </Link>
                    <Link className={styles.navItem} href="/courses/new" onClick={onClose}>
                        New Course
                    </Link>
                </nav>
            </div>
        </div>
    );
}