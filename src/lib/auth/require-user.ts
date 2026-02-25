import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export async function requireUser() {
    const supabase = await supabaseServer();
    const { data } = await supabase.auth.getUser();
    if (!data.user) redirect("/signin");

    const { data: profile } = await supabase
        .from("profiles")
        .select("name, role")
        .eq("id", data.user.id)
        .single();

    return {
        id: data.user.id,
        email: data.user.email ?? null,
        name: profile?.name ?? (data.user.user_metadata?.name as string) ?? "User",
        role: (profile?.role as "student" | "manager") ?? "student",
    };
}