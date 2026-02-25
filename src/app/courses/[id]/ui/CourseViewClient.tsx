"use client";

import Link from "next/link";
import { trpc } from "@/trpc/client";

export default function CourseViewClient({ courseId }: { courseId: string }) {
    const utils = trpc.useUtils();
    const { data: c, isLoading } = trpc.getCourse.useQuery({ id: courseId });
    const enroll = trpc.enrollCourse.useMutation({
        onSuccess: async () => {
            await utils.getCourse.invalidate({ id: courseId });
            await utils.listCourses.invalidate();
            await utils.myCourses.invalidate();
        },
    });

    if (isLoading) {
        return (
            <div className="rounded-2xl border p-6" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
                <div className="h-6 w-2/3 rounded bg-black/10 dark:bg-white/10" />
                <div className="mt-4 h-3 w-full rounded bg-black/10 dark:bg-white/10" />
                <div className="mt-2 h-3 w-4/5 rounded bg-black/10 dark:bg-white/10" />
            </div>
        );
    }

    if (!c) {
        return (
            <div className="rounded-2xl border p-6" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
                <div className="text-xl font-bold">Course not found</div>
                <Link className="inline-block mt-4 underline" href="/courses">
                    Back
                </Link>
            </div>
        );
    }

    const full = (c.seats_remaining ?? 0) <= 0;

    return (
        <div className="max-w-3xl">
            <Link href="/courses" className="text-sm underline" style={{ color: "var(--muted)" }}>
                ← Back to courses
            </Link>

            <div className="mt-4 rounded-2xl border p-6 shadow-xl" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
                <div className="text-2xl font-bold">{c.title}</div>
                <p className="mt-3 text-sm whitespace-pre-wrap" style={{ color: "var(--muted)" }}>
                    {c.description ?? "No description"}
                </p>

                <div className="mt-5 text-sm" style={{ color: "var(--muted)" }}>
                    Seats:{" "}
                    <span style={{ color: "var(--text)" }}>
            {c.seats_remaining} remaining / {c.seats_total} total
          </span>
                </div>

                <button
                    disabled={full || enroll.isPending}
                    onClick={async () => {
                        try {
                            await enroll.mutateAsync({ courseId });
                        } catch {}
                    }}
                    className="mt-6 w-full sm:w-auto px-6 py-3 rounded-xl font-semibold active:scale-[0.98] disabled:opacity-60"
                    style={{
                        background: full ? "color-mix(in srgb, var(--border) 70%, transparent)" : "var(--accent)",
                        color: full ? "var(--muted)" : "var(--accentText)",
                    }}
                >
                    {full ? "Seats Full" : enroll.isPending ? "Registering..." : "Register"}
                </button>
            </div>
        </div>
    );
}