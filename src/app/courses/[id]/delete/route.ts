import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await requireUser();
    const { id } = await params;

    const supabase = await supabaseServer();
    await supabase.from("courses").delete().eq("id", id).eq("user_id", user.id);

    return NextResponse.redirect(new URL("/courses", "http://127.0.0.1:3000"));
}