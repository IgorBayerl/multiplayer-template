import {
  MessageType,
  GameMessagePayloads
} from "@multiplayer-game/types";
import { Room, Client } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState";
import { IJoinRequest, onJoinOptions } from "./validations/lifecycle";
import { setConfigSchema } from "./validations/config";

type HandlerFunction<T> = (client: Client, data: T) => void;

type MessageHandlers = {
  [key in MessageType]: HandlerFunction<GameMessagePayloads[key]>;
};

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  private handlers: MessageHandlers = {
    [MessageType.ADMIN_START]: this.handleStartGame.bind(this),
    [MessageType.ADMIN_STOP]: this.handleStopGame.bind(this),
    [MessageType.ADMIN_RESET]: this.handleResetGame.bind(this),
    [MessageType.SET_CONFIG]: this.handleSetConfig.bind(this),
  };

  private bindHandlerToMessage<T extends MessageType>(key: T) {
    const specificHandler = this.handlers[key];
    this.onMessage(key, specificHandler);
  }

  onCreate(_options: any) {
    this.setState(new MyRoomState());
    
    // Bind handlers to message types
    for (const key in MessageType) {
      this.bindHandlerToMessage(MessageType[key as keyof typeof MessageType]);
    }
  }

  onJoin(client: Client, options?: IJoinRequest, auth?: any) {
    const result = onJoinOptions.safeParse(options);
    if (!result.success) {
      client.leave(1000, "Invalid join request");
      return;
    }

    console.info(`${result.data.username} joined!`);
    client.send("room:joinedRoom", this.roomId);
  }

  onLeave (client: Client, _consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

  private handleStartGame(_client: Client, _data: null) {
    console.log("start game");
  }

  private handleStopGame(_client: Client, _data: null) {
    console.log("stop game");
  }

  private handleResetGame(_client: Client, _data: null) {
    console.log("reset game");
  }

  private handleSetConfig(_client: Client, data: GameMessagePayloads[MessageType.SET_CONFIG]) {
    console.log("set config", data);
    const result = setConfigSchema.safeParse(data);
    // if (!result.success) {
    //   console.error("Invalid config", data);
    //   return;
    // }

    this.state.config.time = data.time;
    this.state.config.laps = data.laps;
  }
}
