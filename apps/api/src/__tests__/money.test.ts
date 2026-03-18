import { describe, it, expect } from "vitest";
import { MoneyAmountSchema, formatCents, computeTipCents } from "@gosupportme/contracts";

describe("MoneyAmountSchema", () => {
  it("accepts valid donation with tip", () => {
    const result = MoneyAmountSchema.safeParse({
      amountCents: 5000,
      tipCents: 500,
      totalCents: 5500,
      tipPercent: 10,
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid donation with 0% tip", () => {
    const result = MoneyAmountSchema.safeParse({
      amountCents: 10000,
      tipCents: 0,
      totalCents: 10000,
      tipPercent: 0,
    });
    expect(result.success).toBe(true);
  });

  it("rejects when totalCents does not equal amountCents + tipCents", () => {
    const result = MoneyAmountSchema.safeParse({
      amountCents: 5000,
      tipCents: 500,
      totalCents: 6000, // wrong — should be 5500
      tipPercent: 10,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("totalCents");
    }
  });

  it("rejects negative amountCents", () => {
    const result = MoneyAmountSchema.safeParse({
      amountCents: -100,
      tipCents: 0,
      totalCents: -100,
      tipPercent: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative tipCents", () => {
    const result = MoneyAmountSchema.safeParse({
      amountCents: 5000,
      tipCents: -50,
      totalCents: 4950,
      tipPercent: 0,
    });
    expect(result.success).toBe(false);
  });

  it("accepts custom tip percent", () => {
    const result = MoneyAmountSchema.safeParse({
      amountCents: 10000,
      tipCents: 300,
      totalCents: 10300,
      tipPercent: "custom",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid tipPercent value", () => {
    const result = MoneyAmountSchema.safeParse({
      amountCents: 5000,
      tipCents: 375,
      totalCents: 5375,
      tipPercent: 7.5, // not in allowed set
    });
    expect(result.success).toBe(false);
  });
});

describe("formatCents", () => {
  it("formats cents to USD string", () => {
    expect(formatCents(5000)).toBe("$50.00");
    expect(formatCents(100)).toBe("$1.00");
    expect(formatCents(2550)).toBe("$25.50");
    expect(formatCents(0)).toBe("$0.00");
  });
});

describe("computeTipCents", () => {
  it("computes tip correctly for whole percent", () => {
    expect(computeTipCents(10000, 10)).toBe(1000);
    expect(computeTipCents(10000, 15)).toBe(1500);
    expect(computeTipCents(10000, 0)).toBe(0);
  });

  it("rounds tip cents correctly (no float rounding errors)", () => {
    // $33.33 at 10% = $3.33 = 333 cents
    expect(computeTipCents(3333, 10)).toBe(333);
    // $99.99 at 5% = $5.00 = 500 cents
    expect(computeTipCents(9999, 5)).toBe(500);
  });
});
