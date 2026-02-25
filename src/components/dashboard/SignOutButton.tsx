"use client";

import { useRouter } from "next/navigation";

export default function SignOutButton() {
    const r = useRouter();

    return (
        <button
            className="btn btn-ghost"
            onClick={async () => {
                await fetch("/auth/signout", { method: "POST" });
                r.push("/signin");
                r.refresh();
            }}
        >
            Sign out
        </button>
    );
}