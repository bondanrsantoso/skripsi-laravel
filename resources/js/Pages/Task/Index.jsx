import Card from "@/Components/Card";
import SecondaryButton from "@/Components/SecondaryButton";
import BoardLayout from "@/Layouts/BoardLayout";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { Dialog } from "@headlessui/react";
import { Head, Link } from "@inertiajs/react";
import dayjs from "dayjs";
import LocaleFormat from "dayjs/plugin/localizedFormat";
import { twMerge } from "tailwind-merge";
import TaskEditor from "./Edit";
import { useEffect, useState } from "react";
import axios from "axios";
import PrimaryButton from "@/Components/PrimaryButton";

dayjs.extend(LocaleFormat);

function TaskContainer({ children, status = "", ...props }) {
    const { isOver, setNodeRef } = useDroppable({
        id: status.replace(/\s+/gi, "-"),
    });
    return (
        <div
            {...props}
            ref={setNodeRef}
            className={twMerge(
                "bg-gray-100 dark:bg-gray-900 p-4 rounded-md grow shrink-0 w-1/3",
                isOver ? "bg-green-200 dark:bg-green-800" : ""
            )}
        >
            <h1 className="text-sm font-bold mb-4">{status}</h1>
            <div>{children}</div>
        </div>
    );
}

function TaskItem({ task, onSelect, ...props }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({
            id: task.id,
        });
    const style = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          }
        : null;

    return (
        <div
            className={twMerge(
                "p-4 pt-0 rounded-md bg-slate-800",
                isDragging ? "z-50" : ""
            )}
            style={style}
        >
            <div
                className="w-full h-4 mb-2 cursor-grab"
                ref={setNodeRef}
                {...attributes}
                {...listeners}
            >
                <p className="w-full text-center">
                    <i className="bi-grip-horizontal"></i>
                </p>
            </div>
            <p className="font-bold">{task.title}</p>
            <p className="text-sm opacity-75">
                Terakhir diubah: {dayjs(task.updated_at).format("LL")}
            </p>
            <div className="mt-2 flex justify-end">
                <SecondaryButton type="button" onClick={onSelect}>
                    Detail
                </SecondaryButton>
            </div>
        </div>
    );
}

export default function TaskView({
    boards,
    tasks,
    statusLabels,
    priorityLabels,
    activeBoard,
    auth,
    ...props
}) {
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        if (
            selectedTask !== null &&
            typeof selectedTask.is_editable === "undefined"
        ) {
            axios
                .get(
                    route("boards.tasks.show", {
                        board: activeBoard.id,
                        task: selectedTask.id,
                    })
                )
                .then((res) => {
                    setSelectedTask(res.data);
                    setShowEditDialog(true);
                })
                .catch((err) => {
                    console.error(err);

                    setSelectedTask(null);
                });
        }
    }, [selectedTask]);

    return (
        <BoardLayout
            user={auth.user}
            boards={boards}
            selectedBoard={activeBoard}
        >
            <Head title="Boards" />
            <Dialog
                as="div"
                className="fixed top-0 left-0 w-screen h-screen overflow-auto flex justify-center items-center"
                open={showEditDialog}
                onClose={() => {
                    // setShowCollaboratorEditor(false);
                }}
            >
                <Dialog.Panel
                    as="div"
                    className="w-full flex items-center justify-center relative"
                >
                    <TaskEditor
                        boardId={activeBoard.id}
                        defaultUser={auth.user}
                        statuses={statusLabels}
                        priorities={priorityLabels}
                        task={selectedTask}
                        className="mt-20 mb-20 relative"
                        onClose={() => {
                            setSelectedTask(null);
                            setShowEditDialog(false);
                        }}
                    />
                </Dialog.Panel>
            </Dialog>
            <div className="space-y-6">
                <SecondaryButton
                    as={Link}
                    href={route("boards.edit", { board: activeBoard.id })}
                >
                    <i className="bi-chevron-left mr-2"></i>
                    <p>Kembali</p>
                </SecondaryButton>
                <h1 className="text-3xl font-bold">Manajer Tugas</h1>
                <PrimaryButton
                    type="button"
                    onClick={() => setShowEditDialog(true)}
                >
                    Buat Tugas Baru
                </PrimaryButton>
                <DndContext>
                    <div className="flex flex-row flex-wrap overflow-x-auto w-full min-h-[60vh] gap-3">
                        {statusLabels.map((status, i) => (
                            <TaskContainer key={i} status={status}>
                                {tasks
                                    .filter((t) => t.status === i)
                                    .map((t, iTask) => (
                                        <TaskItem
                                            onSelect={() => {
                                                setSelectedTask(t);
                                            }}
                                            key={iTask}
                                            task={t}
                                        />
                                    ))}
                            </TaskContainer>
                        ))}
                    </div>
                </DndContext>
            </div>
        </BoardLayout>
    );
}
