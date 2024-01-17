import { useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link } from "@inertiajs/react";
import { Menu } from "@headlessui/react";
import { twMerge } from "tailwind-merge";

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

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 dark:text-white">
            {/* <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <div className="mx-auto px-2">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="ml-3 relative"></div>
                        </div>

                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink
                            href={route("dashboard")}
                            active={route().current("dashboard")}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800 dark:text-gray-200">
                                {user.name}
                            </div>
                            <div className="font-medium text-sm text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav> */}

            {header && (
                <header className="bg-white dark:bg-gray-800 shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

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
                                            className="w-6 h-6"
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
                                {boards.map((board) => (
                                    <SidebarLink
                                        key={board.id}
                                        icon={<span className="bi-dot"></span>}
                                        href={route("boards.edit", {
                                            board: board.id,
                                        })}
                                    >
                                        <span className="truncate">
                                            {board.title || "Tanpa Judul"}
                                        </span>
                                    </SidebarLink>
                                ))}
                            </div>
                        </div>
                        <div className="col-span-12 lg:col-span-9 xl:col-span-10 bg-gray-100 dark:bg-gray-950">
                            <div className="max-w-5xl mx-auto mt-48 relative">
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
            <Link className="flex flex-row gap-2 items-baseline" href={href}>
                <div className="w-6 h-6 flex justify-center items-baseline">
                    {icon}
                </div>
                {children}
            </Link>
        </SidebarItem>
    );
}
