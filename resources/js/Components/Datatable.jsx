import { useState, createContext, useContext } from "react";

const DataTableContext = createContext();

function SortedTable({
    children,
    className,
    onSortChange,
    sortBy = {},
    ...props
}) {
    return (
        <DataTableContext.Provider value={{ onSortChange, sortBy }}>
            <table className={className}>{children}</table>
        </DataTableContext.Provider>
    );
}

function TableHeader({
    children,
    className,
    name,
    sortable = false,
    ...props
}) {
    const { sortBy, onSortChange } = useContext(DataTableContext);

    return (
        <th
            {...props}
            className={`${
                sortable ? "cursor-pointer" : "cursor-default"
            } ${className}`}
            onClick={(e) => {
                if (!sortable) {
                    return;
                }
                const order = { ...sortBy };
                if (!order[name]) {
                    order[name] = "asc";
                } else if (order[name] === "asc") {
                    order[name] = "desc";
                } else {
                    order[name] = undefined;
                }

                console.log(order);

                onSortChange(order);
            }}
        >
            {children}
            {sortBy[name] && (
                <i
                    className={`bi-chevron-${
                        sortBy[name] === "asc" ? "up" : "down"
                    } ml-3`}
                ></i>
            )}
        </th>
    );
}

SortedTable.Th = TableHeader;

export default SortedTable;
