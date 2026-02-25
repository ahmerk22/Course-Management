import ClientProviders from "@/components/ClientProviders";
import DashboardLayout from "@/components/DashboardLayout";
import { requireUser } from "@/lib/auth/require-user";
import MyCoursesClient from "./ui/MyCoursesClient";

export default async function MyCoursesPage() {
    const user = await requireUser();

    return (
        <ClientProviders>
            <DashboardLayout userName={user.name} role={user.role}>
                <MyCoursesClient />
            </DashboardLayout>
        </ClientProviders>
    );
}