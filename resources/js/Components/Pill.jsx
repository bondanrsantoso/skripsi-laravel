import { twMerge } from "tailwind-merge";

function Pill({ className, children, ...props }) {
    return (
        <span
            className={twMerge(
                "bg-white-200 text-black rounded-full p-1 px-3 text-xs font-normal " +
                    className
            )}
        >
            {children}
        </span>
    );
}

export default Pill;
