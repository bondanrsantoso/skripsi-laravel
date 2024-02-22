import Card from "@/Components/Card";
import InputLabel from "@/Components/InputLabel";
import Pill from "@/Components/Pill";
import PrimaryButton from "@/Components/PrimaryButton";
import QuillEditor from "@/Components/QuillEditor";
import SecondaryButton from "@/Components/SecondaryButton";
import Select from "@/Components/Select";
import TextInput from "@/Components/TextInput";
import { Combobox } from "@headlessui/react";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

let userSearchTimeout;

export default function TaskEditor({
    task = null,
    statuses = [],
    priorities = [],
    defaultUser,
    boardId,
    className,
    onClose,
    onSubmit,
}) {
    const [assignee, setAssignee] = useState(
        task?.assignee || (defaultUser ? [defaultUser] : [])
    );

    const [peopleInCharge, setPeopleInCharge] = useState(
        task?.people_in_charge || []
    );

    const { data, setData, post, put, processing, recentlySuccessful } =
        useForm({
            title: task?.title || "",
            description: task?.description || "",
            status: task?.status || 0,
            is_confirmed: task?.is_confirmed || false,
            priority: task?.priority || 0,
            due_start: task?.due_start || null,
            due_end: task?.due_end || null,
            board_id: task?.board_id || boardId,
            assignee: assignee.map((a) => a.id),
            people_in_charge: peopleInCharge.map((p) => p.id),
        });

    useEffect(() => {
        setData(
            "people_in_charge",
            peopleInCharge.map((p) => p.id)
        );
    }, [peopleInCharge]);

    useEffect(() => {
        setData(
            "assignee",
            assignee.map((p) => p.id)
        );
    }, [assignee]);

    useEffect(() => {
        if (recentlySuccessful) {
            onSubmit();
        }
    }, [recentlySuccessful]);

    // Assignee search
    const [userSearch, setUserSearch] = useState("");
    const [searchedUsers, setSearchedUsers] = useState([]);

    useEffect(() => {
        clearTimeout(userSearchTimeout);

        userSearchTimeout = setTimeout(() => {
            axios
                .get(
                    route("boards.users.index", {
                        board: boardId,
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
                        setSearchedUsers(res.data.data);
                    } else {
                        setSearchedUsers([]);
                    }
                });
        }, 500);
    }, [userSearch]);

    // useEffect(() => {
    //     setSearchedUsers(
    //         searchedUsers.filter(
    //             (d) =>
    //                 ![...(userList || [])].some(
    //                     (existing) => existing.id === d.id
    //                 )
    //         )
    //     );
    // }, [userList]);
    return (
        <Card className={twMerge("w-full, max-w-5xl", className)}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (task !== null && !task?.is_editable) {
                        return;
                    }

                    task
                        ? put(
                              route("boards.tasks.update", {
                                  board: boardId,
                                  task: task.id,
                              })
                          )
                        : post(route("boards.tasks.store", { board: boardId }));
                }}
                className="space-y-5"
            >
                <h1 className="text-xl font-bold">Edit Tugas</h1>
                <TextInput
                    className="text-4xl border-0 border-b rounded-none w-full focus:ring-0"
                    placeholder="Judul"
                    value={data.title}
                    disabled={task !== null && !task?.is_editable}
                    onChange={(e) => {
                        setData("title", e.target.value);
                    }}
                />
                <QuillEditor
                    readOnly={task !== null && !task?.is_editable}
                    value={data.description}
                    onChange={(value) => setData("description", value)}
                    placeholder="Deskripsi tugas..."
                />
                <div className="space-y-1">
                    <h2 className="font-bold">Untuk...</h2>
                    <div className="flex flex-row gap-3 flex-wrap">
                        {assignee.length === 0 && (
                            <div className="opacity-50">
                                Tidak ada pegawai yang ditunjuk...
                            </div>
                        )}
                        {assignee.map((user, iUser) => (
                            <Pill
                                className={twMerge(
                                    "py-0 pl-0 flex flex-row gap-2 items-center bg-emerald-400"
                                )}
                                key={iUser}
                            >
                                <img
                                    src={user.photo_url}
                                    alt={user.name}
                                    className="rounded-full inline-block w-8 h-8"
                                />
                                <div className="inline-block">{user.name}</div>
                                {(task?.is_deletable || task === null) && (
                                    <button
                                        type="button"
                                        className="w-8 h-8 rounded-full rotate-45"
                                        onClick={(e) => {
                                            const assignees = assignee.slice(0);
                                            assignees.splice(iUser, 1);
                                            setAssignee(assignees);
                                        }}
                                    >
                                        <i className="bi-plus-lg text-lg"></i>
                                    </button>
                                )}
                            </Pill>
                        ))}
                    </div>
                    {(task?.is_deletable || task === null) && (
                        <Combobox
                            className="relative"
                            as="div"
                            onChange={(user) => {
                                const users = assignee.slice(0);
                                if (!users.find((u) => u.id === user.id)) {
                                    users.push(user);

                                    setAssignee(users);
                                }
                            }}
                        >
                            <Combobox.Input
                                as={TextInput}
                                defaultValue=""
                                onChange={(e) => setUserSearch(e.target.value)}
                                className="w-full"
                                placeholder="Cari Pegawai..."
                            />

                            <Combobox.Button className="absolute inset-y-0 right-3">
                                <i className="bi-chevron-expand"></i>
                            </Combobox.Button>
                            <Combobox.Options className="absolute mt-2 max-h-60 w-full overflow-auto z-20">
                                {searchedUsers.map((member) => (
                                    <Combobox.Option
                                        className="cursor-pointer relative p-4 bg-white ui-selected:font-bold ui-active:bg-gray-300 dark:bg-gray-800 ui-active:dark:bg-gray-600"
                                        key={member.id}
                                        value={member}
                                    >
                                        {member.name} ({member.email})
                                    </Combobox.Option>
                                ))}
                            </Combobox.Options>
                        </Combobox>
                    )}
                </div>
                <div className="space-y-1">
                    <h2 className="font-bold">Penanggung jawab</h2>
                    <div className="flex flex-row gap-3 flex-wrap">
                        {peopleInCharge.length === 0 && (
                            <div className="opacity-50">
                                Tidak ada penanggung jawab...
                            </div>
                        )}
                        {peopleInCharge.map((user, iUser) => (
                            <Pill
                                className={twMerge(
                                    "py-0 pl-0 flex flex-row gap-2 items-center bg-emerald-400"
                                )}
                                key={iUser}
                            >
                                <img
                                    src={user.photo_url}
                                    alt={user.name}
                                    className="rounded-full inline-block w-8 h-8"
                                />
                                <div className="inline-block">{user.name}</div>
                                {(task?.is_deletable || task === null) && (
                                    <button
                                        type="button"
                                        className="w-8 h-8 rounded-full rotate-45"
                                        onClick={(e) => {
                                            const PICs =
                                                peopleInCharge.slice(0);
                                            PICs.splice(iUser, 1);
                                            setPeopleInCharge(PICs);
                                        }}
                                    >
                                        <i className="bi-plus-lg text-lg"></i>
                                    </button>
                                )}
                            </Pill>
                        ))}
                    </div>
                    {(task?.is_deletable || task === null) && (
                        <Combobox
                            className="relative"
                            as="div"
                            onChange={(user) => {
                                const users = peopleInCharge.slice(0);
                                if (!users.find((u) => u.id === user.id)) {
                                    users.push(user);

                                    setPeopleInCharge(users);
                                }
                            }}
                        >
                            <Combobox.Input
                                as={TextInput}
                                defaultValue=""
                                onChange={(e) => setUserSearch(e.target.value)}
                                className="w-full"
                                placeholder="Cari Pegawai..."
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
                    )}
                </div>
                <div className="space-y-i">
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={data.status}
                        className="w-full"
                        disabled={task !== null && !task?.is_editable}
                        onChange={(e) => setData("status", e.target.value - 0)}
                    >
                        {statuses.map((s, i) => (
                            <option value={i} key={i} className="text-black">
                                {s}
                            </option>
                        ))}
                    </Select>
                </div>
                <div className="space-y-i">
                    <InputLabel>Prioritas</InputLabel>
                    <Select
                        value={data.priority}
                        className="w-full"
                        onChange={(e) =>
                            setData("priority", e.target.value - 0)
                        }
                        disabled={task !== null && !task?.is_deletable}
                    >
                        {priorities.map((s, i) => (
                            <option value={i} key={i} className="text-black">
                                {s}
                            </option>
                        ))}
                    </Select>
                </div>
                <div className="space-y-1">
                    <InputLabel>Tanggal mulai</InputLabel>
                    <TextInput
                        type="datetime-local"
                        value={data.due_start}
                        className="w-full"
                        disabled={task !== null && !task?.is_deletable}
                        onChange={(e) => setData("due_start", e.target.value)}
                    />
                </div>
                <div className="space-y-1">
                    <InputLabel>Tanggal selesai</InputLabel>
                    <TextInput
                        type="datetime-local"
                        value={data.due_end}
                        className="w-full"
                        disabled={task !== null && !task?.is_deletable}
                        onChange={(e) => setData("due_end", e.target.value)}
                    />
                </div>
                <div className="flex flex-row-reverse gap-3">
                    <PrimaryButton
                        type="submit"
                        disabled={
                            processing || (task !== null && !task?.is_editable)
                        }
                    >
                        Simpan
                    </PrimaryButton>
                    <SecondaryButton
                        type="button"
                        onClick={(e) => {
                            onClose();
                        }}
                    >
                        Tutup
                    </SecondaryButton>
                </div>
            </form>
        </Card>
    );
}
