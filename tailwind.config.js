import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";
import HeadlessUI from "@headlessui/tailwindcss";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        extend: {
            colors: {
                dim: "rgba(0,0,0,0.6)",
            },
            fontFamily: {
                sans: [
                    "Inter",
                    "Noto Color Emoji",
                    ...defaultTheme.fontFamily.sans,
                ],
            },
        },
    },

    plugins: [forms, HeadlessUI({ prefix: "ui" })],
};
