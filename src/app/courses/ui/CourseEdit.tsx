"use client";

import { trpc } from "@/trpc/client";
import CourseForm from "./CourseForm";

export default function CourseEdit({ id }: { id: string }) {
    const q = trpc.course.byId.useQuery({ id });

    if (q.isLoading) return <main style={{ padding: 24 }}>Loading...</main>;
    if (q.error) return <main style={{ padding: 24 }}>Error: {q.error.message}</main>;

    return (
        <main style={{ padding: 24 }}>
            <h1>Edit Course</h1>
            <CourseForm
                mode="edit"
                id={id}
                initialTitle={q.data.title}
                initialDescription={q.data.description ?? ""}
            />
        </main>
    );
}