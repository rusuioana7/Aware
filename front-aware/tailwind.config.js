/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Belleza', 'sans-serif'],
            },
            colors: {
                navy: '#031A6B',
            },
        },
    },
    plugins: [],
}
