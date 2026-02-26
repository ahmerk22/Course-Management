import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import SignOutButton from "@/components/dashboard/SignOutButton";

type Role = "student" | "manager";

export default function DashboardLayout({
                                            children,
                                            userName,
                                            role,
                                        }: {
    children: React.ReactNode;
    userName: string;
    role: Role;
}) {
    const firstName = (userName || "User").trim().split(" ")[0]; // ✅ first name only

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
        <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
            {/* Top Bar */}
            <header
                className="sticky top-0 z-30 border-b"
                style={{ background: "var(--panel)", borderColor: "var(--border)" }}
            >
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="font-semibold text-base sm:text-lg">
                        Hi, {firstName}
                    </div>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <SignOutButton />
                    </div>
                </div>

                {/* ✅ Mobile nav so My Courses is always visible */}
                <div className="md:hidden px-4 pb-3">
                    <div
                        className="grid grid-cols-2 gap-2 rounded-xl p-2 border"
                        style={{ background: "var(--panel2)", borderColor: "var(--border)" }}
                    >
                        {nav.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-center rounded-lg py-2 font-semibold"
                                style={{
                                    background: "var(--panel)",
                                    border: `1px solid var(--border)`,
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-6">
                <div className="grid gap-6 md:grid-cols-[260px_1fr]">
                    {/* Desktop Sidebar */}
                    <aside
                        className="hidden md:block rounded-2xl border p-4"
                        style={{ background: "var(--panel)", borderColor: "var(--border)" }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="h-10 w-10 rounded-xl flex items-center justify-center font-black"
                                style={{ background: "var(--accent)", color: "var(--accentText)" }}
                            >
                                CM
                            </div>
                            <div>
                                <div className="font-bold">Course Management</div>
                                <div className="text-sm" style={{ color: "var(--muted)" }}>
                                    {role === "manager" ? "Admin Portal" : "Student Portal"}
                                </div>
                            </div>
                        </div>

                        <nav className="grid gap-2">
                            {nav.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="rounded-xl px-4 py-3 font-semibold border hover:opacity-90"
                                    style={{ background: "var(--panel2)", borderColor: "var(--border)" }}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </aside>

                    {/* Main */}
                    <main>{children}</main>
                </div>
            </div>
        </div>
    );
}