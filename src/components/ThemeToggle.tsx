"use client";

import { useEffect, useState } from "react";
import { applyTheme, getTheme, toggleTheme, ThemeMode } from "@/lib/theme";

export default function ThemeToggle() {
    const [theme, setThemeState] = useState<ThemeMode>("dark");

    useEffect(() => {
        const t = getTheme();
        setThemeState(t);
        applyTheme(t); // ensure <html> has correct theme on first load
    }, []);

    const label = theme === "dark" ? "Dark" : "Light";
    const icon = theme === "dark" ? "🌙" : "🌞";

    return (
        <button
            type="button"
            onClick={() => {
                const next = toggleTheme();
                setThemeState(next);
            }}
            className="flex items-center justify-center gap-2 rounded-xl border font-semibold"
            style={{
                background: "var(--panel2)",
                borderColor: "var(--border)",
                width: 110, // fixed width (no jump)
                height: 40, // fixed height
            }}
        >
            <span>{icon}</span>
            <span className="w-10 text-center">{label}</span>
        </button>
    );
}