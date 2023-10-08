import { useState, forwardRef, useRef, useEffect } from "react";
import TextInput from "./TextInput";
import { Popover } from "@headlessui/react";
import Card from "./Card";
import dayjs from "dayjs";

export default forwardRef(function TimePicker(
    {
        value,
        className = "",
        isFocused = false,
        showHours = true,
        showSeconds = false,
        ...props
    },
    ref
) {
    const input = ref ? ref : useRef();
    const [revealed, setRevealed] = useState(false);
    const [displayTime, setDisplayTime] = useState("");

    useEffect(() => {
        let format = "mm";
        if (showHours) {
            format = "HH:" + format;
        }
        if (showSeconds) {
            format += ":ss";
        }

        setDisplayTime(dayjs());
    }, [value]);

    return (
        <Popover className="relative">
            <Popover.Button>
                <input
                    {...props}
                    type="text"
                    className={[
                        "w-full dark:text-white bg-transparent focus:border-indigo-500 focus:ring-indigo-500 border-gray-300 shadow-sm rounded-md border",
                        className,
                    ]}
                    ref={input}
                    readOnly
                />
            </Popover.Button>
            <Popover.Panel className="mt-3 absolute">
                <div className="p-3 bg-white dark:bg-zinc-700 dark:text-white rounded-md">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Aspernatur perferendis cum minima quod veritatis fuga neque
                    assumenda voluptatum delectus porro, consectetur nemo illum
                    nobis optio fugit sed minus deserunt reprehenderit?
                </div>
            </Popover.Panel>
        </Popover>
    );
});
