import { Inter } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useGameContext } from "@/lib/GameContext";
import { RoomConfig } from "@multiplayer-game/types";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  const { joinRoom, leaveRoom,setConfig, myId, gameState } = useGameContext();

  const [username, setUsername] = useState("");
  const [configInput, setConfigInput] = useState<RoomConfig>({
    time: 1000,
    laps: 5,
  });

  const handleJoinRoom = () => {
    joinRoom(username);
  };

  const handleApplyConfig = () => {
    setConfig(configInput);
  };

  const imConnected = myId!== "";

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <h1 className="text-2xl font-bold">Multiplayer Game Template</h1>
      <div className="flex flex-col gap-3 items-center justify-center max-w-5xl w-full">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            Get started by editing the interface&nbsp;
            <code className="font-mono font-bold">client/src/pages/index.tsx</code>
          </p>
        </div>
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            Or by editing the server&nbsp;
            <code className="font-mono font-bold">server/src/rooms/MyRoom.ts</code>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between max-w-5xl w-full">
        <div 
          className="flex flex-col gap-3 items-center justify-center"
        >
          <Input 
            alt="username"
            name="username"
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          <Button
            className="w-full"
            variant="outline"
            onClick={handleJoinRoom}
            disabled={!username || imConnected}
          >
            Join Room
          </Button>
          <Button
            className="w-full"
            variant="secondary"
            onClick={leaveRoom}
            disabled={!imConnected}
          >
            Leave Room
          </Button>
        </div>
        <div>
          <h2 className="flex flex-col gap-3 items-center justify-center text-xl font-bold">
            {myId ? `ID: ${myId}` : "Not connected"}
          </h2>
          <pre 
            className="flex flex-col gap-3 items-center justify-center"
            style={{
              height: "100%",
              overflow: "auto",
              border: "1px solid #333",
              borderRadius: "8px",
              padding: "16px",
              backgroundColor: "#222",
              color: "#fff",
              fontFamily: "monospace",
              opacity: imConnected ? 1 : 0.5,
            }}
            >
            {JSON.stringify(gameState, null, 2)}
          </pre>
        </div>
        <div 
          className="flex flex-col gap-3 items-center justify-center"
        >
          <Input
            disabled={!imConnected}
            type="number"
            alt="config_time"
            name="config_time"
            placeholder="config_time"
            onChange={(e) => setConfigInput({...configInput, time: parseInt(e.target.value) })}
            value={configInput.time.toString()}
          /> 
          <Input
            disabled={!imConnected}
            type="number"
            alt="config_laps"
            name="config_laps"
            placeholder="config_laps"
            onChange={(e) => setConfigInput({...configInput, laps: parseInt(e.target.value) })}
            value={configInput.laps.toString()}
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={handleApplyConfig}
            disabled={!imConnected}
          >
            Apply Config
          </Button>

        </div>
      </div>
    </main>
  );
}
