"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const contracts_1 = require("@gosupportme/contracts");
(0, vitest_1.describe)("MoneyAmountSchema", () => {
    (0, vitest_1.it)("accepts valid donation with tip", () => {
        const result = contracts_1.MoneyAmountSchema.safeParse({
            amountCents: 5000,
            tipCents: 500,
            totalCents: 5500,
            tipPercent: 10,
        });
        (0, vitest_1.expect)(result.success).toBe(true);
    });
    (0, vitest_1.it)("accepts valid donation with 0% tip", () => {
        const result = contracts_1.MoneyAmountSchema.safeParse({
            amountCents: 10000,
            tipCents: 0,
            totalCents: 10000,
            tipPercent: 0,
        });
        (0, vitest_1.expect)(result.success).toBe(true);
    });
    (0, vitest_1.it)("rejects when totalCents does not equal amountCents + tipCents", () => {
        const result = contracts_1.MoneyAmountSchema.safeParse({
            amountCents: 5000,
            tipCents: 500,
            totalCents: 6000, // wrong — should be 5500
            tipPercent: 10,
        });
        (0, vitest_1.expect)(result.success).toBe(false);
        if (!result.success) {
            const paths = result.error.issues.map((i) => i.path.join("."));
            (0, vitest_1.expect)(paths).toContain("totalCents");
        }
    });
    (0, vitest_1.it)("rejects negative amountCents", () => {
        const result = contracts_1.MoneyAmountSchema.safeParse({
            amountCents: -100,
            tipCents: 0,
            totalCents: -100,
            tipPercent: 0,
        });
        (0, vitest_1.expect)(result.success).toBe(false);
    });
    (0, vitest_1.it)("rejects negative tipCents", () => {
        const result = contracts_1.MoneyAmountSchema.safeParse({
            amountCents: 5000,
            tipCents: -50,
            totalCents: 4950,
            tipPercent: 0,
        });
        (0, vitest_1.expect)(result.success).toBe(false);
    });
    (0, vitest_1.it)("accepts custom tip percent", () => {
        const result = contracts_1.MoneyAmountSchema.safeParse({
            amountCents: 10000,
            tipCents: 300,
            totalCents: 10300,
            tipPercent: "custom",
        });
        (0, vitest_1.expect)(result.success).toBe(true);
    });
    (0, vitest_1.it)("rejects invalid tipPercent value", () => {
        const result = contracts_1.MoneyAmountSchema.safeParse({
            amountCents: 5000,
            tipCents: 375,
            totalCents: 5375,
            tipPercent: 7.5, // not in allowed set
        });
        (0, vitest_1.expect)(result.success).toBe(false);
    });
});
(0, vitest_1.describe)("formatCents", () => {
    (0, vitest_1.it)("formats cents to USD string", () => {
        (0, vitest_1.expect)((0, contracts_1.formatCents)(5000)).toBe("$50.00");
        (0, vitest_1.expect)((0, contracts_1.formatCents)(100)).toBe("$1.00");
        (0, vitest_1.expect)((0, contracts_1.formatCents)(2550)).toBe("$25.50");
        (0, vitest_1.expect)((0, contracts_1.formatCents)(0)).toBe("$0.00");
    });
});
(0, vitest_1.describe)("computeTipCents", () => {
    (0, vitest_1.it)("computes tip correctly for whole percent", () => {
        (0, vitest_1.expect)((0, contracts_1.computeTipCents)(10000, 10)).toBe(1000);
        (0, vitest_1.expect)((0, contracts_1.computeTipCents)(10000, 15)).toBe(1500);
        (0, vitest_1.expect)((0, contracts_1.computeTipCents)(10000, 0)).toBe(0);
    });
    (0, vitest_1.it)("rounds tip cents correctly (no float rounding errors)", () => {
        // $33.33 at 10% = $3.33 = 333 cents
        (0, vitest_1.expect)((0, contracts_1.computeTipCents)(3333, 10)).toBe(333);
        // $99.99 at 5% = $5.00 = 500 cents
        (0, vitest_1.expect)((0, contracts_1.computeTipCents)(9999, 5)).toBe(500);
    });
});
