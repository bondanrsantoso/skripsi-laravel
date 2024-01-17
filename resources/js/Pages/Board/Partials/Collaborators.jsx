import Card from "@/Components/Card";
import DangerButton from "@/Components/DangerButton";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import Select from "@/Components/Select";
import TextInput from "@/Components/TextInput";
import { Combobox } from "@headlessui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

let userSearchTimeout;

export default function CollaboratorEditor({
    users = [],
    myself,
    onChange,
    className,
    ...props
}) {
    const roleLabels = ["Hanya lihat", "Editor"];
    const [userList, setUserList] = useState(users);
    const [userSearch, setUserSearch] = useState("");
    const [searchedUsers, setSearchedUsers] = useState([]);

    useEffect(() => {
        clearTimeout(userSearchTimeout);

        userSearchTimeout = setTimeout(() => {
            axios
                .get(
                    route("users.index", {
                        pageSize: 999,
                        search: userSearch,
                    }),
                    {
                        withCredentials: true,
                        headers: { Accept: "application/json" },
                    }
                )
                .then((res) => {
                    if (res.data && res.data.data && res.data.data.length) {
                        setSearchedUsers(
                            res.data.data.filter(
                                (d) =>
                                    ![...(userList || [])].some(
                                        (existing) => existing.id === d.id
                                    )
                            )
                        );
                    } else {
                        setSearchedUsers([]);
                    }
                });
        }, 500);
    }, [userSearch]);

    useEffect(() => {
        setSearchedUsers(
            searchedUsers.filter(
                (d) =>
                    ![...(userList || [])].some(
                        (existing) => existing.id === d.id
                    )
            )
        );
    }, [userList]);

    function setRole(i, value) {
        const users = userList.slice(0);
        users[i].pivot.role = value;

        setUserList(users);
    }

    return (
        <Card className={twMerge("w-full max-w-5xl", className)}>
            <div className="space-y-10">
                <h1 className="text-xl font-bold">Akses Pengguna</h1>
                <div>
                    <Combobox
                        className="relative"
                        as="div"
                        onChange={(user) => {
                            const users = userList.slice(0);
                            if (!users.find((u) => u.id === user.id)) {
                                users.push({ ...user, pivot: { role: 0 } });

                                setUserList(users);
                            }
                        }}
                    >
                        <Combobox.Input
                            as={TextInput}
                            onChange={(e) => setUserSearch(e.target.value)}
                            className="w-full"
                            placeholder="Cari Pengguna..."
                        />

                        <Combobox.Button className="absolute inset-y-0 right-3">
                            <i className="bi-chevron-expand"></i>
                        </Combobox.Button>
                        <Combobox.Options className="absolute mt-2 max-h-60 w-full overflow-auto z-20">
                            {searchedUsers.map((member) => (
                                <Combobox.Option
                                    className="relative p-4 bg-white ui-selected:font-bold ui-active:bg-gray-300 dark:bg-gray-800 ui-active:dark:bg-gray-600"
                                    key={member.id}
                                    value={member}
                                >
                                    {member.name} ({member.email})
                                </Combobox.Option>
                            ))}
                        </Combobox.Options>
                    </Combobox>
                </div>
                <table className="table-auto w-full">
                    <thead>
                        <tr className="border-b border-gray-300">
                            <th className="p-2">Nama</th>
                            <th className="p-2">Akses</th>
                            <th className="p-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList.map((user, iUser) => (
                            <tr
                                className="even:bg-gray-200 dark:even:bg-gray-700"
                                key={user.id}
                            >
                                <td className="p-2">
                                    {user.name}{" "}
                                    {user.id === myself.id ? "(Anda)" : ""}
                                </td>
                                <td className="p-2">
                                    <Select
                                        className="w-full"
                                        disabled={user.id === myself.id}
                                        value={user.pivot.role}
                                        onChange={(e) => {
                                            setRole(iUser, e.target.value);
                                        }}
                                    >
                                        {roleLabels.map((role, iRole) => (
                                            <option
                                                className="text-black"
                                                key={iRole}
                                                value={iRole}
                                            >
                                                {role}
                                            </option>
                                        ))}
                                    </Select>
                                </td>
                                <td className="p-2">
                                    <div className="flex flex-row justify-end">
                                        <DangerButton
                                            type="button"
                                            onClick={() => {
                                                const users = userList.slice(0);
                                                users.splice(iUser, 1);

                                                setUserList(users);
                                            }}
                                            disabled={user.id === myself.id}
                                        >
                                            <i className="bi-trash"></i>
                                        </DangerButton>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-start flex-row-reverse gap-2">
                    <PrimaryButton
                        type="button"
                        onClick={() => {
                            onChange(userList);
                        }}
                    >
                        Simpan Perubahan
                    </PrimaryButton>
                    <SecondaryButton
                        type="button"
                        onClick={() => {
                            onChange(users);
                        }}
                    >
                        Batal
                    </SecondaryButton>
                </div>
            </div>
        </Card>
    );
}
