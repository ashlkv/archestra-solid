export function breakTextAtSpace(text = "", position = 0): string {
    if (/\s/.test(text[position] ?? "")) {
        return text.substring(0, position);
    } else {
        const nextSpaceAt = text.split("").findIndex((character, index) => index > position && /\s/.test(character));
        return text.substring(0, nextSpaceAt > -1 ? nextSpaceAt : text.length);
    }
}

export function getLineNumberAtPosition(element: HTMLElement, position: number): { line: number; lines: number } {
    const clone = cloneToMeasure(element);
    clone.innerHTML = breakTextAtSpace(element.innerHTML, position);
    element.parentElement?.appendChild(clone);
    const computedStyle = getComputedStyle(clone);
    const lineHeight = Number.parseFloat(computedStyle["line-height"]);
    const heightAtPosition = clone.offsetHeight;
    element.parentElement?.removeChild(clone);

    return {
        line: Math.round(heightAtPosition / lineHeight) || 1,
        lines: Math.round(element.offsetHeight / lineHeight) || 1,
    };
}

export function getLineStart(element: HTMLElement, startFrom: number): number {
    const { line: lineNumber, lines: lineCount } = getLineNumberAtPosition(element, startFrom);

    if (lineCount === 1) {
        return 0;
    } else {
        let lineStart = 0;

        for (let position = startFrom; position >= 0; position -= 1) {
            const { line: previousLineNumber } = getLineNumberAtPosition(element, position);
            if (previousLineNumber !== lineNumber) {
                lineStart = Math.min(position + 1, startFrom);
                break;
            }
        }

        return lineStart;
    }
}

function cloneToMeasure(element: HTMLElement): HTMLElement {
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.visibility = "hidden";
    clone.style.position = "absolute";
    clone.style.top = "0";
    clone.style.left = "0";
    clone.style.transform = "none";
    clone.innerHTML = element.innerHTML;
    return clone;
}
