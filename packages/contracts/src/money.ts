import { z } from "zod";

export const TIP_PRESETS = [0, 5, 10, 15, 20] as const;
export type TipPreset = (typeof TIP_PRESETS)[number];

export const MoneyAmountSchema = z
  .object({
    amountCents: z.number().int().positive({ message: "Donation amount must be positive" }),
    tipCents: z.number().int().nonnegative({ message: "Tip cannot be negative" }),
    totalCents: z.number().int().positive({ message: "Total must be positive" }),
    tipPercent: z.union([
      z.literal(0),
      z.literal(5),
      z.literal(10),
      z.literal(15),
      z.literal(20),
      z.literal("custom"),
    ]),
  })
  .refine(
    (data) => data.totalCents === data.amountCents + data.tipCents,
    {
      message: "totalCents must equal amountCents + tipCents",
      path: ["totalCents"],
    }
  );

export type MoneyAmount = z.infer<typeof MoneyAmountSchema>;

/** Format cents as USD string: 2550 → "$25.50" */
export function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

/** Parse dollar string to cents: "$25.50" → 2550 */
export function parseDollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/** Compute tip cents from amount and percent */
export function computeTipCents(amountCents: number, tipPercent: number): number {
  return Math.round((amountCents * tipPercent) / 100);
}
