"use client";

import Link from "next/link";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ManagerEditCourseClient({ courseId }: { courseId: string }) {
    const r = useRouter();
    const utils = trpc.useUtils();

    const { data: c, isLoading } = trpc.getCourse.useQuery({ id: courseId });
    const update = trpc.updateCourse.useMutation({
        onSuccess: async () => {
            await utils.managerCourses.invalidate();
            await utils.getCourse.invalidate({ id: courseId });
            r.push("/manager/courses");
            r.refresh();
        },
    });

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [seatsTotal, setSeatsTotal] = useState(20);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        if (c) {
            setTitle(c.title ?? "");
            setDescription(c.description ?? "");
            setSeatsTotal(Number(c.seats_total ?? 20));
        }
    }, [c]);

    if (isLoading) {
        return (
            <div className="rounded-2xl border p-6" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
                <div className="h-4 w-2/3 rounded bg-black/10 dark:bg-white/10" />
            </div>
        );
    }

    if (!c) return <div>Not found</div>;

    return (
        <div className="max-w-2xl">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Edit course</h1>
                    <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                        Update title, description, and total seats.
                    </p>
                </div>
                <Link href="/manager/courses" className="underline" style={{ color: "var(--muted)" }}>
                    Back
                </Link>
            </div>

            <div className="mt-6 rounded-2xl border p-6 shadow-xl" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
                <div className="space-y-4">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 rounded-xl border outline-none"
                        style={{ background: "var(--panel2)", borderColor: "var(--border)" }}
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={6}
                        className="w-full p-3 rounded-xl border outline-none"
                        style={{ background: "var(--panel2)", borderColor: "var(--border)" }}
                    />
                    <input
                        value={seatsTotal}
                        onChange={(e) => setSeatsTotal(Number(e.target.value))}
                        type="number"
                        min={1}
                        className="w-full p-3 rounded-xl border outline-none"
                        style={{ background: "var(--panel2)", borderColor: "var(--border)" }}
                    />

                    <button
                        className="px-5 py-3 rounded-xl font-semibold active:scale-[0.98] disabled:opacity-60"
                        style={{ background: "var(--accent)", color: "var(--accentText)" }}
                        disabled={update.isPending}
                        onClick={async () => {
                            setErr(null);
                            try {
                                await update.mutateAsync({
                                    id: courseId,
                                    title: title.trim(),
                                    description: description.trim() || undefined,
                                    seatsTotal,
                                });
                            } catch (e: any) {
                                setErr(e?.message ?? "Failed");
                            }
                        }}
                    >
                        {update.isPending ? "Saving..." : "Save"}
                    </button>

                    {err && <div className="text-sm text-red-400">{err}</div>}
                </div>
            </div>
        </div>
    );
}