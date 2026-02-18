import { createSignal, type JSX, onCleanup } from "solid-js";
import { Search } from "@/components/icons";
import { Input } from "@/components/primitives/Input";
import styles from "./SearchInput.module.css";

type SearchInputProps = {
    value: string;
    onChange: (value: string) => void;
    debounceMs?: number;
    placeholder?: string;
    class?: string;
};

export function SearchInput(props: SearchInputProps): JSX.Element {
    const [localValue, setLocalValue] = createSignal(props.value, { name: "localValue" });
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

    return (
        <div class={`${styles.wrapper} ${props.class ?? ""}`}>
            <Search class={styles.icon} />
            <Input value={localValue()} onInput={onInput} placeholder={props.placeholder} class={styles.input} />
        </div>
    );
}
