/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Metropolis', 'sans-serif'],
            },
        },
        container: {
            center: true,
            padding: '10rem',
        },
    },
    plugins: [],
};
