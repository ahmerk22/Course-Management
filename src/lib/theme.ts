export type ThemeMode = "dark" | "light";
const KEY = "cm_theme";

export function applyTheme(mode: ThemeMode) {
    if (typeof window === "undefined") return;

    // store
    localStorage.setItem(KEY, mode);

    // apply to <html>
    const root = document.documentElement;
    root.dataset.theme = mode;          // <html data-theme="dark|light">
    root.classList.toggle("dark", mode === "dark");
}

export function getTheme(): ThemeMode {
    if (typeof window === "undefined") return "dark";
    const saved = localStorage.getItem(KEY);
    return saved === "light" ? "light" : "dark";
}

export function toggleTheme(): ThemeMode {
    const next = getTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    return next;
}