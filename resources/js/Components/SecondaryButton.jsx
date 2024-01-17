import { twMerge } from "tailwind-merge";

export default function SecondaryButton({
    type = "button",
    className = "",
    disabled,
    children,
    as = "button",
    ...props
}) {
    const As = as;
    return (
        <As
            {...props}
            type={type}
            className={twMerge(
                `cursor-pointer inline-flex text-center items-center px-4 py-2 bg-white border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150 bg-transparent dark:text-gray-100 dark:hover:bg-gray-700 border-0 ${
                    disabled && "opacity-25"
                } ` + className
            )}
            disabled={disabled}
        >
            {children}
        </As>
    );
}
