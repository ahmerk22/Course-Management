import ClientProviders from "@/components/ClientProviders";
import DashboardLayout from "@/components/DashboardLayout";
import { requireUser } from "@/lib/auth/require-user";
import { redirect } from "next/navigation";
import ManagerCreateCourseClient from "./ui/ManagerCreateCourseClient";

export default async function ManagerNewCoursePage() {
    const user = await requireUser();
    if (user.role !== "manager") redirect("/courses");

    return (
        <ClientProviders>
            <DashboardLayout userName={user.name} role={user.role}>
                <ManagerCreateCourseClient />
            </DashboardLayout>
        </ClientProviders>
    );
}