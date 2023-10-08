import { useState, forwardRef, useRef } from "react";
import TextInput from "./TextInput";
import { twMerge } from "tailwind-merge";

export default forwardRef(function Password(
    { className = "", isFocused = false, ...props },
    ref
) {
    const input = ref ? ref : useRef();
    const [revealed, setRevealed] = useState(false);

    return (
        <div
            className={twMerge(
                "flex flex-row flex-nowrap items-stretch border-gray-300 shadow-sm rounded-md border " +
                    className
            )}
        >
            <input
                {...props}
                type={revealed ? "text" : "password"}
                className="w-full dark:text-white bg-transparent border-0 focus:border-indigo-500 focus:ring-indigo-500 rounded-md"
                ref={input}
            />
            <button
                type="button"
                className="px-4"
                onClick={() => setRevealed(!revealed)}
            >
                <i className={revealed ? "bi-eye-slash" : "bi-eye"} />
            </button>
        </div>
    );
});
