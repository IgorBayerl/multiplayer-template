export enum MessageType {
  ADMIN_START = "admin:start",
  ADMIN_STOP = "admin:stop",
  ADMIN_RESET = "admin:reset",
  SET_CONFIG = "admin:set-config",
}

export type SetConfigPayload = RoomConfig;

export type GameMessagePayloads = {
  [MessageType.ADMIN_START]: null;
  [MessageType.ADMIN_STOP]: null;
  [MessageType.ADMIN_RESET]: null;
  [MessageType.SET_CONFIG]: SetConfigPayload;
};

export interface MyRoomState {
  config: RoomConfig;
  time: number;
}

export interface RoomConfig {
  time: number;
  laps: number;
}