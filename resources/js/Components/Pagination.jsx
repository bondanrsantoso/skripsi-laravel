import { twMerge } from "tailwind-merge";
import Select from "./Select";
import ButtonLink from "./ButtonLink";

function Pagination({
    page,
    pageSize,
    pageCount,
    onPageChange,
    onPageSizeChange,
    className,
    disabled = false,
    previousPageUrl = null,
    nextPageUrl = null,
    pageSizes = [15, 25, 50, 100],
    ...props
}) {
    return (
        <div
            className={twMerge(
                "flex justify-between items-baseline flex-row flex-wrap",
                className
            )}
        >
            <div className="flex gap-2 items-baseline flex-row flex-nowrap">
                <span>Showing</span>
                <Select
                    disabled={disabled}
                    value={pageSize}
                    onChange={(e) => {
                        onPageSizeChange(e.target.value);
                    }}
                >
                    {pageSizes.map((x) => (
                        <option key={x} value={x} className="text-black">
                            {x}
                        </option>
                    ))}
                </Select>
                <span>items per page</span>
            </div>
            <div className="flex gap-2 items-stretch flex-row flex-nowrap">
                {previousPageUrl && (
                    <ButtonLink disabled={disabled} href={previousPageUrl}>
                        <i className="bi-chevron-left"></i>
                    </ButtonLink>
                )}
                <Select
                    disabled={disabled}
                    value={page}
                    onChange={(e) => onPageChange(e.target.value)}
                >
                    {new Array(pageCount || 0).fill(0).map((_, x) => (
                        <option key={x} className="text-black" value={x + 1}>
                            {x + 1}
                        </option>
                    ))}
                </Select>
                {nextPageUrl && (
                    <ButtonLink disabled={disabled} href={nextPageUrl}>
                        <i className="bi-chevron-right"></i>
                    </ButtonLink>
                )}
            </div>
        </div>
    );
}

export default Pagination;
