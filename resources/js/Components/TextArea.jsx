import { forwardRef, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

export default forwardRef(function TextInput(
    { className = "", isFocused = false, value = "", ...props },
    ref
) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <textarea
            {...props}
            className={twMerge(
                "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm bg-transparent dark:text-white resize-y " +
                    className
            )}
            ref={input}
            value={value}
        ></textarea>
    );
});
