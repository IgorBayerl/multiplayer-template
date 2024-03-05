import {z} from "zod";

export const onJoinOptions = z.object({
  username: z.string().min(1).max(20),
});

export type IJoinRequest = z.infer<typeof onJoinOptions>;
