import { z } from "zod";
export declare const TIP_PRESETS: readonly [0, 5, 10, 15, 20];
export type TipPreset = (typeof TIP_PRESETS)[number];
export declare const MoneyAmountSchema: z.ZodEffects<z.ZodObject<{
    amountCents: z.ZodNumber;
    tipCents: z.ZodNumber;
    totalCents: z.ZodNumber;
    tipPercent: z.ZodUnion<[z.ZodLiteral<0>, z.ZodLiteral<5>, z.ZodLiteral<10>, z.ZodLiteral<15>, z.ZodLiteral<20>, z.ZodLiteral<"custom">]>;
}, "strip", z.ZodTypeAny, {
    amountCents: number;
    tipCents: number;
    totalCents: number;
    tipPercent: 0 | "custom" | 5 | 10 | 15 | 20;
}, {
    amountCents: number;
    tipCents: number;
    totalCents: number;
    tipPercent: 0 | "custom" | 5 | 10 | 15 | 20;
}>, {
    amountCents: number;
    tipCents: number;
    totalCents: number;
    tipPercent: 0 | "custom" | 5 | 10 | 15 | 20;
}, {
    amountCents: number;
    tipCents: number;
    totalCents: number;
    tipPercent: 0 | "custom" | 5 | 10 | 15 | 20;
}>;
export type MoneyAmount = z.infer<typeof MoneyAmountSchema>;
/** Format cents as USD string: 2550 → "$25.50" */
export declare function formatCents(cents: number): string;
/** Parse dollar string to cents: "$25.50" → 2550 */
export declare function parseDollarsToCents(dollars: number): number;
/** Compute tip cents from amount and percent */
export declare function computeTipCents(amountCents: number, tipPercent: number): number;
