import { supabaseServer } from "@/lib/supabase/server";

export async function db() {
    const supabase = await supabaseServer();
    return supabase;
}