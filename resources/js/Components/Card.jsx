import { forwardRef, useRef } from "react";
import { twMerge } from "tailwind-merge";

function Card({ children, className = "", as = "div", ...props }, ref) {
    const cardRef = ref ? ref : useRef();
    const As = as;

    return (
        <As
            {...props}
            className={twMerge(
                "p-4 sm:p-8 bg-white dark:bg-gray-800 dark:text-white rounded-md shadow-lg dark:shadow-transparent print:shadow-none print:border",
                className
            )}
            ref={cardRef}
        >
            {children}
        </As>
    );
}

export default forwardRef(Card);
