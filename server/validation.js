import { z } from "zod";
import { accessOptions } from "./data.js";
export const keys = accessOptions.map((a) => a.key);
const text = (min, max) => z.string().trim().min(min).max(max);
export const eventInput = z
  .object({
    title: text(3, 100),
    category: z.enum([
      "Outdoors",
      "Workshops",
      "Music",
      "Culture",
      "Food & community",
    ]),
    description: text(20, 3000),
    venue: text(3, 120),
    area: text(2, 80),
    date: z
      .string()
      .datetime()
      .refine((d) => new Date(d) > new Date(), "Choose a future date"),
    duration: z.number().int().min(15).max(720),
    price: z.number().int().min(0).max(100000),
    capacity: z.number().int().min(1).max(500),
    access: z.object(
      Object.fromEntries(keys.map((k) => [k, z.boolean().nullable()])),
    ),
    accessNotes: text(10, 2000),
    transport: text(10, 1000),
    noise: text(5, 1000),
  })
  .strict();
export const bookingInput = z
  .object({
    name: text(2, 80),
    email: z.string().trim().email().max(254),
    note: z.string().trim().max(1000).default(""),
  })
  .strict();
export const profileInput = z
  .object({
    needs: z.array(z.enum(keys)).max(keys.length),
    saved: z.array(z.string().regex(/^[a-f\d]{24}$/)).max(100),
  })
  .strict();
export { matchEvent } from "../shared/matching.js";
