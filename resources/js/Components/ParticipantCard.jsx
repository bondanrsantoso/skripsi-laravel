import { twMerge } from "tailwind-merge";
import ButtonLink from "./ButtonLink";

function ParticipantCard({
    participant,
    onClick = null,
    className = "",
    children,
    ...props
}) {
    return (
        <div
            {...props}
            onClick={onClick}
            className={twMerge(
                "p-6 bg-white dark:bg-gray-700 dark:text-white rounded-md shadow print:shadow-none print:border",
                className
            )}
        >
            <div className="flex gap-4">
                <img
                    src={participant.photo_url}
                    alt=""
                    className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex-grow">
                    <h3 className="text-lg font-bold inline-block">
                        {participant.name}
                    </h3>
                    <span className="inline-block px-3 rounded-full text-gray-700 bg-gray-200 ml-2 text-sm dark:text-zinc-300 dark:bg-gray-600">
                        {participant.pronouns}
                    </span>
                    <span className="text-gray-700 dark:text-zinc-400 block">
                        @{participant.username} &bull;{" "}
                        {!onClick ? (
                            <a
                                href={`mailto:${participant.email}`}
                                className="text-black dark:text-zinc-300 hover:underline"
                            >
                                {participant.email}
                            </a>
                        ) : (
                            <span className="text-black dark:text-zinc-300">
                                {participant.email}
                            </span>
                        )}
                    </span>
                    <div>{children}</div>
                </div>
            </div>
        </div>
    );
}

export default ParticipantCard;
