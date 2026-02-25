import Link from "next/link";
import ClientProviders from "@/components/ClientProviders";
import DashboardLayout from "@/components/DashboardLayout";
import { requireUser } from "@/lib/auth/require-user";
import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function EditCoursePage({
                                                 params,
                                             }: {
    params: Promise<{ id: string }>;
}) {
    const user = await requireUser();
    const { id } = await params;

    const supabase = await supabaseServer();
    const { data: course } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

    if (!course) redirect("/courses");

    async function update(formData: FormData) {
        "use server";
        const title = String(formData.get("title") ?? "").trim();
        const description = String(formData.get("description") ?? "").trim();
        if (!title) return;

        const supabase2 = await supabaseServer();
        const { error } = await supabase2
            .from("courses")
            .update({ title, description: description || null })
            .eq("id", id)
            .eq("user_id", user.id);

        if (error) throw new Error(error.message);

        redirect(`/courses/${id}`);
    }

    return (
        <ClientProviders>
            <DashboardLayout userName={user.name} role={user.role}>
                <div className="max-w-xl bg-[#2f2f2f] border border-white/10 rounded-2xl p-5 shadow-xl">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-black">Edit Course</h1>
                        <Link
                            href={`/courses/${id}`}
                            className="px-3 py-2 rounded-xl border border-white/15 hover:bg-white/5"
                        >
                            Back
                        </Link>
                    </div>

                    <form action={update} className="space-y-3 mt-4">
                        <input
                            name="title"
                            defaultValue={course.title}
                            className="w-full p-3 rounded-xl bg-[#242424] border border-white/10 outline-none focus:border-[#FED766]/70 focus:ring-4 focus:ring-[#FED766]/15"
                        />
                        <textarea
                            name="description"
                            defaultValue={course.description ?? ""}
                            rows={6}
                            className="w-full p-3 rounded-xl bg-[#242424] border border-white/10 outline-none focus:border-[#FED766]/70 focus:ring-4 focus:ring-[#FED766]/15"
                        />
                        <button className="bg-[#FED766] text-[#272727] px-4 py-2 rounded-xl font-semibold hover:scale-[1.02] active:scale-[0.98]">
                            Save
                        </button>
                    </form>
                </div>
            </DashboardLayout>
        </ClientProviders>
    );
}