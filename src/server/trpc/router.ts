import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const t = initTRPC.create({ transformer: superjson });

async function supabaseAuthed() {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    );
}

export const appRouter = t.router({
    // STUDENT: paginated browse
    listCourses: t.procedure
        .input(z.object({ page: z.number().min(1), pageSize: z.number().min(1).max(50) }))
        .query(async ({ input }) => {
            const supabase = await supabaseAuthed();
            const from = (input.page - 1) * input.pageSize;
            const to = from + input.pageSize - 1;

            const { data, count, error } = await supabase
                .from("courses_with_counts")
                .select("*", { count: "exact" })
                .order("created_at", { ascending: false })
                .range(from, to);

            if (error) throw new Error(error.message);
            return { items: data ?? [], total: count ?? 0 };
        }),

    // STUDENT: view course
    getCourse: t.procedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ input }) => {
            const supabase = await supabaseAuthed();
            const { data, error } = await supabase
                .from("courses_with_counts")
                .select("*")
                .eq("id", input.id)
                .single();

            if (error) throw new Error(error.message);
            return data;
        }),

    // STUDENT: enroll
    enrollCourse: t.procedure
        .input(z.object({ courseId: z.string().uuid() }))
        .mutation(async ({ input }) => {
            const supabase = await supabaseAuthed();
            const { error } = await supabase.rpc("enroll_course", { p_course_id: input.courseId });
            if (error) throw new Error(error.message);
            return { ok: true };
        }),

    // STUDENT: my courses
    myCourses: t.procedure.query(async () => {
        const supabase = await supabaseAuthed();
        const { data, error } = await supabase
            .from("enrollments")
            .select("course_id, created_at, courses_with_counts!inner(*)")
            .order("created_at", { ascending: false });

        if (error) throw new Error(error.message);
        return data ?? [];
    }),

    // ✅ MANAGER: show ALL my courses (old + new)
    managerCourses: t.procedure.query(async () => {
        const supabase = await supabaseAuthed();
        const { data: u, error: uErr } = await supabase.auth.getUser();
        if (uErr) throw new Error(uErr.message);
        if (!u.user) throw new Error("Not authenticated");

        const { data, error } = await supabase
            .from("courses")
            .select("id,title,description,seats_total,created_at,manager_id,user_id")
            .or(`manager_id.eq.${u.user.id},user_id.eq.${u.user.id}`)
            .order("created_at", { ascending: false });

        if (error) throw new Error(error.message);
        return data ?? [];
    }),

    // MANAGER: create course
    createCourse: t.procedure
        .input(
            z.object({
                title: z.string().min(1),
                description: z.string().optional(),
                seatsTotal: z.number().int().min(1),
            })
        )
        .mutation(async ({ input }) => {
            const supabase = await supabaseAuthed();
            const { data: u } = await supabase.auth.getUser();
            if (!u.user) throw new Error("Not authenticated");

            const { error } = await supabase.from("courses").insert({
                title: input.title,
                description: input.description ?? null,
                seats_total: input.seatsTotal,
                manager_id: u.user.id,
                user_id: u.user.id, // keeps old schema happy
            });

            if (error) throw new Error(error.message);
            return { ok: true };
        }),

    // MANAGER: update course
    updateCourse: t.procedure
        .input(
            z.object({
                id: z.string().uuid(),
                title: z.string().min(1),
                description: z.string().optional(),
                seatsTotal: z.number().int().min(1),
            })
        )
        .mutation(async ({ input }) => {
            const supabase = await supabaseAuthed();
            const { error } = await supabase
                .from("courses")
                .update({
                    title: input.title,
                    description: input.description ?? null,
                    seats_total: input.seatsTotal,
                })
                .eq("id", input.id);

            if (error) throw new Error(error.message);
            return { ok: true };
        }),

    // MANAGER: delete course
    deleteCourse: t.procedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ input }) => {
            const supabase = await supabaseAuthed();
            const { error } = await supabase.from("courses").delete().eq("id", input.id);
            if (error) throw new Error(error.message);
            return { ok: true };
        }),
});

export type AppRouter = typeof appRouter;