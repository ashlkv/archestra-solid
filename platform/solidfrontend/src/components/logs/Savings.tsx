import { type JSX, Show } from "solid-js";
import { Tooltip } from "@/components/primitives/Tooltip";
import { formatCost } from "@/lib/interaction.utils";

export function Savings(props: {
    cost: string;
    baselineCost: string;
    toonCostSavings?: string | null;
    toonTokensSaved?: number | null;
    toonSkipReason?: string | null;
    variant?: "default" | "session" | "interaction";
    baselineModel?: string | null;
    actualModel?: string | null;
}): JSX.Element {
    const costNum = () => Number.parseFloat(props.cost);
    const baselineCostNum = () => Number.parseFloat(props.baselineCost);
    const toonCostSavingsNum = () => (props.toonCostSavings ? Number.parseFloat(props.toonCostSavings) : 0);
    const costOptimizationSavings = () => baselineCostNum() - costNum();
    const totalSavings = () => costOptimizationSavings() + toonCostSavingsNum();
    const actualCost = () => baselineCostNum() - totalSavings();
    const savingsPercentNum = () => (baselineCostNum() > 0 ? (totalSavings() / baselineCostNum()) * 100 : 0);
    const savingsPercent = () =>
        savingsPercentNum() % 1 === 0 ? savingsPercentNum().toFixed(0) : savingsPercentNum().toFixed(1);
    const isSession = () => props.variant === "session";

    const tooltipContent = () => {
        const lines: string[] = [];
        if (totalSavings() > 0) {
            lines.push(`Estimated cost: ${formatCost(baselineCostNum())}`);
            lines.push(`Actual cost: ${formatCost(actualCost())}`);
            lines.push(
                `Savings: ${formatCost(totalSavings())}${savingsPercentNum() >= 0.05 ? ` (-${savingsPercent()}%)` : ""}`,
            );
        } else {
            lines.push(`Cost: ${formatCost(actualCost())}`);
        }
        if (isSession()) {
            lines.push("Check session logs for breakdown.");
        } else {
            if (costOptimizationSavings() > 0) {
                let modelInfo = "";
                if (props.baselineModel && props.actualModel && props.baselineModel !== props.actualModel) {
                    modelInfo = ` (${props.baselineModel} → ${props.actualModel})`;
                }
                lines.push(`Model optimization: -${formatCost(costOptimizationSavings())}${modelInfo}`);
            } else {
                lines.push("Model optimization: No matching rule");
            }
            if (toonCostSavingsNum() > 0) {
                const tokenInfo = props.toonTokensSaved
                    ? ` (${props.toonTokensSaved.toLocaleString()} tokens saved)`
                    : "";
                lines.push(`Tool result compression: -${formatCost(toonCostSavingsNum())}${tokenInfo}`);
            } else if (props.toonSkipReason === "not_enabled") {
                lines.push("Tool result compression: Not enabled");
            } else if (props.toonSkipReason === "not_effective") {
                lines.push("Tool result compression: Skipped (no token savings)");
            } else if (props.toonSkipReason === "no_tool_results") {
                lines.push("Tool result compression: No tool results");
            } else {
                lines.push("Tool result compression: Not applied");
            }
        }
        return lines.join("\n");
    };

    return (
        <Tooltip content={tooltipContent()}>
            <span data-label="Savings">
                {formatCost(actualCost())}
                <Show when={savingsPercentNum() >= 0.05}>
                    <span style={{ color: "var(--success)" }}>{` (-${savingsPercent()}%)`}</span>
                </Show>
            </span>
        </Tooltip>
    );
}
