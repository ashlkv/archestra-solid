import { describe, expect, it } from "vitest";
import { getMcpOptionCardClassNames, shouldShowMcpOptionSelectedIndicator } from "./McpOptionCard.utils";

describe("McpOptionCard utilities", () => {
    it("adds the selected class when the option is selected", () => {
        expect(
            getMcpOptionCardClassNames({
                selected: true,
                class: "custom",
                baseClassName: "card",
                selectedClassName: "selected",
            }),
        ).toBe("card selected custom");
    });

    it("shows the selected indicator only when selected and no end content exists", () => {
        expect(shouldShowMcpOptionSelectedIndicator({ selected: true, hasEndContent: false })).toBe(true);
        expect(shouldShowMcpOptionSelectedIndicator({ selected: true, hasEndContent: true })).toBe(false);
        expect(shouldShowMcpOptionSelectedIndicator({ selected: false, hasEndContent: false })).toBe(false);
    });
});
