import { Client, type Room } from 'colyseus.js'
import router from 'next/router'
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react'

import {
  type SetConfigPayload,
  type MyRoomState,
  type RoomConfig,
  MessageType,
  type GameMessagePayloads,
} from '@multiplayer-game/types'

interface IGameContextValue {
  myId: string
  gameState: MyRoomState
  joinRoom: (username: string) => void
  leaveRoom: () => void
  setConfig: (config: RoomConfig) => void
}

interface IGameProviderProps {
  children: ReactNode
}

const defaultGameConfig: RoomConfig = {
  time: 1000,
  laps: 5,
}

const initialGameState: MyRoomState = {
  config: defaultGameConfig,
  time: 0,
}

const GameContext = createContext<IGameContextValue>({
  myId: '',
  gameState: initialGameState,
  joinRoom: () => undefined,
  leaveRoom: () => undefined,
  setConfig: () => undefined,
})

const useGameContext = () => useContext(GameContext)


const URL = process.env.NEXT_PUBLIC_GAME_SOCKET_SERVER || 'ws://localhost:2567'
const client = new Client(URL)

const GameProvider: React.FC<IGameProviderProps> = ({ children }) => {

  const [gameState, setGameState] = useState(initialGameState)

  const [room, setRoom] = useState<Room<MyRoomState> | null>(null)

  const myId = room?.sessionId || ''


  const handleChangeState = useCallback(
    (newState: MyRoomState) => {
      setGameState({ ...newState })
    },[]
  )

  const sendToRoom = useCallback(
    <T extends MessageType>(type: T, payload: GameMessagePayloads[T]) => {
      if (!room) {
        console.error('Attempted to send message without an active room')
        return
      }

      room.send(type, payload)
    },
    [room]
  )

  const joinRoom = async (username: string) => {
    const room = await client.joinOrCreate<MyRoomState>('my_room', {
      username,
    })
    setRoom(room)
  }

  const leaveRoom = () => {
    void room?.leave()
    setGameState({ ...initialGameState })
  }

  const setConfig = (config: SetConfigPayload) => {
    sendToRoom(MessageType.SET_CONFIG, config)
  }

  const handleDisconnect = () => {
    setRoom(null)
    router.push('/')
  }

  useEffect(() => {
    if (room) {
      room.onMessage('room:joinedRoom', (_roomId: string) => {
        console.log('joinedRoom')
      })

      room.onStateChange(handleChangeState)
      room.onLeave(handleDisconnect)

      return () => room && room.removeAllListeners()
    }
  }, [room, handleChangeState])

  const value = {
    myId,
    gameState,
    joinRoom,
    leaveRoom,
    setConfig,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export { useGameContext, GameProvider }
