export default function InputError({ message, className = "", ...props }) {
    const extractorRegex =
        /(?:[-a-zA-Z0-9@:%_\+~.#=]\.)?(?:[-a-zA-Z0-9@:%_\+~#=\.]*)\.[a-z]{0,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/g;

    return message ? (
        <p {...props} className={"text-sm text-red-600 " + className}>
            {message.replace(extractorRegex, "$1")}
        </p>
    ) : null;
}
