import { redirect } from "next/navigation";
import ClientProviders from "@/components/ClientProviders";
import DashboardLayout from "@/components/DashboardLayout";
import { requireUser } from "@/lib/auth/require-user";
import ManagerCoursesClient from "./ui/ManagerCoursesClient";

export default async function ManagerCoursesPage() {
    const user = await requireUser();
    if (user.role !== "manager") redirect("/courses");

    return (
        <ClientProviders>
            <DashboardLayout userName={user.name} role={user.role}>
                <ManagerCoursesClient />
            </DashboardLayout>
        </ClientProviders>
    );
}