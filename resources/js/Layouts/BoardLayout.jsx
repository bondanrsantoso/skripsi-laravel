import { useEffect, useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link } from "@inertiajs/react";
import { Menu } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import SecondaryButton from "@/Components/SecondaryButton";
import axios from "axios";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/esm/plugin/localizedFormat";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import QuillEditor from "@/Components/QuillEditor";
import Spinner from "@/Components/Spinner";
import DOMPurify from "dompurify";

dayjs.extend(LocalizedFormat);

// window.DOMPurify = DOMPurify;

const ROLE_HUMAN = "human";
const ROLE_AI = "ai";

function ChatView({ user, activeBoardId = null, ...props }) {
    const [chatInstances, setChatInstances] = useState([]);
    const [selectedInstances, setSelectedInstances] = useState(null);

    const [chatMessages, setChatMessages] = useState([]);
    const [showChat, setShowChat] = useState(false);

    const [userChat, setUserChat] = useState("");

    const [isSendingChat, setIsSendingChat] = useState(false);
    const [isWaitingForAnswer, setIsWaitingForAnswer] = useState(false);

    useEffect(() => {
        if (selectedInstances === null) {
            axios.get(route("chat_instances.index")).then((res) => {
                console.log(res.data);
                setChatInstances(res.data?.data || []);
            });
        }
    }, [selectedInstances]);

    function createNewInstance() {
        axios
            .post(
                route("chat_instances.store"),
                {},
                {
                    withCredentials: true,
                    headers: { Accept: "application/json" },
                }
            )
            .then((res) => {
                setSelectedInstances(res.data);
            });
    }

    useEffect(() => {
        if (selectedInstances) {
            axios
                .get(
                    route("chat_instances.chat_messages.index", {
                        chat_instance: selectedInstances.id,
                    }),
                    { withCredentials: true }
                )
                .then((res) => {
                    console.log(res.data);
                    setChatMessages(res.data);
                });
        }
    }, [selectedInstances]);

    function sendChat() {
        setIsSendingChat(true);
        axios
            .post(
                route("chat_instances.chat_messages.store", {
                    chat_instance: selectedInstances.id,
                }),
                { content: userChat, role: ROLE_HUMAN },
                {
                    withCredentials: true,
                    headers: { Accept: "application/json" },
                }
            )
            .then((res) => {
                const sentMessage = res.data;
                const messages = chatMessages.slice(0);
                messages.push(sentMessage);

                setChatMessages(messages);
                setUserChat("");
            })
            .finally(() => {
                setIsSendingChat(false);
                setIsWaitingForAnswer(true);
            });
    }

    useEffect(() => {
        if (
            chatMessages.length > 0 &&
            chatMessages[chatMessages.length - 1].role === ROLE_HUMAN &&
            isWaitingForAnswer
        ) {
            axios
                .post(
                    route("chat.answer", { instance: selectedInstances.id }),
                    { board_id: activeBoardId },
                    {
                        withCredentials: true,
                        headers: { Accept: "application/json" },
                    }
                )
                .then((res) => {
                    const messages = chatMessages.slice(0);
                    messages.push(res.data);

                    setChatMessages(messages);
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    setIsWaitingForAnswer(false);
                });
        }
    }, [isWaitingForAnswer, chatMessages]);

    return (
        <aside className="fixed bg-white dark:bg-gray-800 bottom-0 right-10 z-10 w-full md:w-1/2 2xl:w-1/3">
            <SecondaryButton
                type="button"
                className="border border-b-0 rounded-b-none rounded-t-lg w-full flex flex-row gap-2 items-baseline text-sm"
                onClick={() => {
                    setShowChat((on) => !on);
                }}
            >
                <i className="bi-chat"></i>
                <p>AI Chat</p>
            </SecondaryButton>
            {showChat && selectedInstances && (
                <div className="w-full border-x border-t border-gray-300 p-4 relative space-y-4">
                    <div className="min-h-[40vh] max-h-[80vh] flex flex-col justify-end overflow-y-scroll gap-4">
                        {chatMessages.map((chat, iChat) =>
                            chat.role === ROLE_AI ? (
                                <div
                                    key={iChat}
                                    className="px-2 border-s-4 border-pink-500"
                                >
                                    <div className="space-y-1">
                                        <div className="flex flex-row gap-4">
                                            <div className="capitalize text-pink-700 dark:text-pink-300 text-sm font-bold">
                                                AI
                                            </div>
                                            <div className="text-xs opacity-50">
                                                {dayjs(chat.created_at).format(
                                                    "lll"
                                                )}
                                            </div>
                                        </div>
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: DOMPurify.sanitize(
                                                    chat.content
                                                ),
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    key={iChat}
                                    className="flex flex-row px-2 border-s-4 border-gray-500"
                                >
                                    <div className="space-y-1">
                                        <div className="flex flex-row gap-4 items-end">
                                            <div className="capitalize text-gray-700 dark:text-gray-300 text-sm font-bold flex flex-row items-center gap-2">
                                                <img
                                                    src={user.photo_url}
                                                    alt={user.name}
                                                    className="rounded-full w-6 h-6"
                                                />
                                                <p>{user.name}</p>
                                            </div>
                                            <div className="text-xs opacity-50">
                                                {dayjs(chat.created_at).format(
                                                    "lll"
                                                )}
                                            </div>
                                        </div>
                                        <p>{chat.content}</p>
                                    </div>
                                </div>
                            )
                        )}
                        {isWaitingForAnswer && (
                            <div className="flex flex-row px-2 border-s-4 border-gray-500">
                                <div className="space-y-1">
                                    <div className="flex flex-row gap-4 items-end">
                                        <div className="capitalize text-gray-700 dark:text-gray-300 text-sm font-bold flex flex-row items-center gap-2">
                                            <p>System</p>
                                        </div>
                                    </div>
                                    <p>Menunggu jawaban...</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="w-full px-4 pb-2 gap-4 flex flex-row items-stretch">
                        <SecondaryButton
                            type="button"
                            className="rounded-full border border-gray-300"
                            onClick={() => {
                                setSelectedInstances(null);
                                setChatMessages([]);
                            }}
                        >
                            <i className="bi-chevron-left"></i>
                        </SecondaryButton>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();

                                sendChat();
                            }}
                            className="w-full flex flex-row flex-nowrap gap-4"
                            id="chat-form"
                        >
                            <TextInput
                                value={userChat}
                                onChange={(e) => setUserChat(e.target.value)}
                                className="w-full rounded-md border border-gray-300"
                                disabled={isSendingChat}
                            />
                        </form>
                        <PrimaryButton
                            type="submit"
                            className="rounded-full"
                            form="chat-form"
                            disabled={isSendingChat}
                        >
                            {/* <i className="bi-send text-lg"></i> */}
                            {isSendingChat ? <Spinner /> : <span>Kirim</span>}
                        </PrimaryButton>
                    </div>
                </div>
            )}
            {showChat && selectedInstances === null && (
                <div className="w-full border-x border-t border-gray-300">
                    {(!chatInstances || chatInstances.length === 0) && (
                        <div className="p-4 opacity-75">
                            Belum ada <i>chat</i> tersimpan.
                        </div>
                    )}
                    {chatInstances.map((instance, iInstance) => (
                        <SecondaryButton
                            type="button"
                            key={iInstance}
                            onClick={() => setSelectedInstances(instance)}
                            className="text-left w-full rounded-none flex gap-2"
                        >
                            <p># </p>
                            <p className="truncate">
                                {instance.title ||
                                    dayjs(instance.created_at).format("LLL")}
                            </p>
                        </SecondaryButton>
                    ))}

                    <SecondaryButton
                        type="button"
                        onClick={() => {
                            createNewInstance();
                        }}
                        className="text-left w-full rounded-none flex gap-2"
                    >
                        <i className="bi-plus-lg"></i>
                        <p className="truncate">
                            Mulai <i>chat</i> baru
                        </p>
                    </SecondaryButton>
                </div>
            )}
        </aside>
    );
}

export default function BoardLayout({
    user,
    header,
    boards = [],
    selectedBoard = null,
    syncing = false,
    children,
    ...props
}) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const [boardList, setBoardList] = useState([]);

    useEffect(() => {
        if (boards.length === 0) {
            axios
                .get(route("boards.index"), {
                    withCredentials: true,
                    headers: { Accept: "application/json" },
                })
                .then((res) => {
                    setBoardList(res.data);
                });
        }
    }, [boards]);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 dark:text-white">
            {header && (
                <header className="bg-white dark:bg-gray-800 shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <ChatView user={user} activeBoardId={selectedBoard?.id} />

            <main>
                <div className="w-full mx-auto">
                    <div className="w-full grid grid-cols-12 gap-4">
                        <div className="fixed lg:relative lg:col-span-3 xl:col-span-2 h-screen lg:min-h-screen lg:h-full bg-gray-50 dark:bg-gray-900">
                            <div className="sticky top-0 py-2 space-y-1">
                                <Menu>
                                    <Menu.Button
                                        as="button"
                                        className="opacity-75 px-4 mx-1 w-full text-start ui-open:bg-gray-50 ui-open:dark:bg-gray-800 py-1 flex flex-row gap-2 items-center"
                                    >
                                        <img
                                            src={user.photo_url}
                                            alt={user.name}
                                            className="w-6 h-6 object-cover object-center border border-gray-300 rounded-full"
                                        />
                                        <p className="truncate text-sm">
                                            {user.name}
                                        </p>
                                        <span className="ml-auto bi-chevron-down"></span>
                                    </Menu.Button>
                                    <Menu.Items className="absolute -right-5 mt-2 w-full rounded-sm ring-2 ring-gray-50 dark:ring-gray-800 p-2 bg-gray-100 dark:bg-gray-800 space-y-1 text-sm z-50">
                                        <Menu.Item
                                            as={Link}
                                            href={route("profile.edit")}
                                            className="block px-2 py-1 hover:dark:bg-gray-600 hover:bg-gray-200 rounded-sm"
                                        >
                                            <span className="opacity-75">
                                                Profile
                                            </span>
                                        </Menu.Item>
                                        <Menu.Item
                                            href={route("logout")}
                                            method="post"
                                            as={Link}
                                            className="block px-2 py-1 hover:dark:bg-gray-600 hover:bg-gray-200 rounded-sm"
                                        >
                                            <span className="opacity-75">
                                                Log Out
                                            </span>
                                        </Menu.Item>
                                    </Menu.Items>
                                </Menu>
                                {/* <hr className="border-gray-300" /> */}
                                <SidebarLink
                                    icon={<span className="bi-search"></span>}
                                    href="#"
                                >
                                    <span className="truncate">Cari</span>
                                </SidebarLink>
                                <SidebarLink
                                    icon={
                                        <span className="bi-plus-circle"></span>
                                    }
                                    href={route("boards.create")}
                                >
                                    <span className="truncate">
                                        Tambah baru
                                    </span>
                                </SidebarLink>
                                {(boards.length === 0 ? boardList : boards).map(
                                    (board) => (
                                        <SidebarLink
                                            key={board.id}
                                            icon={
                                                <span className="bi-dot"></span>
                                            }
                                            href={route("boards.edit", {
                                                board: board.id,
                                            })}
                                        >
                                            <span className="truncate">
                                                {board.title || "Tanpa Judul"}
                                            </span>
                                        </SidebarLink>
                                    )
                                )}
                            </div>
                        </div>
                        <div className="col-span-12 lg:col-span-9 xl:col-span-10 bg-gray-100 dark:bg-gray-950">
                            <div className="max-w-5xl mx-auto my-48 relative pr-4">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div
                className={twMerge(
                    "fixed bottom-10 right-10 flex items-center justify-center bg-white dark:bg-black w-12 h-12 rounded-full",
                    syncing ? "opacity-100" : "opacity-0"
                )}
            >
                <div className="w-6 h-6 rounded-full border-4 border-r-gray-500 border-t-gray-500 border-b-gray-500 animate-spin"></div>
            </div>
        </div>
    );
}

function SidebarItem({ children, className = "", ...props }) {
    return (
        <div
            className={twMerge(
                "opacity-75 text-sm px-4 py-1 rounded-sm hover:bg-gray-200 hover:dark:bg-gray-700 mx-1",
                className
            )}
        >
            {children}
        </div>
    );
}

function SidebarLink({
    href,
    children,
    className = "",
    icon = null,
    ...props
}) {
    return (
        <SidebarItem className={className}>
            <Link
                className="flex flex-row gap-2 justify-start items-baseline"
                href={href}
            >
                <div className="w-6 h-6 shrink-0 flex justify-center items-baseline">
                    {icon}
                </div>
                {children}
            </Link>
        </SidebarItem>
    );
}
