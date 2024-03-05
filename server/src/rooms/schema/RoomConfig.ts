import { Schema, Context, type } from "@colyseus/schema";

export class RoomConfigSchema extends Schema {
  @type("number") time: number = 1000;
  @type("number") laps: number = 5;
}


export type TRoomConfig = typeof RoomConfigSchema.prototype;