import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const courseRouter = router({
    list: protectedProcedure
        .input(
            z.object({
                page: z.number().int().min(1).default(1),
                pageSize: z.number().int().min(1).max(50).default(10),
            })
        )
        .query(async ({ ctx, input }) => {
            const from = (input.page - 1) * input.pageSize;
            const to = from + input.pageSize - 1;

            const { data, error, count } = await ctx.supabase
                .from("courses")
                .select("*", { count: "exact" })
                .order("created_at", { ascending: false })
                .range(from, to);

            if (error) throw error;

            return {
                items: data ?? [],
                total: count ?? 0,
                page: input.page,
                pageSize: input.pageSize,
                totalPages: Math.max(1, Math.ceil((count ?? 0) / input.pageSize)),
            };
        }),

    byId: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            const { data, error } = await ctx.supabase
                .from("courses")
                .select("*")
                .eq("id", input.id)
                .single();

            if (error) throw error;
            return data;
        }),

    create: protectedProcedure
        .input(z.object({ title: z.string().min(1), description: z.string().optional() }))
        .mutation(async ({ ctx, input }) => {
            const { data, error } = await ctx.supabase
                .from("courses")
                .insert({
                    user_id: ctx.user!.id,
                    title: input.title,
                    description: input.description ?? null,
                })
                .select("*")
                .single();

            if (error) throw error;
            return data;
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string().uuid(),
                title: z.string().min(1),
                description: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { data, error } = await ctx.supabase
                .from("courses")
                .update({
                    title: input.title,
                    description: input.description ?? null,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", input.id)
                .select("*")
                .single();

            if (error) throw error;
            return data;
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const { error } = await ctx.supabase.from("courses").delete().eq("id", input.id);
            if (error) throw error;
            return { ok: true };
        }),
});