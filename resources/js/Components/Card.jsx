import { twMerge } from "tailwind-merge";

export default function Card({ children, className = "", ...props }) {
    return (
        <div
            {...props}
            className={twMerge(
                "p-4 sm:p-8 bg-white dark:bg-gray-800 dark:text-white rounded-md shadow-lg dark:shadow-transparent print:shadow-none print:border",
                className
            )}
        >
            {children}
        </div>
    );
}
