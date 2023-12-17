import ButtonLink from "@/Components/ButtonLink";
import Card from "@/Components/Card";
import DangerButton from "@/Components/DangerButton";
import SortedTable from "@/Components/Datatable";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { formatCurrency } from "@/lib/currencyFormat";
import { Disclosure } from "@headlessui/react";
import { Head, router, useForm } from "@inertiajs/react";
import dayjs from "dayjs";
import LocaleFormat from "dayjs/plugin/localizedFormat";
import { Fragment, useEffect, useState } from "react";

dayjs.extend(LocaleFormat);

export default function ProjectDashboardView({
    projects,
    auth,
    search,
    pageSize,
    page,
    orderBy,
    success = null,
    selectedProject = null,
    ...props
}) {
    const { data, setData, get, processing, errors, isDirty } = useForm({
        page,
        pageSize,
        orderBy,
        search,
    });

    function fetchData() {
        get(route("projects.index"));
    }

    const [searchTerm, setSearchTerm] = useState(search || "");

    useEffect(() => {
        if (isDirty) {
            if (page > 1) {
                setData("page", 1);
                return;
            }
            fetchData();
        }
    }, [data.pageSize, data.orderBy, data.search]);

    useEffect(() => {
        if (isDirty) {
            fetchData();
        }
    }, [data.page]);

    return (
        <AuthenticatedLayout
            // header={
            //     <div className="flex items-baseline flex-row gap-4">
            //         <h2 className="text-xl font-bold">
            //             Dashboard Proyek{" "}
            //             {selectedProject && selectedProject.name}
            //         </h2>

            //         {selectedProject === null && (
            //             <ButtonLink href={route("projects.create")}>
            //                 Buat Proyek <i className="bi-plus-lg ml-2"></i>
            //             </ButtonLink>
            //         )}
            //         <form
            //             onSubmit={(e) => {
            //                 e.preventDefault();
            //                 setData("search", searchTerm);
            //             }}
            //             className="ml-auto"
            //         >
            //             <TextInput
            //                 value={searchTerm}
            //                 onChange={(e) => {
            //                     setSearchTerm(e.target.value);
            //                 }}
            //                 placeholder="Cari..."
            //             />
            //         </form>
            //     </div>
            // }
            user={auth.user}
        >
            <Head title="Projects" />
            <div className="w-full mx-auto space-y-10">
                {success && (
                    <Card className="w-full !bg-green-400 !text-black !py-5">
                        {success}
                    </Card>
                )}
                <div className="w-full grid grid-cols-12 gap-4">
                    <div className="md:col-span-3 lg:col-span-2 bg-gray-200 dark:bg-gray-700 min-h-screen">
                        <div className="max-h-screen overflow-y-auto sticky top-0">
                            {projects.data.map((p) => (
                                <ButtonLink
                                    key={p.id}
                                    className="border-0 rounded-none border-b last:border-b-0 bg-transparent py-4 w-full"
                                    href={route("projects.show", {
                                        project: p.id,
                                    })}
                                >
                                    <p className="w-full truncate">
                                        # {p.name}
                                    </p>
                                </ButtonLink>
                            ))}
                        </div>
                    </div>
                    <div className="md:col-span-9 lg:col-span-10 pl-4">
                        <div className="py-20">
                            {/* <ButtonLink as="a" href="#foo">
                                Foo
                            </ButtonLink> */}
                            {selectedProject === null && (
                                <p>
                                    &#x1F448; Pilih salah satu proyek dari
                                    daftar di samping
                                </p>
                            )}
                            {selectedProject && (
                                <Fragment>
                                    <div className="max-w-4xl mx-auto overflow-x-auto space-y-10">
                                        <h1 className="text-3xl font-bold">
                                            {selectedProject.name}
                                        </h1>
                                        <div className="text-sm">
                                            {dayjs(
                                                selectedProject.start_date
                                            ).format("LL")}{" "}
                                            ---{" "}
                                            {dayjs(
                                                selectedProject.end_date
                                            ).format("LL")}
                                        </div>
                                        <div className="flex gap-2 flex-row items-baseline">
                                            <h4 className="font-bold">
                                                <i>Budget: </i>
                                            </h4>
                                            <p>
                                                {formatCurrency(
                                                    selectedProject.budget
                                                )}
                                            </p>
                                        </div>
                                        <p className="leading-8 text-lg">
                                            {selectedProject.description}
                                        </p>

                                        <div className="grid grid-cols-2 gap-4">
                                            <Card className="border border-gray-300 space-y-4">
                                                <h4 className="font-bold">
                                                    Client
                                                </h4>
                                                <p className="text-lg">
                                                    {
                                                        selectedProject.client_name
                                                    }
                                                </p>
                                                <div>
                                                    <a
                                                        href={
                                                            "mailto:" +
                                                            selectedProject.client_email
                                                        }
                                                    >
                                                        <span className="bi-envelope mr-2"></span>
                                                        {
                                                            selectedProject.client_email
                                                        }
                                                    </a>
                                                </div>
                                                <div>
                                                    <a
                                                        href={
                                                            "tel:" +
                                                            selectedProject.client_phone
                                                        }
                                                    >
                                                        <span className="bi-telephone mr-2"></span>
                                                        {
                                                            selectedProject.client_phone
                                                        }
                                                    </a>
                                                </div>
                                            </Card>
                                        </div>
                                        <hr className="border-gray-300 dark:opacity-25" />
                                        {[
                                            "purposes",
                                            "objectives",
                                            "services",
                                            "deliverables",
                                            "requirements",
                                            "out_of_scopes",
                                        ].map(
                                            (field, iField) =>
                                                selectedProject[field]
                                                    ?.length && (
                                                    <Disclosure
                                                        defaultOpen
                                                        key={iField}
                                                    >
                                                        <Disclosure.Button
                                                            as="h2"
                                                            className="text-xl font-bold cursor-pointer select-none"
                                                        >
                                                            <i className="capitalize">
                                                                {field.replace(
                                                                    /\_/g,
                                                                    "-"
                                                                )}
                                                            </i>
                                                            <i className="ml-2 bi-plus ui-open:hidden"></i>
                                                            <i className="ml-2 bi-dash ui-not-open:hidden"></i>
                                                        </Disclosure.Button>
                                                        <Disclosure.Panel as="div">
                                                            <ol className="list-decimal space-y-4">
                                                                {selectedProject[
                                                                    field
                                                                ].map(
                                                                    (
                                                                        value,
                                                                        i
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                i
                                                                            }
                                                                        >
                                                                            {
                                                                                value.description
                                                                            }
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ol>
                                                        </Disclosure.Panel>
                                                    </Disclosure>
                                                )
                                        )}
                                    </div>
                                    <Disclosure>
                                        <Disclosure.Button className="opacity-10">
                                            Object detail
                                        </Disclosure.Button>
                                        <Disclosure.Panel>
                                            <pre>
                                                {JSON.stringify(
                                                    selectedProject,
                                                    null,
                                                    2
                                                )}
                                            </pre>
                                        </Disclosure.Panel>
                                    </Disclosure>
                                </Fragment>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
