import ButtonLink from "@/Components/ButtonLink";
import Card from "@/Components/Card";
import DangerButton from "@/Components/DangerButton";
import SortedTable from "@/Components/Datatable";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { formatCurrency } from "@/lib/currencyFormat";
import { Head, router, useForm } from "@inertiajs/react";
import dayjs from "dayjs";
import LocaleFormat from "dayjs/plugin/localizedFormat";
import { useEffect, useState } from "react";

dayjs.extend(LocaleFormat);

export default function ProjectListView({
    projects,
    auth,
    search,
    pageSize,
    page,
    orderBy,
    success = null,
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
            header={
                <div className="flex items-baseline flex-row gap-4">
                    <h2 className="text-xl font-bold">Daftar Proyek</h2>
                    <ButtonLink href={route("projects.create")}>
                        Buat Proyek <i className="bi-plus-lg ml-2"></i>
                    </ButtonLink>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setData("search", searchTerm);
                        }}
                        className="ml-auto"
                    >
                        <TextInput
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                            }}
                            placeholder="Cari..."
                        />
                    </form>
                </div>
            }
            user={auth.user}
        >
            <Head title="Projects" />
            <div className="container py-12 mx-auto space-y-10">
                {success && (
                    <Card className="w-full !bg-green-400 !text-black !py-5">
                        {success}
                    </Card>
                )}
                <div className="w-full overflow-x-auto">
                    <SortedTable
                        sortBy={data.orderBy}
                        onSortChange={(newSort) => {
                            setData("orderBy", newSort);
                        }}
                        className="table-auto min-w-full border border-gray-400"
                    >
                        <thead>
                            <tr className="border-b border-gray-400 bg-gray-300 dark:bg-gray-950">
                                <SortedTable.Th
                                    className="border-x p-1"
                                    name="name"
                                    sortable
                                >
                                    Nama Proyek
                                </SortedTable.Th>
                                <SortedTable.Th
                                    className="border-x p-1"
                                    name="client_name"
                                    sortable
                                >
                                    Klien
                                </SortedTable.Th>
                                <SortedTable.Th
                                    className="border-x p-1"
                                    name="budget"
                                    sortable
                                >
                                    Budget
                                </SortedTable.Th>
                                <SortedTable.Th
                                    className="border-x p-1"
                                    name="start_date"
                                    sortable
                                >
                                    Tanggal Mulai
                                </SortedTable.Th>
                                <SortedTable.Th
                                    className="border-x p-1"
                                    name="end_date"
                                    sortable
                                >
                                    Tenggat Waktu
                                </SortedTable.Th>
                                <SortedTable.Th className="border-x p-1"></SortedTable.Th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.data.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center p-1">
                                        <em>Tidak ada data</em>{" "}
                                        {search && (
                                            <span>
                                                <em>terkait pencarian</em>{" "}
                                                <q>{search}</q>
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            )}
                            {projects.data.map((project) => (
                                <tr className="border-b border-gray-400 odd:bg-gray-200 odd:dark:bg-gray-800">
                                    <td className="p-2 px-4 border border-gray-400">
                                        {project.name}
                                    </td>
                                    <td className="p-2 px-4 border border-gray-400">
                                        {project.client_name}
                                    </td>
                                    <td className="p-2 px-4 border border-gray-400">
                                        {formatCurrency(project.budget)}
                                    </td>
                                    <td className="p-2 px-4 border border-gray-400">
                                        {dayjs(project.start_date).format("LL")}
                                    </td>
                                    <td className="p-2 px-4 border border-gray-400">
                                        {dayjs(project.end_date).format("LL")}
                                    </td>
                                    <td className="p-2 px-4 border border-gray-400">
                                        <div className="flex flex-row flex-nowrap gap-2">
                                            <ButtonLink
                                                href={route("projects.edit", {
                                                    project: project.id,
                                                })}
                                            >
                                                <i className="bi-pencil"></i>
                                            </ButtonLink>
                                            <DangerButton
                                                onClick={() =>
                                                    router.delete(
                                                        route(
                                                            "projects.destroy",
                                                            {
                                                                project:
                                                                    project.id,
                                                            }
                                                        )
                                                    )
                                                }
                                            >
                                                <i className="bi-trash"></i>
                                            </DangerButton>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </SortedTable>
                    {/* <pre>{JSON.stringify(projects, null, 2)}</pre> */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
