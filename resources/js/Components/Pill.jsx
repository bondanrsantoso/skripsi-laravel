import { twMerge } from "tailwind-merge";

function Pill({ className, children, as = "span", ...props }) {
    const As = as;
    return (
        <As
            {...props}
            className={twMerge(
                "bg-white-200 text-black rounded-full p-1 px-3 text-xs font-normal " +
                    className
            )}
        >
            {children}
        </As>
    );
}

export default Pill;
