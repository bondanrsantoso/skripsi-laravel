import Card from "@/Components/Card";
import SecondaryButton from "@/Components/SecondaryButton";
import BoardLayout from "@/Layouts/BoardLayout";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { Dialog } from "@headlessui/react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import dayjs from "dayjs";
import LocaleFormat from "dayjs/plugin/localizedFormat";
import { twMerge } from "tailwind-merge";
import TaskEditor from "./Edit";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import PrimaryButton from "@/Components/PrimaryButton";
import Pill from "@/Components/Pill";
import DangerButton from "@/Components/DangerButton";
import ConfirmDialog from "@/Components/ConfirmDialog";

dayjs.extend(LocaleFormat);

function TaskContainer({ children, statusId, status = "", ...props }) {
    const { isOver, setNodeRef } = useDroppable({
        id: statusId,
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
            <div className="space-y-4">{children}</div>
        </div>
    );
}

function TaskItem({ task, onSelect, onDelete, ...props }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({
            id: task.id,
            data: task,
        });
    const style = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          }
        : null;

    return (
        <div
            className={twMerge(
                "p-4 pt-0 rounded-md dark:bg-slate-800 bg-white space-y-4",
                isDragging ? "z-50" : ""
            )}
            style={style}
        >
            {task.is_editable ? (
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
            ) : (
                <div className="mb-2 w-full h-4"></div>
            )}
            <p className="font-bold">{task.title}</p>
            <div className="flex flex-row flex-wrap gap-2">
                <Pill
                    className={twMerge(
                        "font-bold",
                        task.priority === 0
                            ? "bg-gray-300"
                            : task.priority === 1
                            ? "bg-orange-300"
                            : "bg-red-400"
                    )}
                >
                    {task.priority_label}
                </Pill>
                {task.assignee.map((a) => (
                    <Pill className="font-bold bg-blue-300">{a.name}</Pill>
                ))}
            </div>
            <p className="text-sm opacity-75">
                Terakhir diubah: {dayjs(task.updated_at).format("LLL")}
            </p>
            <p className="text-sm">
                <span className="opacity-75">Dibuat Oleh:</span>
                <Pill className="bg-blue-300 font-bold ml-2">
                    {task.owner.name}
                </Pill>
            </p>
            {(task.due_start || task.due_end) && (
                <Fragment>
                    <hr className="opacity-50" />
                    <div className="space-y-1">
                        {task.due_start && (
                            <p className="text-sm opacity-75">
                                Mulai : {dayjs(task.due_start).format("LLL")}
                            </p>
                        )}
                        {task.due_end && (
                            <p className="text-sm opacity-75">
                                <i>Deadline</i> :{" "}
                                {dayjs(task.due_end).format("LLL")}
                            </p>
                        )}
                    </div>
                </Fragment>
            )}
            <div className="mt-2 flex gap-2 justify-end">
                {task.is_deletable && (
                    <DangerButton type="button" onClick={onDelete}>
                        Hapus
                    </DangerButton>
                )}
                <SecondaryButton type="button" onClick={onSelect}>
                    Detail
                </SecondaryButton>
            </div>
        </div>
    );
}

export default function TaskView({
    boards,
    tasks: taskData,
    statusLabels,
    priorityLabels,
    activeBoard,
    auth,
    ...props
}) {
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskToBeDeleted, setTaskToBeDeleted] = useState(null);
    const [tasks, setTasks] = useState(taskData || []);
    const [needRefresh, setNeedRefresh] = useState(false);
    const { delete: deleteTask, recentlySuccessful: deleteTaskOK } = useForm();

    useEffect(() => {
        if (deleteTaskOK) {
            setTaskToBeDeleted(null);
        }
    }, [deleteTaskOK]);

    useEffect(() => {
        if (needRefresh) {
            router.reload({
                preserveState: false,
            });
        }
    }, [needRefresh]);

    useEffect(() => {
        setTasks(taskData);
    }, [taskData]);

    // useEffect(() => {
    //     if (
    //         selectedTask !== null &&
    //         typeof selectedTask?.is_editable === "undefined"
    //     ) {
    //         axios
    //             .get(
    //                 route("boards.tasks.show", {
    //                     board: activeBoard.id,
    //                     task: selectedTask.id,
    //                 })
    //             )
    //             .then((res) => {
    //                 setSelectedTask(res.data);
    //                 setShowEditDialog(true);
    //             })
    //             .catch((err) => {
    //                 console.error(err);

    //                 setSelectedTask(null);
    //             });
    //     }
    // }, [selectedTask]);

    function handleDragEnd(e) {
        // Update task status to reflect new status
        /**
         * @type Array
         */
        const taskArr = tasks.slice(0);
        const taskIndex = taskArr.findIndex((t) => t.id === e.active.id);
        if (taskIndex === -1) {
            return;
        }

        const task = taskArr[taskIndex];

        const oldStatus = task.status || 0;
        const newStatus = e.over.id;

        task.status = newStatus;
        setTasks(taskArr);

        function revert() {
            setTasks((taskArr) => {
                const ts = taskArr.slice(0);
                ts[taskIndex].status = oldStatus;

                return ts;
            });
        }

        axios
            .put(
                route("boards.tasks.update", {
                    board: activeBoard.id,
                    task: task.id,
                }),
                {
                    status: newStatus,
                },
                { headers: { Accept: "application/json" } }
            )
            .then((res) => {
                console.log("OK", res);
            })
            .catch((err) => {
                revert();
                // router.reload();
            });
    }

    return (
        <BoardLayout
            user={auth.user}
            boards={boards}
            selectedBoard={activeBoard}
        >
            <Head title="Boards" />
            <Dialog
                as="div"
                className="fixed top-0 left-0 w-screen h-screen overflow-auto flex justify-center items-center bg-dim"
                open={selectedTask !== null || showEditDialog}
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
                        onSubmit={() => {
                            setSelectedTask(null);
                            setShowEditDialog(false);
                            setNeedRefresh(true);
                        }}
                    />
                </Dialog.Panel>
            </Dialog>
            <ConfirmDialog
                open={taskToBeDeleted !== null}
                onConfirm={() => {
                    deleteTask(
                        route("boards.tasks.destroy", {
                            board: activeBoard.id,
                            task: taskToBeDeleted?.id,
                        })
                    );
                }}
                onCancel={() => setSelectedTask(null)}
            >
                <h1 className="font-bold text-lg">
                    Hapus {selectedTask?.title}?
                </h1>
                <p>Tugas yang dihapus tidak dapat dikembalikan</p>
            </ConfirmDialog>
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
                <DndContext onDragEnd={handleDragEnd}>
                    <div className="flex flex-row flex-wrap overflow-x-hidden overflow-y-hidden w-full min-h-[60vh] gap-3">
                        {statusLabels.map((status, i) => (
                            <TaskContainer key={i} statusId={i} status={status}>
                                {tasks
                                    .filter((t) => t.status === i)
                                    .map((t, iTask) => (
                                        <TaskItem
                                            onSelect={() => {
                                                setSelectedTask(t);
                                            }}
                                            onDelete={() => {
                                                setTaskToBeDeleted(t);
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
