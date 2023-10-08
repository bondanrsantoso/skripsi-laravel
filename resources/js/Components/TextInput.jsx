import { forwardRef, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

export default forwardRef(function TextInput(
    {
        type = "text",
        className = "",
        isFocused = false,
        disabled = false,
        ...props
    },
    ref
) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <input
            {...props}
            disabled={disabled}
            type={type}
            className={twMerge(
                "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm bg-transparent dark:text-white ",
                className,
                disabled
                    ? "text-zinc-700 dark:text-zinc-400 cursor-not-allowed"
                    : ""
            )}
            ref={input}
        />
    );
});
