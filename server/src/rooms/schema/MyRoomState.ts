import { Schema, Context, type } from "@colyseus/schema";
import { RoomConfigSchema, TRoomConfig } from "./RoomConfig";

export class MyRoomState extends Schema {

  @type(RoomConfigSchema) config: TRoomConfig = new RoomConfigSchema();
  @type("number") time: number = 0;

}
