import Card from "@/Components/Card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Disclosure } from "@headlessui/react";
import { Head, Link } from "@inertiajs/react";

function SidebarLink({ href, children, className, active = false, ...props }) {
    return (
        <Link
            className={`${
                active ? "font-bold" : "font-normal opacity-50"
            } hover:opacity-100 ${className}`}
            href={href}
        >
            {children}
        </Link>
    );
}

function GameSidebar({ ...props }) {
    return (
        <div className="dark:text-white flex flex-col gap-3 max-h-screen overflow-auto sticky top-0">
            <Disclosure as="div" className="w-full" defaultOpen={true}>
                <Disclosure.Button className="py-2 font-bold text-left">
                    Gear (Uncertainty)
                </Disclosure.Button>
                <Disclosure.Panel>
                    <div className="border-l border-gray-700 dark:border-zinc-500 p-4 pt-1 flex flex-col gap-2">
                        <SidebarLink
                            active={route().current("gear_game_configs.index")}
                            href={route("gear_game_configs.index")}
                        >
                            Game Configuration
                        </SidebarLink>
                        <SidebarLink
                            active={route().current("gear_game_sessions.index")}
                            href={route("gear_game_sessions.index")}
                        >
                            Sessions
                        </SidebarLink>
                    </div>
                </Disclosure.Panel>
            </Disclosure>
            <Disclosure as="div" className="w-full" defaultOpen={true}>
                <Disclosure.Button className="py-2 font-bold text-left">
                    Mystery Box (Curiosity)
                </Disclosure.Button>
                <Disclosure.Panel>
                    <div className="border-l border-gray-700 dark:border-zinc-500 p-4 pt-1 flex flex-col gap-2">
                        <SidebarLink>Game Configuration</SidebarLink>
                        <SidebarLink
                            active={route().current(
                                "mystery_box_sessions.index"
                            )}
                            href={route("mystery_box_sessions.index")}
                        >
                            Sessions
                        </SidebarLink>
                    </div>
                </Disclosure.Panel>
            </Disclosure>
            <Disclosure as="div" className="w-full" defaultOpen={true}>
                <Disclosure.Button className="py-2 font-bold text-left">
                    Restaurant Service (Accountability)
                </Disclosure.Button>
                <Disclosure.Panel>
                    <div className="border-l border-gray-700 dark:border-zinc-500 p-4 pt-1 flex flex-col gap-2">
                        <SidebarLink
                            active={route().current(
                                "cooking_game_configs.index"
                            )}
                            href={route("cooking_game_configs.index")}
                        >
                            Game Configuration
                        </SidebarLink>
                        <SidebarLink
                            active={route().current(
                                "cooking_game_sessions.index"
                            )}
                            href={route("cooking_game_sessions.index")}
                        >
                            Sessions
                        </SidebarLink>
                    </div>
                </Disclosure.Panel>
            </Disclosure>
        </div>
    );
}

function GameManagerLayout({
    user,
    title = null,
    children,
    header = null,
    ...props
}) {
    return (
        <AuthenticatedLayout user={user} header={header}>
            <Head title={title || "Game Manager"} />
            <div className="grid grid-cols-1 lg:grid-cols-5 px-6 sm:px-8 py-12 max-w-screen-2xl mx-auto">
                <aside className="print:hidden">
                    {/* Sidebar menu */}
                    <GameSidebar></GameSidebar>
                </aside>
                <div className="lg:col-span-4 print:break-before-avoid">
                    {children}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default GameManagerLayout;
