import { createSignal, type JSX, onCleanup } from "solid-js";
import { Input } from "@/components/primitives/Input";

export function DebouncedInput(props: {
    value: string;
    onChange: (value: string) => void;
    debounceMs?: number;
    placeholder?: string;
    class?: string;
}): JSX.Element {
    const [localValue, setLocalValue] = createSignal(props.value);
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const onInput = (value: string) => {
        setLocalValue(value);
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            props.onChange(value);
        }, props.debounceMs ?? 400);
    };

    onCleanup(() => {
        if (timeoutId) clearTimeout(timeoutId);
    });

    return <Input value={localValue()} onInput={onInput} placeholder={props.placeholder} class={props.class} />;
}
