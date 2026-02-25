import ClientProviders from "@/components/ClientProviders";
import DashboardLayout from "@/components/DashboardLayout";
import { requireUser } from "@/lib/auth/require-user";
import CourseViewClient from "./ui/CourseViewClient";

export default async function CourseViewPage({
                                                 params,
                                             }: {
    params: Promise<{ id: string }>;
}) {
    const user = await requireUser();
    const { id } = await params;

    return (
        <ClientProviders>
            <DashboardLayout userName={user.name} role={user.role}>
                <CourseViewClient courseId={id} />
            </DashboardLayout>
        </ClientProviders>
    );
}