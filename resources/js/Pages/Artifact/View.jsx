import Card from "@/Components/Card";
import SecondaryButton from "@/Components/SecondaryButton";
import BoardLayout from "@/Layouts/BoardLayout";
import { Head } from "@inertiajs/react";
import dayjs from "dayjs";
import LocaleFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(LocaleFormat);

export default function ArtifactView({ boards, artifact, auth, ...props }) {
    return (
        <BoardLayout user={auth.user} boards={boards}>
            <Head title="Boards" />
            <div className="space-y-10 pb-20">
                <Card className="w-full flex flex-row items-center gap-4">
                    <p style={{ fontSize: "5rem" }}>
                        <i className="bi-file-earmark"></i>
                    </p>
                    <div className="space-y-1 w-full">
                        <p className="text-lg">{artifact.filename}</p>
                        <p className="text-sm">
                            Diunggah pada{" "}
                            {dayjs(artifact.created_at).format("LLL")}
                        </p>
                        <div className="flex items-center gap-2">
                            <img
                                src={artifact.owner.photo_url}
                                alt=""
                                className="rounded-full w-6 h-6"
                            />
                            <p>{artifact.owner.name}</p>
                        </div>
                        <hr className="border-dotted border-gray-300 !mt-4" />
                        <div className="flex flex-row gap-2 !mt-4">
                            <SecondaryButton
                                as="a"
                                href={artifact.url}
                                download={artifact.filename}
                            >
                                Unduh berkas
                            </SecondaryButton>
                        </div>
                    </div>
                </Card>
                <h1 className="text-2xl font-bold">Informasi Kontekstual</h1>
                {artifact.contexts.map((context, i) => (
                    <div
                        key={i}
                        className="py-4 border-t border-gray-300 last:border-b"
                    >
                        <h6 className="font-bold text-sm">{context.field}</h6>
                        <p className="text-md text-justify">{context.value}</p>
                    </div>
                ))}
            </div>
        </BoardLayout>
    );
}
