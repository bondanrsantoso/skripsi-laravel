import { forwardRef, useRef } from "react";
import { twMerge } from "tailwind-merge";

export default forwardRef(function PrimaryButton(
    { className = "", disabled, children, ...props },
    ref
) {
    const button = ref ? ref : useRef();
    return (
        <button
            {...props}
            className={twMerge(
                `inline-flex items-center px-4 py-2 bg-gray-900 border border-transparent dark:border-gray-500 rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 ${
                    disabled && "opacity-25"
                } ` + className
            )}
            disabled={disabled}
            ref={button}
        >
            {children}
        </button>
    );
});
