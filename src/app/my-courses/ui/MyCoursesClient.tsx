"use client";

import Link from "next/link";
import { trpc } from "@/trpc/client";

export default function MyCoursesClient() {
    const { data, isLoading } = trpc.myCourses.useQuery();

    return (
        <div>
            <h1 className="text-2xl font-bold">My Courses</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                Courses you registered for.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {isLoading &&
                    Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border p-5"
                            style={{ background: "var(--panel)", borderColor: "var(--border)" }}
                        >
                            <div className="h-4 w-2/3 rounded bg-black/10 dark:bg-white/10" />
                            <div className="mt-3 h-3 w-full rounded bg-black/10 dark:bg-white/10" />
                        </div>
                    ))}

                {(data ?? []).map((row: any) => {
                    const c = row.courses_with_counts;
                    return (
                        <div
                            key={c.id}
                            className="rounded-2xl border p-5 shadow-xl"
                            style={{ background: "var(--panel)", borderColor: "var(--border)" }}
                        >
                            <Link href={`/courses/${c.id}`} className="text-lg font-bold">
                                {c.title}
                            </Link>
                            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                                {c.description ?? "No description"}
                            </p>
                            <div className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
                                Seats:{" "}
                                <span style={{ color: "var(--text)" }}>
                  {c.seats_remaining} / {c.seats_total}
                </span>
                            </div>
                        </div>
                    );
                })}

                {(data ?? []).length === 0 && !isLoading && (
                    <div
                        className="rounded-2xl border p-6 sm:col-span-2 lg:col-span-3"
                        style={{ background: "var(--panel)", borderColor: "var(--border)" }}
                    >
                        <p style={{ color: "var(--muted)" }}>
                            You haven’t registered for any courses yet.
                        </p>
                        <Link
                            href="/courses"
                            className="inline-block mt-3 underline"
                            style={{ color: "var(--accent)" }}
                        >
                            Browse courses
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}