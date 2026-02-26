"use client";

import { useEffect, useState } from "react";
import { applyTheme, getTheme } from "@/lib/theme";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";

import { trpc } from "@/trpc/client";

function getTrpcUrl() {
    // Browser: relative works
    if (typeof window !== "undefined") return "/api/trpc";

    // SSR/build: absolute URL
    const vercel = process.env.VERCEL_URL;
    if (vercel) return `https://${vercel}/api/trpc`;

    return `http://localhost:${process.env.PORT ?? 3000}/api/trpc`;
}

export default function Providers({ children }: { children: React.ReactNode }) {
    // ✅ Apply stored theme once
    useEffect(() => {
        applyTheme(getTheme());
    }, []);

    const [queryClient] = useState(() => new QueryClient());

    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: getTrpcUrl(),
                    transformer: superjson, // ✅ moved here (required by your tRPC version)
                }),
            ],
        })
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </trpc.Provider>
    );
}