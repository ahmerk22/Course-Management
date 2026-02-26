"use client";

import { trpc } from "@/trpc/client";
import { useState } from "react";

export default function MyCoursesClient() {
    const utils = trpc.useUtils();
    const [droppingId, setDroppingId] = useState<string | null>(null);

    const q = trpc.myCourses.useQuery();

    const drop = trpc.dropCourse.useMutation({
        onMutate: ({ courseId }) => setDroppingId(courseId),
        onSettled: async () => {
            setDroppingId(null);
            await utils.myCourses.invalidate();
            await utils.listCourses.invalidate(); // updates seat counts in browse
        },
    });

    if (q.isLoading) return <div>Loading...</div>;
    if (q.error) return <div>Error: {q.error.message}</div>;

    // your myCourses query returns rows like:
    // { course_id, created_at, courses_with_counts: {...} }
    const rows = q.data ?? [];

    return (
        <div>
            <h1 className="text-3xl font-black">My Courses</h1>
            <p className="mt-1" style={{ color: "var(--muted)" }}>
                Courses you registered for.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {rows.map((row: any) => {
                    const c = row.courses_with_counts;
                    if (!c) return null;

                    const isDropping = droppingId === c.id;

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
                                    background: "var(--panel2)",
                                    border: `1px solid var(--border)`,
                                    color: "var(--text)",
                                }}
                                disabled={isDropping}
                                onClick={() => drop.mutate({ courseId: c.id })}
                            >
                                {isDropping ? "Dropping..." : "Drop course"}
                            </button>
                        </div>
                    );
                })}
            </div>

            {rows.length === 0 && (
                <div
                    className="mt-6 rounded-2xl border p-6"
                    style={{ background: "var(--panel)", borderColor: "var(--border)" }}
                >
                    <p style={{ color: "var(--muted)" }}>You haven’t registered for any courses yet.</p>
                </div>
            )}
        </div>
    );
}