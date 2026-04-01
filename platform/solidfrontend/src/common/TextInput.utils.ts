export function shouldWrapTextInput(params: {
    format?: "text" | "number";
    kind?: string;
    multiline?: boolean;
}): boolean {
    return params.format !== "number" && params.kind !== "email" && (params.multiline ?? true);
}

export function isTouchDevice(): boolean {
    return typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;
}
