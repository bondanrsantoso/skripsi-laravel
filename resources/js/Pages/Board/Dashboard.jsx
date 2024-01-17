import ButtonLink from "@/Components/ButtonLink";
import Card from "@/Components/Card";
import DangerButton from "@/Components/DangerButton";
import SortedTable from "@/Components/Datatable";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import BoardLayout from "@/Layouts/BoardLayout";
import { formatCurrency } from "@/lib/currencyFormat";
import { Disclosure } from "@headlessui/react";
import { Head, router, useForm } from "@inertiajs/react";
import dayjs from "dayjs";
import LocaleFormat from "dayjs/plugin/localizedFormat";
import { Fragment, useEffect, useState } from "react";

dayjs.extend(LocaleFormat);

export default function BoardDashboardView({
    boards = [],
    auth,
    search = "",
    pageSize = 25,
    page = 1,
    orderBy = null,
    success = null,
    selectedProject = null,
    ...props
}) {
    return (
        <BoardLayout user={auth.user} boards={boards}>
            <Head title="Boards" />
        </BoardLayout>
    );
}
