import ButtonLink from "@/Components/ButtonLink";
import Card from "@/Components/Card";
import DangerButton from "@/Components/DangerButton";
import SortedTable from "@/Components/Datatable";
import QuillEditor from "@/Components/QuillEditor";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import BoardLayout from "@/Layouts/BoardLayout";
import { formatCurrency } from "@/lib/currencyFormat";
import { Dialog, Disclosure } from "@headlessui/react";
import { Head, router, useForm } from "@inertiajs/react";
import axios from "axios";
import dayjs from "dayjs";
import LocaleFormat from "dayjs/plugin/localizedFormat";
import { Fragment, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { upload } from "./Edit.lib";
import Spinner from "@/Components/Spinner";
import BoardItem from "./Partials/BoardItem";
import Pill from "@/Components/Pill";
import CollaboratorEditor from "./Partials/Collaborators";

dayjs.extend(LocaleFormat);

let syncTimeout;
let contentSyncTimeout;

export default function BoardEditView({
    board,
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
    const { data, setData, post, reset, setDefaults, isDirty } = useForm({
        id: board.id,
        title: board.title || "",
        project_id: board.project_id || null,
        brief: board.brief || "",
        users: board.users,
    });

    const [showCollaboratorEditor, setShowCollaboratorEditor] = useState(false);

    const [isSyncing, setSyncing] = useState(false);
    const [boardList, setBoardList] = useState(boards);

    const newSectionRef = useRef(null);

    const dragZoneRef = useRef(document.querySelector("#app"));

    const [showDragUI, setShowDragUI] = useState(false);
    const [dragDataTransfer, setDragDataTransfer] = useState(null);

    const [boardItems, setBoardItems] = useState(board.items || []);

    const [filesUploading, setFilesUploading] = useState([]);

    useEffect(() => {
        const _boards = boardList.slice(0);
        if (_boards.length > 0) {
            const i = _boards.findIndex((b) => b.id === board.id);
            if (i >= -1) {
                _boards[i].title = data.title;
            }

            setBoardList(_boards);
        }
    }, [data.title]);

    useEffect(() => {
        if (dragDataTransfer?.items?.length) {
            console.table(dragDataTransfer?.items);
        }
    }, [dragDataTransfer]);

    /**
     * DragEnter
     * @param {DragEvent} e
     */
    function handleDragEnter(e) {
        e.preventDefault();
        e.stopPropagation();

        console.log("Dragged Files", e.dataTransfer.getData("hex"));

        console.log("Drag enter");
        setShowDragUI(true);
    }

    /**
     * DragLeave
     * @param {DragEvent} e
     */
    function handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();

        console.log("Drag leave");
        setShowDragUI(false);
    }

    function handleDragOver(e) {
        e.preventDefault();
        setDragDataTransfer(e.dataTransfer);
    }

    function addNewItem(itemData) {
        setBoardItems((boardItems) => {
            const items = boardItems.slice(0);
            items.push(itemData);
            return items;
        });
    }

    const [noteUpdateQueue, setNoteUpdateQueue] = useState([]);

    useEffect(() => {
        // Sync notes data

        const items = boardItems
            .slice(0)
            .map((item, i) => ({ ...item, _index: i }));
        const dirtyNotes = items.filter((b) => b.isDirty);

        if (dirtyNotes.length) {
            if (contentSyncTimeout) {
                clearTimeout(contentSyncTimeout);
            }

            contentSyncTimeout = setTimeout(() => {
                // Throttle update for 500ms so there's no sudden request
                const queue = noteUpdateQueue.slice(0);
                for (const note of dirtyNotes) {
                    // queue up the update request so that it can be run sequentially
                    queue.push({
                        isStarted: false,
                        isCompleted: false,
                        run: () =>
                            axios.put(
                                route("boards.board_notes.update", {
                                    board: board.id,
                                    board_note: note.id,
                                }),
                                note,
                                {
                                    withCredentials: true,
                                    headers: { Accept: "application/json" },
                                }
                            ),
                    });
                    items[note._index].isDirty = false;
                }

                setNoteUpdateQueue(queue);
                setBoardItems(items);
            }, 500);
        }
    }, [boardItems]);

    useEffect(() => {
        // This is the 'side effect' routine to actually commit and perform sync
        // request of board items

        const queue = noteUpdateQueue.slice(0);
        const i = queue.findIndex((q) => !q.isStarted);

        const alreadyOngoingRequest =
            queue.findIndex((q) => !q.isCompleted && q.isStarted) !== -1;

        if (alreadyOngoingRequest) {
            // Halt new request if there's an incomplete, ongoing request
            return;
        }

        if (i !== -1) {
            queue[i].isStarted = true;
            queue[i].run().then((response) => {
                setNoteUpdateQueue((queueItems) => {
                    const q = queueItems.slice(0);
                    q[i].isCompleted = true;
                    return q;
                });
            });

            setNoteUpdateQueue(queue);
        }

        if (queue.length > 0 && queue.findIndex((q) => !q.isCompleted) === -1) {
            setNoteUpdateQueue([]);
        }
    }, [noteUpdateQueue]);

    // function addFileUploadToQueue(file) {
    //     setFilesUploading(filesQueue);
    //     const filesQueue = filesUploading.slice(0);
    //     const fileIndex =
    //         filesQueue.push({ file: file, isUploading: true }) - 1;

    //     return fileIndex;
    // }

    useEffect(() => {
        const uploadQueue = filesUploading.slice(0);

        let newUploadStarted = false;
        let i = 0;

        for (const q of uploadQueue) {
            if (!newUploadStarted && !q.isStarted && !q.isCompleted) {
                uploadQueue[i].isStarted = true;
                upload(q.file, board.id, boardItems.length).then((response) => {
                    setFilesUploading((files) => {
                        const items = files.slice(0);
                        items[i].isCompleted = true;

                        return items;
                    });
                    addNewItem({
                        type: "file",
                        ...response.data,
                    });
                });
                newUploadStarted = true;

                // Break after a new upload request started to prevent dupe and
                // too much request at once;
                // Essentially we wait until another cycle of useEffect()
                // Before starting a next upload
                break;
            }

            i++;
        }

        if (newUploadStarted) {
            setFilesUploading(uploadQueue);
        }

        if (
            filesUploading.length &&
            filesUploading.filter((q) => !q.isCompleted).length === 0
        ) {
            setFilesUploading([]);
        }
    }, [filesUploading]);

    /**
     * Handle drop
     * @param {DragEvent} e Drag event
     */
    function handleDrop(e) {
        e.preventDefault();

        const uploadQueue = filesUploading.slice(0);
        setShowDragUI(false);
        if (e.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            [...e.dataTransfer.items].forEach((item, i) => {
                // If dropped items aren't files, reject them

                if (item.kind === "file") {
                    const file = item.getAsFile();
                    console.log(`… file[${i}].name = ${file.name}`);
                    const queueIndex =
                        uploadQueue.push({
                            file: file,
                            isCompleted: false,
                            isStarted: false,
                        }) - 1;
                }
            });
        } else {
            // Use DataTransfer interface to access the file(s)
            [...e.dataTransfer.files].forEach((file, i) => {
                console.log(`… file[${i}].name = ${file.name}`);
                const queueIndex =
                    uploadQueue.push({
                        file: file,
                        isCompleted: false,
                        isStarted: false,
                    }) - 1;
            });
        }
        setFilesUploading(uploadQueue);
    }

    useEffect(() => {
        if (syncTimeout) {
            clearTimeout(syncTimeout);
            setSyncing(false);
        }

        syncTimeout = setTimeout(() => {
            setSyncing(true);
            axios
                .put(route("boards.update", { board: board.id }), {
                    ...data,
                    users: data.users.map((u) => ({
                        id: u.id,
                        role: u.pivot.role,
                    })),
                })
                .then((res) => {
                    console.log("Saved");
                    // setDefaults(res.data);
                    // reset();
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    setSyncing(false);
                });
        }, 500);
    }, [data.brief, data.project_id, data.title, data.users, isDirty]);

    return (
        <BoardLayout
            user={auth.user}
            syncing={
                isSyncing ||
                filesUploading.length > 0 ||
                noteUpdateQueue.length > 0
            }
            boards={boardList}
            selectedBoard={data}
        >
            <Head title="Boards" />
            <Dialog
                as="div"
                className="fixed top-0 left-0 w-screen h-screen overflow-auto flex justify-center items-center"
                open={showCollaboratorEditor}
                onClose={() => {
                    setShowCollaboratorEditor(false);
                }}
            >
                <Dialog.Panel
                    as="div"
                    className="w-full flex items-center justify-center relative"
                >
                    <CollaboratorEditor
                        users={data.users}
                        myself={auth.user}
                        className="mt-20 mb-20 relative"
                        onChange={(users) => {
                            setData(
                                "users",
                                users
                                    .sort((a, b) => b.pivot.role - a.pivot.role)
                                    .map((u) => u)
                            );
                            setShowCollaboratorEditor(false);
                        }}
                    />
                </Dialog.Panel>
            </Dialog>
            {showDragUI && (
                <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="fixed top-0 left-0 w-screen h-screen p-10 z-10"
                >
                    <Card className="w-full h-full flex items-center justify-center">
                        <p className="text-center">
                            Tarik <i>file</i> ke sini untuk mengunggah...
                        </p>
                    </Card>
                </div>
            )}
            <div
                className="w-full space-y-6"
                onDragEnter={(e) => setShowDragUI(true)}
                id="wrapper"
            >
                <TextInput
                    className="text-4xl border-0 border-b rounded-none w-full focus:ring-0"
                    placeholder="Judul"
                    value={data.title}
                    onChange={(e) => {
                        setData("title", e.target.value);
                    }}
                />
                <p className="text-sm opacity-75">
                    Terakhir diperbaharui pada:{" "}
                    {dayjs(board.updated_at).format("LLL")}
                </p>
                <div className="flex flex-row gap-3 flex-wrap">
                    {data.users.map((user, i) => (
                        <Pill
                            className={twMerge(
                                "py-0 pl-0 flex flex-row gap-2 items-center",
                                user.pivot.role === 0
                                    ? "bg-gray-400"
                                    : "bg-emerald-400"
                            )}
                            key={i}
                        >
                            <img
                                src={user.photo_url}
                                alt={user.name}
                                className="rounded-full inline-block w-8 h-8"
                            />
                            <div className="inline-block">{user.name}</div>
                        </Pill>
                    ))}
                    {board.is_editable && (
                        <Pill
                            as="button"
                            type="button"
                            className="bg-emerald-500 hover:bg-emerald-300 flex flex-row items-center gap-2"
                            onClick={() => {
                                setShowCollaboratorEditor(true);
                            }}
                        >
                            <i className="bi-gear"></i>
                            Atur akses
                        </Pill>
                    )}
                </div>
                {/* <QuillEditor
                    value={data.brief}
                    onChange={(value) => setData("brief", value)}
                    placeholder="Penjelasan Singkat"
                /> */}
                {/* <div
                    className={twMerge(
                        "w-full h-full bg-red-500 top-0 left-0",
                        showDropzone ? "absolute" : "hidden"
                    )}
                ></div> */}
                {/* <Card
                    className="w-full h-40 border !bg-transparent shadow-none border-gray-300 border-dashed"
                    id="new-section"
                >
                </Card> */}
                {boardItems.map((item, i) => (
                    <BoardItem
                        key={i}
                        item={item}
                        onChange={(value, delta) => {
                            const items = boardItems.slice(0);
                            items[i].content = value;
                            items[i].isDirty = true;

                            console.log(delta);
                            setBoardItems(items);
                        }}
                        readOnly={!board.is_editable}
                    />
                ))}
                {filesUploading.length > 0 && (
                    <div className="w-full flex flex-row gap-4 items-center">
                        <Spinner />
                        <p>
                            Mengunggah{" "}
                            {filesUploading.filter((q) => q.isCompleted).length}{" "}
                            / {filesUploading.length} file
                        </p>
                    </div>
                )}
                {board.is_editable && (
                    <div
                        className="w-full h-20 py-4 flex flex-row gap-2"
                        ref={newSectionRef}
                    >
                        <div className="w-full flex flex-row gap-4">
                            <SecondaryButton
                                onClick={(e) => {
                                    setSyncing(true);

                                    axios
                                        .post(
                                            route("boards.board_notes.store", {
                                                board: board.id,
                                            }),
                                            {
                                                order: boardItems?.length || 0,
                                            },
                                            {
                                                headers: {
                                                    Accept: "application/json",
                                                },
                                                withCredentials: true,
                                            }
                                        )
                                        .then((response) => {
                                            addNewItem(response.data);
                                            setSyncing(false);
                                        });
                                }}
                                type="button"
                            >
                                <div className="flex items-baseline">
                                    <i className="bi-plus-lg mr-2 text-lg"></i>
                                    <p>Tambah Teks</p>
                                </div>
                            </SecondaryButton>

                            <SecondaryButton
                                as="label"
                                htmlFor="hidden-file-input"
                                type="button"
                            >
                                <div className="flex items-baseline">
                                    <i className="bi-upload mr-2 text-lg"></i>
                                    <p>Unggah berkas</p>
                                </div>
                            </SecondaryButton>

                            <input
                                type="file"
                                id="hidden-file-input"
                                multiple
                                className="hidden"
                                onChange={(e) => {
                                    const files = e.target.files;
                                    const uploadQueue = filesUploading.slice(0);

                                    for (const file of files) {
                                        uploadQueue.push({
                                            isStarted: false,
                                            isCompleted: false,
                                            file,
                                        });
                                    }

                                    setFilesUploading(uploadQueue);
                                    e.target.value = null;
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
            {/* <div>
                <pre>{JSON.stringify(board, null, 2)}</pre>
            </div> */}
            {/* <div></div> */}
        </BoardLayout>
    );
}
