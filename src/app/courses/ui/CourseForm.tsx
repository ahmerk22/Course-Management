"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { trpc } from "@/trpc/client";

export default function CourseForm({
                                       mode,
                                       id,
                                       initialTitle = "",
                                       initialDescription = "",
                                   }: {
    mode: "create" | "edit";
    id?: string;
    initialTitle?: string;
    initialDescription?: string;
}) {
    const r = useRouter();
    const utils = trpc.useUtils();

    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [err, setErr] = useState<string | null>(null);

    const create = trpc.course.create.useMutation({
        onSuccess: async (course) => {
            await utils.course.list.invalidate();
            r.push(`/courses/${course.id}`);
        },
        onError: (e) => setErr(e.message),
    });

    const update = trpc.course.update.useMutation({
        onSuccess: async () => {
            await utils.course.list.invalidate();
            if (id) r.push(`/courses/${id}`);
        },
        onError: (e) => setErr(e.message),
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                setErr(null);

                if (mode === "create") {
                    create.mutate({ title, description });
                } else {
                    update.mutate({ id: id!, title, description });
                }
            }}
            style={{ display: "grid", gap: 12, maxWidth: 520 }}
        >
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                rows={5}
            />
            <button type="submit" disabled={create.isPending || update.isPending}>
                {mode === "create" ? "Create" : "Save"}
            </button>
            {err && <p style={{ color: "crimson" }}>{err}</p>}
        </form>
    );
}