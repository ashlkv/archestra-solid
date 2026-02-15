import { type JSX, Show } from "solid-js";
import { type CostSavingsInput, calculateCostSavings, formatCost } from "@/lib/interaction.utils";
import { Badge } from "./Badge";
import { Tooltip } from "./Tooltip";

interface Props extends CostSavingsInput {
    toonSkipReason?: string | null;
    baselineModel?: string | null;
    actualModel?: string | null;
    variant?: "session" | "interaction";
    class?: string;
}

export function CostBadge(props: Props): JSX.Element {
    const savings = () =>
        calculateCostSavings({
            cost: props.cost,
            baselineCost: props.baselineCost,
            toonCostSavings: props.toonCostSavings,
            toonTokensBefore: props.toonTokensBefore,
            toonTokensAfter: props.toonTokensAfter,
        });

    const savingsPercent = () => {
        const s = savings();
        return s.savingsPercent % 1 === 0 ? s.savingsPercent.toFixed(0) : s.savingsPercent.toFixed(1);
    };

    const tooltipContent = () => {
        const s = savings();
        const lines: string[] = [];

        if (s.hasSavings) {
            lines.push(`Estimated cost: ${formatCost(s.baselineCost)}`);
            lines.push(`Actual cost: ${formatCost(s.actualCost)}`);
            lines.push(
                `Savings: ${formatCost(s.totalSavings)}${s.savingsPercent >= 0.05 ? ` (-${savingsPercent()}%)` : ""}`,
            );
        } else {
            lines.push(`Cost: ${formatCost(s.actualCost)}`);
        }

        if (props.variant === "session") {
            lines.push("Check session logs for breakdown.");
        } else {
            if (s.costOptimizationSavings > 0) {
                let modelInfo = "";
                if (props.baselineModel && props.actualModel && props.baselineModel !== props.actualModel) {
                    modelInfo = ` (${props.baselineModel} \u2192 ${props.actualModel})`;
                }
                lines.push(`Model optimization: -${formatCost(s.costOptimizationSavings)}${modelInfo}`);
            } else {
                lines.push("Model optimization: No matching rule");
            }

            if (s.toonSavings > 0) {
                const tokenInfo = s.toonTokensSaved ? ` (${s.toonTokensSaved.toLocaleString()} tokens saved)` : "";
                lines.push(`Tool result compression: -${formatCost(s.toonSavings)}${tokenInfo}`);
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
            <Badge variant="muted" class={props.class}>
                {formatCost(savings().actualCost)}
                <Show when={savings().savingsPercent >= 0.05}>
                    <span style={{ color: "var(--success)", "margin-left": "0.25rem" }}>-{savingsPercent()}%</span>
                </Show>
            </Badge>
        </Tooltip>
    );
}
