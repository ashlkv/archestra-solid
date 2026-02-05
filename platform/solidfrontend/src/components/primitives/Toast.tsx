import { Toast as KobalteToast, toaster } from "@kobalte/core/toast";
import { X } from "@/components/icons";
import { Portal } from "solid-js/web";
import styles from "./Toast.module.css";

interface ToastData {
    title: string;
    variant?: "default" | "destructive";
}

export function ToastRegion() {
    return (
        <Portal>
            <KobalteToast.Region>
                <KobalteToast.List class={styles.region} />
            </KobalteToast.Region>
        </Portal>
    );
}

export function showToast(data: ToastData) {
    toaster.show((props) => (
        <KobalteToast
            toastId={props.toastId}
            class={`${styles.toast} ${data.variant === "destructive" ? styles.destructive : ""}`}
        >
            <KobalteToast.Title>{data.title}</KobalteToast.Title>
            <KobalteToast.CloseButton class={styles.closeButton}>
                <X size={14} />
            </KobalteToast.CloseButton>
        </KobalteToast>
    ));
}

export function showError(title: string) {
    return showToast({ title, variant: "destructive" });
}
