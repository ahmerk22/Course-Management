import { redirect } from "next/navigation";
import ClientProviders from "@/components/ClientProviders";
import DashboardLayout from "@/components/DashboardLayout";
import { requireUser } from "@/lib/auth/require-user";
import CoursesBrowseClient from "./ui/CoursesBrowseClient";

export default async function CoursesPage() {
    const user = await requireUser();
    if (user.role === "manager") redirect("/manager/courses");

    return (
        <ClientProviders>
            <DashboardLayout userName={user.name} role={user.role}>
                <CoursesBrowseClient />
            </DashboardLayout>
        </ClientProviders>
    );
}