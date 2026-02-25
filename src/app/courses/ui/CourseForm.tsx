"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { trpc } from "@/trpc/client";

export default function CourseForm() {
    const r = useRouter();
    const utils = trpc.useUtils();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [seatsTotal, setSeatsTotal] = useState(20);
    const [err, setErr] = useState<string | null>(null);

    const create = trpc.createCourse.useMutation({
        onSuccess: async () => {
            // refresh manager list
            await utils.managerCourses.invalidate();
            // go back to manager list (clean UX)
            r.push("/manager/courses");
            r.refresh();
        },
        onError: (e) => setErr(e.message),
    });

    return (
        <div
            className="max-w-xl rounded-2xl border p-5 shadow-xl"
            style={{ background: "var(--panel)", borderColor: "var(--border)" }}
        >
            <h1 className="text-xl font-bold">Create Course</h1>

            <form
                className="mt-4 grid gap-3"
                onSubmit={(e) => {
                    e.preventDefault();
                    setErr(null);
                    create.mutate({ title, description, seatsTotal });
                }}
            >
                <input
                    className="w-full rounded-xl border px-3 py-2"
                    style={{ background: "var(--panel2)", borderColor: "var(--border)" }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Course title"
                    required
                />

                <textarea
                    className="w-full rounded-xl border px-3 py-2"
                    style={{ background: "var(--panel2)", borderColor: "var(--border)" }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Course description"
                    rows={4}
                />

                <input
                    className="w-full rounded-xl border px-3 py-2"
                    style={{ background: "var(--panel2)", borderColor: "var(--border)" }}
                    type="number"
                    min={1}
                    value={seatsTotal}
                    onChange={(e) => setSeatsTotal(parseInt(e.target.value || "1", 10))}
                    placeholder="Total seats"
                    required
                />

                <button
                    type="submit"
                    className="rounded-xl px-4 py-2 font-semibold"
                    style={{ background: "var(--accent)", color: "var(--accentText)" }}
                    disabled={create.isPending}
                >
                    {create.isPending ? "Creating..." : "Create Course"}
                </button>

                {err && (
                    <p className="text-sm" style={{ color: "crimson" }}>
                        {err}
                    </p>
                )}
            </form>
        </div>
    );
}