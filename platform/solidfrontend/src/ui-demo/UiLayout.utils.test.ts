import { describe, expect, it } from "vitest";
import { filterUiNavItems } from "./UiLayout.utils";

describe("filterUiNavItems", () => {
    it("returns all items when the query is empty", () => {
        const items = [
            { title: "Input", url: "/ui/input" },
            { title: "Textarea", url: "/ui/textarea" },
        ];

        expect(filterUiNavItems({ items, searchQuery: "" })).toEqual(items);
    });

    it("filters items case-insensitively by title", () => {
        const items = [
            { title: "Input", url: "/ui/input" },
            { title: "Text input", url: "/ui/text-input" },
            { title: "Tooltip", url: "/ui/tooltip" },
        ];

        expect(filterUiNavItems({ items, searchQuery: "input" })).toEqual([
            { title: "Input", url: "/ui/input" },
            { title: "Text input", url: "/ui/text-input" },
        ]);
    });
});
