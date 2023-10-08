import { Link } from "@inertiajs/react";

export default function ResponsiveNavLink({
    active = false,
    className = "",
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`w-full flex items-start pl-3 pr-4 py-2 border-l-4 ${
                active
                    ? "border-indigo-400 text-indigo-700 bg-indigo-50 focus:text-indigo-800 focus:bg-indigo-100 focus:border-indigo-700 dark:text-white dark:border-indigo-50 dark:focus:border-indigo-200 dark:bg-transparent"
                    : "border-transparent text-gray-600 hover:text-gray-800  hover:border-gray-300 focus:text-gray-800 focus:border-gray-300 dark:text-gray-100 dark:hover:text-white dark:focus:text-white"
            } text-base font-medium focus:outline-none transition duration-150 ease-in-out ${className}`}
        >
            {children}
        </Link>
    );
}
