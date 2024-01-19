import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import { twMerge } from "tailwind-merge";

export default function QuillEditor({
    value = "",
    onChange,
    placeholder = "",
    className = "",
    ...props
}) {
    return (
        <ReactQuill
            theme="bubble"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={twMerge("dark:!text-white", className)}
            {...props}
        />
    );
}
