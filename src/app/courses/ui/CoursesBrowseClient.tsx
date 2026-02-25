"use client";

import Link from "next/link";
import { trpc } from "@/trpc/client";
import { useMemo, useState } from "react";

export default function CoursesBrowseClient() {
    const pageSize = 6;
    const [page, setPage] = useState(1);
    const utils = trpc.useUtils();

    const { data, isLoading } = trpc.listCourses.useQuery({ page, pageSize });

    const enroll = trpc.enrollCourse.useMutation({
        onSuccess: async () => {
            await utils.listCourses.invalidate();
            await utils.myCourses.invalidate();
        },
    });

    const totalPages = useMemo(() => {
        const total = data?.total ?? 0;
        return Math.max(1, Math.ceil(total / pageSize));
    }, [data?.total]);

    return (
        <div>
            <div className="flex items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold">Browse courses</h1>
                    <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                        Register before seats run out.
                    </p>
                </div>
            </div>

            {/* Lazy loading skeletons */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {isLoading &&
                    Array.from({ length: pageSize }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border p-5"
                            style={{ background: "var(--panel)", borderColor: "var(--border)" }}
                        >
                            <div className="h-4 w-2/3 rounded bg-black/10 dark:bg-white/10" />
                            <div className="mt-3 h-3 w-full rounded bg-black/10 dark:bg-white/10" />
                            <div className="mt-2 h-3 w-4/5 rounded bg-black/10 dark:bg-white/10" />
                            <div className="mt-6 h-10 w-full rounded bg-black/10 dark:bg-white/10" />
                        </div>
                    ))}

                {(data?.items ?? []).map((c) => {
                    const full = (c.seats_remaining ?? 0) <= 0;
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

                            <div className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
                                Seats:{" "}
                                <span style={{ color: "var(--text)" }}>
                  {c.seats_remaining} / {c.seats_total}
                </span>
                            </div>

                            <button
                                disabled={full || enroll.isPending}
                                onClick={async () => {
                                    try {
                                        await enroll.mutateAsync({ courseId: c.id });
                                    } catch {
                                        // RPC throws "Seats full" etc. You can show toast if you want.
                                    }
                                }}
                                className="mt-5 w-full py-3 rounded-xl font-semibold active:scale-[0.98] disabled:opacity-60"
                                style={{
                                    background: full ? "color-mix(in srgb, var(--border) 70%, transparent)" : "var(--accent)",
                                    color: full ? "var(--muted)" : "var(--accentText)",
                                }}
                            >
                                {full ? "Seats Full" : enroll.isPending ? "Registering..." : "Register"}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-between">
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-4 py-2 rounded-lg border disabled:opacity-50"
                    style={{ borderColor: "var(--border)" }}
                >
                    Prev
                </button>

                <div className="text-sm" style={{ color: "var(--muted)" }}>
                    Page <b style={{ color: "var(--text)" }}>{page}</b> of{" "}
                    <b style={{ color: "var(--text)" }}>{totalPages}</b>
                </div>

                <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="px-4 py-2 rounded-lg border disabled:opacity-50"
                    style={{ borderColor: "var(--border)" }}
                >
                    Next
                </button>
            </div>
        </div>
    );
}