import ClientProviders from "@/components/ClientProviders";
import DashboardLayout from "@/components/DashboardLayout";
import { requireUser } from "@/lib/auth/require-user";
import { redirect } from "next/navigation";
import ManagerEditCourseClient from "./ui/ManagerEditCourseClient";

export default async function ManagerEditCoursePage({
                                                        params,
                                                    }: {
    params: Promise<{ id: string }>;
}) {
    const user = await requireUser();
    if (user.role !== "manager") redirect("/courses");

    const { id } = await params;

    return (
        <ClientProviders>
            <DashboardLayout userName={user.name} role={user.role}>
                <ManagerEditCourseClient courseId={id} />
            </DashboardLayout>
        </ClientProviders>
    );
}