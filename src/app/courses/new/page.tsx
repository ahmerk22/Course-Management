import Link from "next/link";
import ClientProviders from "@/components/ClientProviders";
import DashboardLayout from "@/components/DashboardLayout";
import { requireUser } from "@/lib/auth/require-user";
import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function NewCoursePage() {
    const user = await requireUser();

    async function create(formData: FormData) {
        "use server";
        const title = String(formData.get("title") ?? "").trim();
        const description = String(formData.get("description") ?? "").trim();

        if (!title) return;

        const supabase = await supabaseServer();
        const { error } = await supabase.from("courses").insert({
            user_id: user.id,
            title,
            description: description || null,
        });

        if (error) throw new Error(error.message);

        redirect("/courses");
    }

    return (
        <ClientProviders>
            <DashboardLayout userEmail={user.email}>
                <div className="max-w-2xl">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">Create a new course</h1>
                            <p className="text-white/60 mt-1">
                                Add a title and optional description. You can edit it later.
                            </p>
                        </div>

                        <Link
                            href="/courses"
                            className="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/10"
                        >
                            Back
                        </Link>
                    </div>

                    {/* Card */}
                    <div className="mt-6 bg-[#2a2d38] border border-white/10 rounded-2xl p-6 shadow-xl">
                        <form action={create} className="space-y-5">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-white/80">
                                    Course title <span className="text-[#E63462]">*</span>
                                </label>
                                <input
                                    name="title"
                                    placeholder="e.g. Next.js Fundamentals"
                                    className="w-full p-3 rounded-xl bg-[#333745] border border-white/10 outline-none
                             focus:border-[#E63462] focus:ring-4 focus:ring-[#E63462]/20"
                                />
                                <p className="text-xs text-white/50 mt-2">
                                    Keep it short and clear.
                                </p>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-white/80">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    rows={6}
                                    placeholder="What will students learn in this course?"
                                    className="w-full p-3 rounded-xl bg-[#333745] border border-white/10 outline-none
                             focus:border-[#E63462] focus:ring-4 focus:ring-[#E63462]/20"
                                />
                                <p className="text-xs text-white/50 mt-2">
                                    Optional — add details for better clarity.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end pt-2">
                                <Link
                                    href="/courses"
                                    className="px-4 py-3 rounded-xl border border-white/15 hover:bg-white/10 text-center"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    className="px-5 py-3 rounded-xl bg-[#E63462] font-semibold hover:opacity-90 active:scale-[0.98]"
                                >
                                    Create course
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Tip card */}
                    <div className="mt-5 bg-white/5 border border-white/10 rounded-2xl p-4">
                        <p className="text-sm text-white/70">
                            Tip: After creating a course, you can edit it anytime from the courses list.
                        </p>
                    </div>
                </div>
            </DashboardLayout>
        </ClientProviders>
    );
}