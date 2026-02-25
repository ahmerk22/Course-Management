import { supabaseServer } from "@/lib/supabase/server";

export async function createTRPCContext() {
    const supabase = await supabaseServer();
    const { data } = await supabase.auth.getUser();
    return { supabase, user: data.user ?? null };
}
export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;