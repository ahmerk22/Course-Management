"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [dark, setDark] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        const isDark = saved ? saved === "dark" : true;
        setDark(isDark);
        document.documentElement.classList.toggle("dark", isDark);
    }, []);

    function toggle() {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle("dark", next);
        localStorage.setItem("theme", next ? "dark" : "light");
    }

    return (
        <button className="px-3 py-2 rounded-lg border" style={{ borderColor: "var(--border)" }} onClick={toggle}>
            {dark ? "🌙 Dark" : "☀️ Light"}
        </button>
    );
}