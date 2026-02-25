"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardLayout({
                                            children,
                                            userName,
                                            role,
                                        }: {
    children: React.ReactNode;
    userName: string;
    role: "student" | "manager";
}) {
    const path = usePathname();
    const r = useRouter();

    async function signOut() {
        await fetch("/auth/signout", { method: "POST" });
        r.push("/signin");
        r.refresh();
    }

    const nav =
        role === "manager"
            ? [
                { href: "/manager/courses", label: "Manage Courses" },
                { href: "/manager/courses/new", label: "Create Course" },
            ]
            : [
                { href: "/courses", label: "Browse Courses" },
                { href: "/my-courses", label: "My Courses" },
            ];

    return (
        <div className="min-h-screen flex" style={{ background: "var(--bg)", color: "var(--text)" }}>
            <aside className="hidden lg:block w-64 p-5 border-r" style={{ borderColor: "var(--border)", background: "var(--panel)" }}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-11 w-11 rounded-xl flex items-center justify-center font-black shadow"
                         style={{ background: "var(--accent)", color: "var(--accentText)" }}>
                        CM
                    </div>
                    <div>
                        <div className="font-bold">Course Management</div>
                        <div className="text-xs" style={{ color: "var(--muted)" }}>
                            {role === "manager" ? "Admin" : "Student"} Portal
                        </div>
                    </div>
                </div>

                <nav className="space-y-2">
                    {nav.map((n) => (
                        <Link
                            key={n.href}
                            href={n.href}
                            className="block px-4 py-2 rounded-xl font-semibold border"
                            style={{
                                borderColor: "var(--border)",
                                background: path === n.href ? "color-mix(in srgb, var(--accent) 18%, transparent)" : "transparent",
                            }}
                        >
                            {n.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            <div className="flex-1">
                <header className="px-4 py-3 border-b flex items-center justify-between"
                        style={{ borderColor: "var(--border)" }}>
                    <div className="font-bold">Hi, {userName}</div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <button onClick={signOut}
                                className="px-3 py-2 rounded-lg font-semibold"
                                style={{ background: "var(--accent)", color: "var(--accentText)" }}>
                            Sign out
                        </button>
                    </div>
                </header>

                <main className="p-4 lg:p-8">{children}</main>
            </div>
        </div>
    );
}