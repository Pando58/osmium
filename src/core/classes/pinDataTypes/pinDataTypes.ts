import { z } from "zod";

export const noteEventSchema = z.union([
  z.object({
    type: z.literal("note_on"),
    pitch: z.number().int().min(0).max(127),
    velocity: z.number().int().min(0).max(127),
  }),
  z.object({
    type: z.literal("note_off"),
    pitch: z.number().int().min(0).max(127),
  }),
  z.object({
    type: z.literal("all_notes_off"),
  }),
]);

export const noteSequenceSchema = z.object({
  notes: z.array(noteEventSchema.and(z.object({ position: z.number().int() }))),
  length: z.number().int(),
});

export const pinDataTypesSchema = z.object({
  execution: z.null(),
  integer: z.number().int(),
  boolean: z.boolean(),
  noteEvents: z.array(noteEventSchema),
  noteSequence: noteSequenceSchema,
});

export type NoteEvent = z.infer<typeof noteEventSchema>;
export type NoteSequence = z.infer<typeof noteSequenceSchema>;
export type PinDataTypes = z.infer<typeof pinDataTypesSchema>;
export type PinDataType = keyof PinDataTypes;

export type PinIOType = "input" | "output";

export const pinDataTypeNames: PinDataType[] = [
  "execution",
  "integer",
  "boolean",
  "noteEvents",
  "noteSequence",
];
