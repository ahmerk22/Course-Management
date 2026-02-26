"use client";

import { useMemo, useState } from "react";
import { trpc } from "@/trpc/client";

export default function CoursesBrowseClient() {
    const [page, setPage] = useState(1);
    const pageSize = 6;

    const utils = trpc.useUtils();
    const [loadingCourseId, setLoadingCourseId] = useState<string | null>(null);

    const q = trpc.listCourses.useQuery({ page, pageSize });

    const enroll = trpc.enrollCourse.useMutation({
        onMutate: ({ courseId }) => setLoadingCourseId(courseId),
        onSettled: async () => {
            setLoadingCourseId(null);
            await utils.listCourses.invalidate();
            await utils.myCourses.invalidate();
        },
    });

    const totalPages = useMemo(() => {
        const total = q.data?.total ?? 0;
        return Math.max(1, Math.ceil(total / pageSize));
    }, [q.data?.total]);

    const enrolledSet = useMemo(() => {
        return new Set(q.data?.enrolledIds ?? []);
    }, [q.data?.enrolledIds]);

    if (q.isLoading) return <div>Loading...</div>;
    if (q.error) return <div>Error: {q.error.message}</div>;

    const items = q.data?.items ?? [];

    return (
        <div>
            <h1 className="text-3xl font-black">Browse courses</h1>
            <p className="mt-1" style={{ color: "var(--muted)" }}>
                Register before seats run out.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {items.map((c: any) => {
                    const isEnrolled = enrolledSet.has(c.id);
                    const isFull = (c.seats_remaining ?? 0) <= 0;

                    const isLoadingBtn = loadingCourseId === c.id;

                    let btnText = "Register";
                    if (isEnrolled) btnText = "Already registered";
                    else if (isFull) btnText = "Seats Full";
                    else if (isLoadingBtn) btnText = "Registering...";

                    return (
                        <div
                            key={c.id}
                            className="rounded-2xl border p-5 shadow-xl"
                            style={{ background: "var(--panel)", borderColor: "var(--border)" }}
                        >
                            <div className="text-xl font-bold">{c.title}</div>
                            <p className="mt-2" style={{ color: "var(--muted)" }}>
                                {c.description ?? "No description"}
                            </p>

                            <div className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
                                Seats: {c.seats_taken} / {c.seats_total}
                            </div>

                            <button
                                className="mt-4 w-full rounded-xl px-4 py-3 font-semibold"
                                style={{
                                    background: isEnrolled || isFull ? "var(--panel2)" : "var(--accent)",
                                    color: isEnrolled || isFull ? "var(--muted)" : "var(--accentText)",
                                    border: `1px solid var(--border)`,
                                }}
                                disabled={isEnrolled || isFull || isLoadingBtn}
                                onClick={() => enroll.mutate({ courseId: c.id })}
                            >
                                {btnText}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            <div
                className="mt-8 flex items-center justify-between rounded-xl border p-3"
                style={{ background: "var(--panel)", borderColor: "var(--border)" }}
            >
                <button
                    className="rounded-lg px-3 py-2 border"
                    style={{ borderColor: "var(--border)" }}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    Prev
                </button>

                <div style={{ color: "var(--muted)" }}>
                    Page <b style={{ color: "var(--text)" }}>{page}</b> of{" "}
                    <b style={{ color: "var(--text)" }}>{totalPages}</b>
                </div>

                <button
                    className="rounded-lg px-3 py-2 border"
                    style={{ borderColor: "var(--border)" }}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}