import { describe, expect, it } from "vitest";
import { breakTextAtSpace } from "./EditableText.utils";

describe("EditableText utilities", () => {
    it("breaks text at the next whitespace after the caret", () => {
        expect(breakTextAtSpace("hello brave new world", 7)).toBe("hello brave");
        expect(breakTextAtSpace("hello brave", 5)).toBe("hello");
    });
});
