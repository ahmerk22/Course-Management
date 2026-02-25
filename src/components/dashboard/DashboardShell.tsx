"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./DashboardShell.module.css";
import MobileDrawer from "./MobileDrawer";
import SignOutButton from "./SignOutButton";

export default function DashboardShell({
                                           userEmail,
                                           children,
                                       }: {
    userEmail: string | null;
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const navItemClass = (href: string) =>
        `${styles.navItem} ${pathname === href ? styles.navItemActive : ""}`;

    return (
        <div className={styles.shell}>
            {/* Desktop sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <div className={styles.brandBadge}>CM</div>
                    <div>
                        <div>Course Manager</div>
                        <div className="muted" style={{ fontSize: 12 }}>
                            Dashboard
                        </div>
                    </div>
                </div>

                <nav className={styles.nav}>
                    <Link className={navItemClass("/courses")} href="/courses">
                        Courses
                    </Link>
                    <Link className={navItemClass("/courses/new")} href="/courses/new">
                        New Course
                    </Link>
                </nav>
            </aside>

            {/* Right side */}
            <div className={styles.content}>
                <header className={styles.topbar}>
                    <div className={styles.topbarInner}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <button className={`btn btn-ghost ${styles.mobileOnly}`} onClick={() => setOpen(true)}>
                                ☰
                            </button>
                            <div style={{ fontWeight: 900 }}>Main Dashboard</div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            {userEmail && <span className="muted" style={{ fontSize: 13 }}>{userEmail}</span>}
                            <SignOutButton />
                        </div>
                    </div>
                </header>

                <main className={styles.main}>{children}</main>
            </div>

            <MobileDrawer open={open} onClose={() => setOpen(false)} />
        </div>
    );
}