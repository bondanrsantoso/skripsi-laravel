import Card from "@/Components/Card";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import LocalizedFormat from "dayjs/esm/plugin/localizedFormat";
import SecondaryButton from "@/Components/SecondaryButton";
import QuillEditor from "@/Components/QuillEditor";
import DOMPurify from "dompurify";
import DangerButton from "@/Components/DangerButton";
import { Link } from "@inertiajs/react";

dayjs.extend(LocalizedFormat);

export default function BoardItem({
    item,
    className = "",
    onChange,
    onDelete,
    readOnly = false,
    ...props
}) {
    const { sanitize } = DOMPurify;
    if (item.type === "file") {
        if (item.mime_type.includes("image")) {
            return (
                <div
                    className={twMerge(
                        "space-y-1 w-full relative group",
                        className
                    )}
                >
                    {!readOnly && (
                        <DangerButton
                            type="button"
                            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100"
                            onClick={() => onDelete(item)}
                        >
                            Hapus
                        </DangerButton>
                    )}
                    <img src={item.url} className="w-full" />
                    <p className="text-sm text-center opacity-50">
                        {item.filename} diunggah oleh{" "}
                        {item.owner?.name || "[Pengguna dihapus]"} pada{" "}
                        {dayjs(item.created_at).format("LLL")}
                    </p>
                </div>
            );
        } else if (item.mime_type.includes("video")) {
            return (
                <div
                    className={twMerge(
                        "space-y-1 w-full relative group",
                        className
                    )}
                >
                    {!readOnly && (
                        <DangerButton
                            type="button"
                            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100"
                            onClick={() => onDelete(item)}
                        >
                            Hapus
                        </DangerButton>
                    )}
                    <video controls src={item.url} className="w-full" />
                    <p className="text-sm text-center opacity-50">
                        {item.filename} diunggah oleh{" "}
                        {item.owner?.name || "[Pengguna dihapus]"} pada{" "}
                        {dayjs(item.created_at).format("LLL")}
                    </p>
                </div>
            );
        } else {
            return (
                <Card
                    target="_blank"
                    className="w-full flex flex-row items-center gap-4 group"
                >
                    <p style={{ fontSize: "5rem" }}>
                        <i className="bi-file-earmark"></i>
                    </p>
                    <div className="space-y-1 w-full">
                        <p className="text-lg">{item.filename}</p>
                        <p className="text-sm">
                            Diunggah pada {dayjs(item.created_at).format("LLL")}
                        </p>
                        <div className="flex items-center gap-2">
                            <img
                                src={item.owner.photo_url}
                                alt=""
                                className="rounded-full w-6 h-6"
                            />
                            <p>{item.owner.name}</p>
                        </div>
                        <hr className="border-dotted border-gray-300 !mt-4" />
                        <div className="flex flex-row gap-2 !mt-4">
                            <SecondaryButton
                                as="a"
                                href={item.url}
                                download={item.filename}
                            >
                                Unduh berkas
                            </SecondaryButton>
                            <SecondaryButton
                                as={Link}
                                href={route("artifacts.show", {
                                    artifact: item.id,
                                })}
                            >
                                Lihat detail
                            </SecondaryButton>
                            {!readOnly && (
                                <DangerButton
                                    type="button"
                                    className="opacity-0 group-hover:opacity-100"
                                    onClick={() => onDelete(item)}
                                >
                                    Hapus
                                </DangerButton>
                            )}
                        </div>
                    </div>
                </Card>
            );
        }
    } else if (item.type === "text") {
        return (
            <div className="w-full border-y dark:border-gray-600 border-gray-300">
                <QuillEditor
                    value={sanitize(item.content || "")}
                    onChange={onChange}
                    placeholder={
                        readOnly
                            ? "Anda tidak mempunyai akses editor"
                            : "Klik untuk mengisi..."
                    }
                    readOnly={readOnly}
                />
            </div>
        );
    }
    return <p>Tidak dapat menentukan tipe konten :(</p>;
}
