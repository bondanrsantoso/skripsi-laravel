import { Dialog } from "@headlessui/react";
import Card from "./Card";
import { twMerge } from "tailwind-merge";
import SecondaryButton from "./SecondaryButton";
import PrimaryButton from "./PrimaryButton";

export default function ConfirmDialog({
    children,
    onConfirm,
    onCancel,
    open = false,
    className = "",
    ...props
}) {
    return (
        <Dialog
            as="div"
            className={twMerge(
                "fixed top-0 left-0 w-screen h-screen overflow-auto flex justify-center items-center bg-[rgba(0,0,0,0.7)]",
                className
            )}
            open={open}
            onClose={onCancel}
        >
            <Dialog.Panel
                as="div"
                className="w-full flex items-center justify-center relative"
            >
                <Card className="space-y-6">
                    <div>{children}</div>
                    <div className="flex flex-row-reverse gap-4">
                        <SecondaryButton type="button" onClick={onCancel}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton type="button" onClick={onConfirm}>
                            Ya
                        </PrimaryButton>
                    </div>
                </Card>
            </Dialog.Panel>
        </Dialog>
    );
}
