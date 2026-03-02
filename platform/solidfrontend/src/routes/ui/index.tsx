import type { JSX } from "solid-js";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function UiIndex(): JSX.Element {
	return (
		<UiLayout>
			<div
				style={{
					display: "flex",
					"align-items": "center",
					"justify-content": "center",
					height: "100%",
					color: "var(--muted-foreground)",
				}}
				data-label="UiIndexBlank"
			>
				Select a component from the sidebar
			</div>
		</UiLayout>
	);
}
