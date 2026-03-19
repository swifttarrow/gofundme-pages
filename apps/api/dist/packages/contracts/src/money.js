"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoneyAmountSchema = exports.TIP_PRESETS = void 0;
exports.formatCents = formatCents;
exports.parseDollarsToCents = parseDollarsToCents;
exports.computeTipCents = computeTipCents;
const zod_1 = require("zod");
exports.TIP_PRESETS = [0, 5, 10, 15, 20];
exports.MoneyAmountSchema = zod_1.z
    .object({
    amountCents: zod_1.z.number().int().positive({ message: "Donation amount must be positive" }),
    tipCents: zod_1.z.number().int().nonnegative({ message: "Tip cannot be negative" }),
    totalCents: zod_1.z.number().int().positive({ message: "Total must be positive" }),
    tipPercent: zod_1.z.union([
        zod_1.z.literal(0),
        zod_1.z.literal(5),
        zod_1.z.literal(10),
        zod_1.z.literal(15),
        zod_1.z.literal(20),
        zod_1.z.literal("custom"),
    ]),
})
    .refine((data) => data.totalCents === data.amountCents + data.tipCents, {
    message: "totalCents must equal amountCents + tipCents",
    path: ["totalCents"],
});
/** Format cents as USD string: 2550 → "$25.50" */
function formatCents(cents) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(cents / 100);
}
/** Parse dollar string to cents: "$25.50" → 2550 */
function parseDollarsToCents(dollars) {
    return Math.round(dollars * 100);
}
/** Compute tip cents from amount and percent */
function computeTipCents(amountCents, tipPercent) {
    return Math.round((amountCents * tipPercent) / 100);
}
