"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
    const r = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        setLoading(true);

        const res = await fetch("/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            setErr(data.error ?? "Signup failed");
            setLoading(false);
            return;
        }

        r.push("/courses");
        r.refresh();
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <form
                onSubmit={submit}
                className="w-full max-w-md rounded-2xl p-8 border shadow-xl"
                style={{ background: "var(--panel)", borderColor: "var(--border)" }}
            >
                <h1 className="text-2xl font-bold text-center">Create your account</h1>
                <p className="text-sm text-center mt-2" style={{ color: "var(--muted)" }}>
                    Student course registration made simple.
                </p>

                <div className="mt-6 space-y-3">
                    <input
                        className="w-full p-3 rounded-xl border outline-none"
                        style={{ background: "var(--panel2)", borderColor: "var(--border)" }}
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className="w-full p-3 rounded-xl border outline-none"
                        style={{ background: "var(--panel2)", borderColor: "var(--border)" }}
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        className="w-full p-3 rounded-xl border outline-none"
                        style={{ background: "var(--panel2)", borderColor: "var(--border)" }}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        disabled={loading}
                        className="w-full py-3 rounded-xl font-semibold active:scale-[0.98] disabled:opacity-60"
                        style={{ background: "var(--accent)", color: "var(--accentText)" }}
                    >
                        {loading ? "Creating..." : "Sign up"}
                    </button>

                    {err && <p className="text-sm text-center text-red-400">{err}</p>}
                </div>

                <p className="text-sm text-center mt-5" style={{ color: "var(--muted)" }}>
                    Already have an account?{" "}
                    <Link href="/signin" style={{ color: "var(--accent)" }}>
                        Sign in
                    </Link>
                </p>
            </form>
        </div>
    );
}