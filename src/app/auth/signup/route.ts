import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    const { name, email, password } = await req.json();
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => cookieStore.getAll(),
                setAll: (cookiesToSet) => cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
            },
        }
    );

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    // profile is created automatically by DB trigger
    return NextResponse.json({ success: true });
}