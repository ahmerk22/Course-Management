/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            colors: {
                bg: "#272727",
                accent: "#FED766",
                panel: "#2f2f2f",
                border: "#3a3a3a",
            },
        },
    },
    plugins: [],
};