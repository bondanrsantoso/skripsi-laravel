export default function InputLabel({
    value,
    htmlFor,
    className = "",
    children,
    ...props
}) {
    return (
        <label
            {...props}
            htmlFor={htmlFor}
            className={
                `block font-medium text-sm text-gray-700 dark:text-white ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
