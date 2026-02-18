import { createSignal, type JSX } from "solid-js";
import { CalendarIcon } from "@/components/icons";
import { Button } from "@/components/primitives/Button";
import { Dialog, DialogContent } from "@/components/primitives/Dialog";

export function DateTimeRangePicker(props: {
    startDate?: string;
    endDate?: string;
    onApply: (startDate: string, endDate: string) => void;
    onClear: () => void;
}): JSX.Element {
    const [isOpen, setIsOpen] = createSignal(false, { name: "isOpen" });
    const [fromDate, setFromDate] = createSignal("", { name: "fromDate" });
    const [fromTime, setFromTime] = createSignal("00:00", { name: "fromTime" });
    const [toDate, setToDate] = createSignal("", { name: "toDate" });
    const [toTime, setToTime] = createSignal("23:59", { name: "toTime" });

    const displayText = () => {
        if (!props.startDate || !props.endDate) return undefined;
        const start = new Date(props.startDate);
        const end = new Date(props.endDate);
        return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
    };

    const openDialog = () => {
        if (props.startDate) {
            const start = new Date(props.startDate);
            setFromDate(start.toISOString().split("T")[0]);
            setFromTime(
                `${String(start.getUTCHours()).padStart(2, "0")}:${String(start.getUTCMinutes()).padStart(2, "0")}`,
            );
        } else {
            setFromDate("");
            setFromTime("00:00");
        }
        if (props.endDate) {
            const end = new Date(props.endDate);
            setToDate(end.toISOString().split("T")[0]);
            setToTime(`${String(end.getUTCHours()).padStart(2, "0")}:${String(end.getUTCMinutes()).padStart(2, "0")}`);
        } else {
            setToDate("");
            setToTime("23:59");
        }
        setIsOpen(true);
    };

    const onApply = () => {
        if (!fromDate() || !toDate()) return;
        const [fromH, fromM] = fromTime().split(":").map(Number);
        const [toH, toM] = toTime().split(":").map(Number);
        const start = new Date(
            `${fromDate()}T${String(fromH).padStart(2, "0")}:${String(fromM).padStart(2, "0")}:00.000Z`,
        );
        const end = new Date(`${toDate()}T${String(toH).padStart(2, "0")}:${String(toM).padStart(2, "0")}:59.999Z`);
        props.onApply(start.toISOString(), end.toISOString());
        setIsOpen(false);
    };

    return (
        <>
            <Button variant="outline" size="small" onClick={openDialog}>
                <CalendarIcon style={{ width: "14px", height: "14px", "margin-right": "0.5rem" }} />
                {displayText() ?? "Pick a date range"}
            </Button>

            <Dialog open={isOpen()} onOpenChange={setIsOpen}>
                <DialogContent title="Select date and time range" size="medium">
                    <div data-label="DateTimeRangePicker" style={{ display: "grid", gap: "1rem" }}>
                        <div style={{ display: "grid", "grid-template-columns": "1fr 1fr", gap: "1rem" }}>
                            <div>
                                <label
                                    style={{
                                        "font-size": "var(--small-font-size)",
                                        "font-weight": "bold",
                                        display: "block",
                                        "margin-bottom": "0.25rem",
                                    }}
                                >
                                    From date
                                </label>
                                <input
                                    type="date"
                                    value={fromDate()}
                                    onInput={(event) => setFromDate(event.currentTarget.value)}
                                    style={{
                                        width: "100%",
                                        padding: "0.5rem",
                                        border: "1px solid var(--border)",
                                        "border-radius": "var(--radius)",
                                        background: "var(--background)",
                                        color: "var(--foreground)",
                                        "font-size": "var(--small-font-size)",
                                    }}
                                />
                            </div>
                            <div>
                                <label
                                    style={{
                                        "font-size": "var(--small-font-size)",
                                        "font-weight": "bold",
                                        display: "block",
                                        "margin-bottom": "0.25rem",
                                    }}
                                >
                                    To date
                                </label>
                                <input
                                    type="date"
                                    value={toDate()}
                                    onInput={(event) => setToDate(event.currentTarget.value)}
                                    style={{
                                        width: "100%",
                                        padding: "0.5rem",
                                        border: "1px solid var(--border)",
                                        "border-radius": "var(--radius)",
                                        background: "var(--background)",
                                        color: "var(--foreground)",
                                        "font-size": "var(--small-font-size)",
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{ display: "grid", "grid-template-columns": "1fr 1fr", gap: "1rem" }}>
                            <div>
                                <label
                                    style={{
                                        "font-size": "var(--small-font-size)",
                                        "font-weight": "bold",
                                        display: "block",
                                        "margin-bottom": "0.25rem",
                                    }}
                                >
                                    From time (UTC)
                                </label>
                                <input
                                    type="time"
                                    value={fromTime()}
                                    onInput={(event) => setFromTime(event.currentTarget.value)}
                                    style={{
                                        width: "100%",
                                        padding: "0.5rem",
                                        border: "1px solid var(--border)",
                                        "border-radius": "var(--radius)",
                                        background: "var(--background)",
                                        color: "var(--foreground)",
                                        "font-size": "var(--small-font-size)",
                                    }}
                                />
                            </div>
                            <div>
                                <label
                                    style={{
                                        "font-size": "var(--small-font-size)",
                                        "font-weight": "bold",
                                        display: "block",
                                        "margin-bottom": "0.25rem",
                                    }}
                                >
                                    To time (UTC)
                                </label>
                                <input
                                    type="time"
                                    value={toTime()}
                                    onInput={(event) => setToTime(event.currentTarget.value)}
                                    style={{
                                        width: "100%",
                                        padding: "0.5rem",
                                        border: "1px solid var(--border)",
                                        "border-radius": "var(--radius)",
                                        background: "var(--background)",
                                        color: "var(--foreground)",
                                        "font-size": "var(--small-font-size)",
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{ display: "flex", "justify-content": "flex-end", gap: "0.5rem" }}>
                            <Button variant="outline" onClick={() => setIsOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={onApply} disabled={!fromDate() || !toDate()}>
                                Apply
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
