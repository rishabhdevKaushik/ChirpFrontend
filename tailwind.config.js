/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            backgroundImage: {
                "dark-background": "url('../public/DarkBackground.svg')",
            },
            animation: {
                "fade-in-down": "fadeInDown 0.5s ease-out",
                "fade-in": "fadeIn 0.5s ease-out",
            },
            keyframes: {
                fadeInDown: {
                    "0%": {
                        opacity: "0",
                        transform: "translateY(-10px)",
                    },
                    "100%": {
                        opacity: "1",
                        transform: "translateY(0)",
                    },
                },
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
            },
            colors: {
                primary: {
                    DEFAULT: "var(--primary)",
                    light: "var(--primary-light)",
                    dark: "var(--primary-dark)",
                },
                secondary: {
                    DEFAULT: "var(--secondary)",
                    light: "var(--secondary-light)",
                    dark: "var(--secondary-dark)",
                },
                background: "var(--background)",
                surface: "var(--surface)",
                accent: "var(--accent)",
                muted: "var(--muted)",
            },
            textColor: {
                primary: "var(--text-primary)",
                secondary: "var(--text-secondary)",
                muted: "var(--text-muted)",
                dark: "var(--text-dark)",
            },
        },
    },
    variants: {},
    plugins: [],
};
