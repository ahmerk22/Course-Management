import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();

  // If logged in, send to courses
  if (data.user) redirect("/courses");

  // If not logged in, send to signin
  redirect("/signin");
}