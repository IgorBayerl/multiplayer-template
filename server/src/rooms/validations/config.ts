import {z} from "zod";

export const setConfigSchema = z.object({
  time: z.number().min(0).max(10000),
  laps: z.number().min(1).max(100),
});

export type ISetConfig = z.infer<typeof setConfigSchema>;
