import type { JSX } from "solid-js";
import { Show } from "solid-js";
import { X } from "@/components/icons";
import { Button } from "@/components/primitives/Button";
import { SearchInput } from "@/components/primitives/SearchInput";

// import { DateTimeRangePicker } from "@/components/logs/DateTimeRangePicker";
// import { SearchableSelect } from "@/components/logs/SearchableSelect";
// import type { Agent } from "@/types";

interface SessionsFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    // profileId: string;
    // onProfileIdChange: (value: string) => void;
    // profileItems: { value: string; label: string }[];
    // userId: string;
    // onUserIdChange: (value: string) => void;
    // userIdItems: { value: string; label: string }[];
    // startDate: string;
    // endDate: string;
    // onDateApply: (start: string, end: string) => void;
    // onDateClear: () => void;
    // hasFilters: boolean;
    // onClearFilters: () => void;
}

export function SessionsFilters(props: SessionsFiltersProps): JSX.Element {
    return (
        <div
            data-label="Filters"
            style={{
                display: "flex",
                "flex-wrap": "wrap",
                gap: "0.5rem",
                "align-items": "center",
            }}
        >
            <SearchInput
                value={props.search}
                onChange={(value) => props.onSearchChange(value)}
                placeholder="Search sessions..."
            />
            {/*<SearchableSelect
                value={props.profileId}
                onValueChange={(value) => props.onProfileIdChange(value)}
                items={props.profileItems}
                placeholder="All profiles"
            />
            <SearchableSelect
                value={props.userId}
                onValueChange={(value) => props.onUserIdChange(value)}
                items={props.userIdItems}
                placeholder="All users"
            />
            <DateTimeRangePicker
                startDate={props.startDate}
                endDate={props.endDate}
                onApply={(start, end) => props.onDateApply(start, end)}
                onClear={() => props.onDateClear()}
            />
            <Show when={props.hasFilters}>
                <Button variant="ghost" size="small" onClick={() => props.onClearFilters()}>
                    <X style={{ width: "14px", height: "14px" }} /> Clear filters
                </Button>
            </Show>*/}
        </div>
    );
}
