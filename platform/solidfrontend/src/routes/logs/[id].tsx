import { A, useParams } from "@solidjs/router";
import type { JSX } from "solid-js";
import { ArrowLeft } from "@/components/icons";
import { InteractionDetailContent } from "@/components/logs/InteractionDetailContent";
import { PageHeader } from "@/components/primitives/PageHeader";

export default function InteractionDetailPage(): JSX.Element {
    const params = useParams<{ id: string }>();

    return (
        <>
            <div style={{ display: "flex", "align-items": "center", gap: "0.5rem", "margin-bottom": "1rem" }}>
                <A href="/logs/llm-proxy" style={{ color: "var(--muted-foreground)" }}>
                    <ArrowLeft style={{ width: "20px", height: "20px" }} />
                </A>
                <PageHeader title="Log entry" description={params.id} />
            </div>

            <InteractionDetailContent interactionId={params.id} view="chat" />
        </>
    );
}
