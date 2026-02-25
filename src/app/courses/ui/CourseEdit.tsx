"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { trpc } from "@/trpc/client";

export default function CourseEdit({ id }: { id: string }) {
    const r = useRouter();

    const q = trpc.getCourse.useQuery({ id });
    const utils = trpc.useUtils();

    const m = trpc.updateCourse.useMutation({
        onSuccess: async () => {
            await utils.getCourse.invalidate({ id });
            r.push(`/courses/${id}`);
            r.refresh();
        },
    });

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [seatsTotal, setSeatsTotal] = useState(20);

    useEffect(() => {
        if (!q.data) return;
        setTitle(q.data.title ?? "");
        setDescription(q.data.description ?? "");
        setSeatsTotal(q.data.seats_total ?? 20);
    }, [q.data]);

    if (q.isLoading) return <div>Loading...</div>;
    if (q.error) return <div>Error: {q.error.message}</div>;
    if (!q.data) return <div>Not found</div>;

    return (
        <div className="max-w-xl rounded-2xl border p-5 shadow-xl"
             style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
            <h1 className="text-xl font-bold">Edit Course</h1>

            <form
                className="mt-4 grid gap-3"
                onSubmit={(e) => {
                    e.preventDefault();
                    m.mutate({ id, title, description, seatsTotal });
                }}
            >
                <input
                    className="w-full rounded-xl border px-3 py-2"
                    style={{ background: "var(--panel2)", borderColor: "var(--border)" }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                />

                <textarea
                    className="w-full rounded-xl border px-3 py-2"
                    style={{ background: "var(--panel2)", borderColor: "var(--border)" }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
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
                />

                <button
                    className="rounded-xl px-4 py-2 font-semibold"
                    style={{ background: "var(--accent)", color: "var(--accentText)" }}
                    disabled={m.isPending}
                    type="submit"
                >
                    {m.isPending ? "Saving..." : "Save changes"}
                </button>
            </form>
        </div>
    );
}