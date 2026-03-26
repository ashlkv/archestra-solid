import { describe, expect, it } from "vitest";
import { shouldWrapTextInput } from "./TextInput.utils";

describe("TextInput utilities", () => {
    it("disables wrapping for numbers and emails", () => {
        expect(shouldWrapTextInput({ format: "number", multiline: true })).toBe(false);
        expect(shouldWrapTextInput({ kind: "email", multiline: true })).toBe(false);
        expect(shouldWrapTextInput({ format: "text", multiline: true })).toBe(true);
        expect(shouldWrapTextInput({ format: "text", multiline: false })).toBe(false);
    });
});
