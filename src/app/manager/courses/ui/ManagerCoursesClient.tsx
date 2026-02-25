"use client";

import Link from "next/link";
import { trpc } from "@/trpc/client";

export default function ManagerCoursesClient() {
    const utils = trpc.useUtils();
    const { data, isLoading, error } = trpc.managerCourses.useQuery();

    const del = trpc.deleteCourse.useMutation({
        onSuccess: async () => {
            await utils.managerCourses.invalidate();
        },
    });

    return (
        <div>
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold">Manage Courses</h1>
                    <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                        Your courses.
                    </p>
                </div>

                <Link
                    href="/manager/courses/new"
                    className="px-4 py-2 rounded-xl font-semibold"
                    style={{ background: "var(--accent)", color: "var(--accentText)" }}
                >
                    + Create
                </Link>
            </div>

            {error && (
                <div
                    className="mt-5 rounded-xl border p-4"
                    style={{ background: "var(--panel)", borderColor: "var(--border)" }}
                >
                    <p className="font-semibold">Error loading manager courses</p>
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                        {error.message}
                    </p>
                </div>
            )}

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

                {(data ?? []).map((c: any) => (
                    <div
                        key={c.id}
                        className="rounded-2xl border p-5 shadow-xl"
                        style={{ background: "var(--panel)", borderColor: "var(--border)" }}
                    >
                        <div className="text-lg font-bold">{c.title}</div>

                        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                            {c.description ?? "No description"}
                        </p>

                        <div className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
                            Total seats:{" "}
                            <b style={{ color: "var(--text)" }}>{c.seats_total}</b>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <Link
                                href={`/manager/courses/${c.id}/edit`}
                                className="px-3 py-2 rounded-lg border"
                                style={{ borderColor: "var(--border)" }}
                            >
                                Edit
                            </Link>

                            <button
                                onClick={() => del.mutate({ id: c.id })}
                                className="px-3 py-2 rounded-lg border"
                                style={{ borderColor: "var(--border)" }}
                                disabled={del.isPending}
                            >
                                {del.isPending ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                ))}

                {(data ?? []).length === 0 && !isLoading && (
                    <div
                        className="rounded-2xl border p-6 sm:col-span-2 lg:col-span-3"
                        style={{ background: "var(--panel)", borderColor: "var(--border)" }}
                    >
                        <p style={{ color: "var(--muted)" }}>
                            No courses found for this manager.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}