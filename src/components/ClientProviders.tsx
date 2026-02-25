"use client";
import Providers from "@/app/providers";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return <Providers>{children}</Providers>;
}