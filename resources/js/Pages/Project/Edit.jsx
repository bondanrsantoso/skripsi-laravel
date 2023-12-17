import Card from "@/Components/Card";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import UTC from "dayjs/plugin/utc";
import MDEditor from "@uiw/react-md-editor";
import InputLabel from "@/Components/InputLabel";
import { fakerID_ID as faker } from "@faker-js/faker";
import { useEffect, useState } from "react";
// import {
//     PhoneNumberUtil as PhoneUtil,
//     PhoneNumberFormat as PNF,
// } from "google-libphonenumber";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Combobox } from "@headlessui/react";
import axios from "axios";
import { twMerge } from "tailwind-merge";
import Pill from "@/Components/Pill";
import TextArea from "@/Components/TextArea";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";

dayjs.extend(LocalizedFormat);
dayjs.extend(UTC);

let managerSearchTimeout;
let memberSearchTimeout;

export default function ProjectEditView({ project = null, auth, ...props }) {
    faker.seed(window.location.href.length);

    const [phoneCountry, setPhoneCountry] = useState("ID");
    const { data, setData, post, put, processing, isDirty } = useForm({
        name: project?.name || "",
        description: project?.description || "",
        start_date: project?.start_date || dayjs().format("YYYY-MM-DD"),
        end_date: project?.end_date || dayjs().format("YYYY-MM-DD"),
        client_name: project?.client_name || "",
        client_email: project?.client_email || "",
        client_phone: project?.client_phone || "",
        budget: project?.budget || 0,
        managers: project?.managers || [],
        internal_members: project?.internal_members || [],
        external_members: project?.external_members || [],
        purposes: project?.purposes || [],
        objectives: project?.objectives || [],
        services: project?.services || [],
        deliverables: project?.deliverables || [],
        requirements: project?.requirements || [],
        out_of_scopes: project?.out_of_scopes || [],
    });

    const [managerSearch, setManagerSearch] = useState("");
    const [searchedManagers, setSearchedManagers] = useState([]);

    useEffect(() => {
        clearTimeout(managerSearchTimeout);

        managerSearchTimeout = setTimeout(() => {
            axios
                .get(
                    route("users.index", {
                        pageSize: 999,
                        search: managerSearch,
                    }),
                    {
                        withCredentials: true,
                        headers: { Accept: "application/json" },
                    }
                )
                .then((res) => {
                    if (res.data && res.data.data && res.data.data.length) {
                        setSearchedManagers(
                            res.data.data.filter(
                                (d) =>
                                    ![
                                        ...(data.managers || []),
                                        ...(data.internal_members || []),
                                    ].some((existing) => existing.id === d.id)
                            )
                        );
                    } else {
                        setSearchedManagers([]);
                    }
                });
        }, 500);
    }, [managerSearch]);

    const [memberSearch, setMemberSearch] = useState("");
    const [searchedMembers, setSearchedMembers] = useState([]);

    useEffect(() => {
        clearTimeout(memberSearchTimeout);

        memberSearchTimeout = setTimeout(() => {
            axios
                .get(
                    route("users.index", {
                        pageSize: 999,
                        search: memberSearch,
                    }),
                    {
                        withCredentials: true,
                        headers: { Accept: "application/json" },
                    }
                )
                .then((res) => {
                    if (res.data && res.data.data && res.data.data.length) {
                        setSearchedMembers(
                            res.data.data.filter(
                                (d) =>
                                    ![
                                        ...(data.managers || []),
                                        ...(data.internal_members || []),
                                    ].some((existing) => existing.id === d.id)
                            )
                        );
                    } else {
                        setSearchedMembers([]);
                    }
                });
        }, 500);
    }, [memberSearch]);

    useEffect(() => {
        setSearchedManagers(
            searchedManagers.filter(
                (d) =>
                    ![
                        ...(data.managers || []),
                        ...(data.internal_members || []),
                    ].some((existing) => existing.id === d.id)
            )
        );
        setSearchedMembers(
            searchedMembers.filter(
                (d) =>
                    ![
                        ...(data.managers || []),
                        ...(data.internal_members || []),
                    ].some((existing) => existing.id === d.id)
            )
        );
    }, [data.managers, data.internal_members]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-row items-baseline">
                    <h2 className="text-xl font-bold">
                        {project ? "Edit Proyek" : "Proyek baru"}
                    </h2>
                </div>
            }
        >
            <Head title="Edit Proyek" />

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (project) {
                        put(route("projects.update", { project: project.id }));
                    } else {
                        post(route("projects.store"));
                    }
                }}
                className="container py-12 space-y-4 mx-auto"
            >
                <Card className="space-y-4">
                    <TextInput
                        className="text-2xl font-bold w-full border-0 border-b rounded-none"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        placeholder="Nama Proyek"
                        required
                    />
                    <MDEditor
                        preview="edit"
                        value={data.description}
                        onChange={(d) => setData("description", d)}
                        textareaProps={{ placeholder: "Deskripsi Proyek..." }}
                    />
                    <div className="space-y-1">
                        <InputLabel htmlFor="budget">Anggaran</InputLabel>
                        <div className="border border-gray-300 rounded-md pl-3 flex flex-row flex-nowrap w-full items-baseline">
                            <span>Rp</span>
                            <TextInput
                                className="w-full border-0"
                                type="number"
                                value={data.budget}
                                onChange={(e) =>
                                    setData("budget", e.target.value)
                                }
                                min={0}
                                step={0.01}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <InputLabel htmlFor="start_date">
                                Tanggal Mulai
                            </InputLabel>
                            <TextInput
                                className="w-full"
                                type="date"
                                value={data.start_date}
                                onChange={(e) =>
                                    setData("start_date", e.target.value)
                                }
                                id="start_date"
                            />
                        </div>
                        <div className="space-y-1">
                            <InputLabel htmlFor="end_date">
                                Tanggal Selesai
                            </InputLabel>
                            <TextInput
                                className="w-full"
                                type="date"
                                value={data.end_date}
                                onChange={(e) =>
                                    setData("end_date", e.target.value)
                                }
                                id="end_date"
                            />
                        </div>
                    </div>
                    <hr className="border-dotted border-gray-400" />

                    <h3 className="font-bold">Informasi Klien</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-1 md:col-span-2 lg:col-span-1">
                            <InputLabel htmlFor="client_name">
                                Nama Klien
                            </InputLabel>
                            <TextInput
                                type="text"
                                placeholder={`contoh: ${faker.person.fullName()} atau ${faker.company.name()}`}
                                value={data.client_name}
                                className="w-full"
                                onChange={(e) =>
                                    setData("client_name", e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-1">
                            <InputLabel htmlFor="client_email">
                                Email Klien
                            </InputLabel>
                            <TextInput
                                type="email"
                                placeholder={faker.internet.exampleEmail()}
                                value={data.client_email}
                                className="w-full"
                                onChange={(e) =>
                                    setData("client_email", e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-1">
                            <InputLabel htmlFor="client_phone">
                                Nomor telepon
                            </InputLabel>
                            <PhoneInput
                                value={data.client_phone}
                                onChange={(p) => setData("client_phone", p)}
                                defaultCountry="ID"
                                onCountryChange={(code) => {}}
                                className="border rounded-md border-gray-300 flex pl-3"
                                countrySelectProps={{ className: "text-black" }}
                                inputComponent={TextInput}
                                numberInputProps={{
                                    className: "border-0",
                                    placeholder:
                                        faker.helpers.replaceSymbolWithNumber(
                                            "08XXXXXXXXXX"
                                        ),
                                }}
                            />
                            <span className="text-sm">{data.client_phone}</span>
                        </div>
                    </div>
                    <hr className="border-dotted" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <h4 className="font-bold text-lg">
                                Manajer Proyek
                            </h4>
                            {(data.managers || []).length > 0 && (
                                <div className="flex flex-row flex-wrap gap-2">
                                    {data.managers.map((manager, i) => (
                                        <Pill
                                            className="bg-green-400 text-md space-x-1 py-0 pr-0"
                                            key={manager.id}
                                        >
                                            <div className="inline-block">
                                                {manager.name}
                                            </div>
                                            <button
                                                type="button"
                                                className="rotate-45 hover:bg-red-400 w-8 h-8 rounded-full"
                                                onClick={() => {
                                                    const managers =
                                                        data.managers.slice(0);
                                                    managers.splice(i, 1);
                                                    setData(
                                                        "managers",
                                                        managers
                                                    );
                                                }}
                                            >
                                                <i className="bi-plus-lg"></i>
                                            </button>
                                        </Pill>
                                    ))}
                                </div>
                            )}
                            <div className="space-y-1">
                                <InputLabel>Tambah Manajer Proyek</InputLabel>
                                <Combobox
                                    className="relative"
                                    as="div"
                                    onChange={(manager) => {
                                        const managers = data.managers.slice(0);
                                        managers.push(manager);
                                        setData("managers", managers);
                                    }}
                                >
                                    <Combobox.Input
                                        as={TextInput}
                                        onChange={(e) =>
                                            setManagerSearch(e.target.value)
                                        }
                                        className="w-full"
                                        placeholder="Cari Pengguna..."
                                    />

                                    <Combobox.Button className="absolute inset-y-0 right-3">
                                        <i className="bi-chevron-expand"></i>
                                    </Combobox.Button>
                                    <Combobox.Options className="absolute mt-2 max-h-60 w-full overflow-auto">
                                        {searchedManagers.map((manager) => (
                                            <Combobox.Option
                                                className="relative p-4 bg-white ui-selected:font-bold ui-active:bg-gray-300 dark:bg-gray-800 ui-active:dark:bg-gray-600"
                                                key={manager.id}
                                                value={manager}
                                            >
                                                {manager.name} ({manager.email})
                                            </Combobox.Option>
                                        ))}
                                    </Combobox.Options>
                                </Combobox>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold text-lg">
                                Anggota Proyek
                            </h4>
                            {(data.internal_members || []).length > 0 && (
                                <div className="flex flex-row flex-wrap gap-2">
                                    {data.internal_members.map((member, i) => (
                                        <Pill
                                            className="bg-emerald-400 text-md space-x-1 py-0 pr-0"
                                            key={member.id}
                                        >
                                            <div className="inline-block">
                                                {member.name}
                                            </div>
                                            <button
                                                type="button"
                                                className="rotate-45 hover:bg-red-400 w-8 h-8 rounded-full"
                                                onClick={() => {
                                                    const members =
                                                        data.internal_members.slice(
                                                            0
                                                        );
                                                    members.splice(i, 1);
                                                    setData(
                                                        "internal_members",
                                                        members
                                                    );
                                                }}
                                            >
                                                <i className="bi-plus-lg"></i>
                                            </button>
                                        </Pill>
                                    ))}
                                </div>
                            )}
                            <div className="space-y-1">
                                <InputLabel>Tambah Anggota Proyek</InputLabel>
                                <Combobox
                                    className="relative"
                                    as="div"
                                    onChange={(member) => {
                                        const members =
                                            data.internal_members.slice(0);
                                        members.push(member);
                                        setData("internal_members", members);
                                    }}
                                >
                                    <Combobox.Input
                                        as={TextInput}
                                        onChange={(e) =>
                                            setMemberSearch(e.target.value)
                                        }
                                        className="w-full"
                                        placeholder="Cari Pengguna..."
                                    />

                                    <Combobox.Button className="absolute inset-y-0 right-3">
                                        <i className="bi-chevron-expand"></i>
                                    </Combobox.Button>
                                    <Combobox.Options className="absolute mt-2 max-h-60 w-full overflow-auto">
                                        {searchedMembers.map((member) => (
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
                        </div>
                    </div>
                </Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        "purposes",
                        "objectives",
                        "services",
                        "deliverables",
                        "requirements",
                        "out_of_scopes",
                    ].map((field) => (
                        <Card key={field} className="space-y-4">
                            <h3 className="font-bold text-lg">
                                <em className="capitalize">
                                    {field.replace(/\_/g, "-")}
                                </em>
                            </h3>

                            {data[field].map((entry, i) => (
                                <div
                                    key={i}
                                    className="flex flex-row flex-nowrap gap-2 items-baseline"
                                >
                                    <span className="w-5">{i + 1}.</span>
                                    <TextArea
                                        className="w-full min-h-[5rem]"
                                        value={entry.description}
                                        onChange={(e) => {
                                            const entries =
                                                data[field].slice(0);
                                            entries[i].description =
                                                e.target.value;
                                            setData(field, entries);
                                        }}
                                    />
                                    <div className="self-center"></div>
                                    <div className="flex flex-col gap-1 self-center">
                                        <button
                                            type="button"
                                            disabled={i === 0}
                                            className="disabled:opacity-25"
                                            onClick={(e) => {
                                                const entries =
                                                    data[field].slice(0);
                                                [entries[i - 1], entries[i]] = [
                                                    entries[i],
                                                    entries[i - 1],
                                                ];

                                                setData(field, entries);
                                            }}
                                        >
                                            <i className="bi-chevron-up"></i>
                                        </button>
                                        <button
                                            type="button"
                                            className="rotate-45"
                                            onClick={(e) => {
                                                const entries =
                                                    data[field].slice(0);
                                                entries.splice(i, 1);
                                                setData(field, entries);
                                            }}
                                        >
                                            <i className="bi-plus-lg"></i>
                                        </button>
                                        <button
                                            disabled={
                                                i === data[field].length - 1
                                            }
                                            type="button"
                                            className="disabled:opacity-25"
                                            onClick={(e) => {
                                                const entries =
                                                    data[field].slice(0);
                                                [entries[i + 1], entries[i]] = [
                                                    entries[i],
                                                    entries[i + 1],
                                                ];

                                                setData(field, entries);
                                            }}
                                        >
                                            <i className="bi-chevron-down"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <SecondaryButton
                                type="button"
                                onClick={(e) => {
                                    const entries = data[field].slice(0);
                                    entries.push({ description: "" });
                                    setData(field, entries);
                                }}
                                className="ml-4 bg-transparent border block text-center dark:text-white hover:dark:text-black border-gray-300"
                            >
                                Tambah Entri <i className="bi-plus-lg"></i>
                            </SecondaryButton>
                        </Card>
                    ))}
                </div>
                <Card className="flex justify-end sm:py-4 dark:bg-[rgba(31,41,55,0.8)] backdrop-blur-sm sticky bottom-10 !shadow-2xl shadow-black">
                    <PrimaryButton type="submit">
                        Simpan <i className="bi-save ml-4"></i>
                    </PrimaryButton>
                </Card>
            </form>
        </AuthenticatedLayout>
    );
}
