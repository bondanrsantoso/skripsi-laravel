import { useState, forwardRef, useRef, useEffect } from "react";
import TextInput from "./TextInput";
import { twMerge } from "tailwind-merge";
import Pill from "./Pill";

export default forwardRef(function ItemizedInput(
    {
        className = "",
        isFocused = false,
        items = [],
        separator = ",",
        placholder = null,
        onChange,
        ...props
    },
    ref
) {
    const input = ref ? ref : useRef();
    const [revealed, setRevealed] = useState(false);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        if (inputValue.split(separator).length > 1) {
            const newItems = items.slice(0);
            newItems.push(inputValue.split(separator)[0]);

            onChange(newItems);
            setInputValue("");
        }
    }, [inputValue]);

    return (
        <div
            className={twMerge(
                "flex flex-row items-stretch border-gray-300 shadow-sm rounded-md border " +
                    className
            )}
        >
            <div className="flex flex-row flex-wrap">
                {items.map((item, i) => (
                    <Pill className="bg-lime-300 text-sm inline-flex items-center pr-0 py-0 m-2 mr-0 shrink-0">
                        {item}
                        <button
                            type="button"
                            className="rounded-full w-8 h-8 bg-transparent hover:bg-[rgba(0,0,0,0.3)] ml-1"
                            onClick={(e) => {
                                const newItems = items.slice(0);
                                newItems.splice(i, 1);
                                onChange(newItems);
                            }}
                        >
                            <span className="text-xl">&times;</span>
                        </button>
                    </Pill>
                ))}
                <input
                    {...props}
                    type="text"
                    value={inputValue}
                    className="grow shrink dark:text-white bg-transparent border-0 focus:border-indigo-500 focus:ring-indigo-500 rounded-md"
                    ref={input}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                    }}
                    onKeyUp={(e) => {
                        if (inputValue.length === 0 && e.key === "Backspace") {
                            const newItems = items.slice(0);
                            newItems.pop();
                            onChange(newItems);
                        }
                    }}
                    placeholder={
                        placholder ||
                        `Type in new items separated by ${
                            separator === " " ? "space" : separator
                        }`
                    }
                />
            </div>
        </div>
    );
});
