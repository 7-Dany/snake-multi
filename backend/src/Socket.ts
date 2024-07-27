import type { Server as HTTPServer } from 'http'
import { Server, type Socket } from 'socket.io'
import Game from './Game'
import Part from './Snake/Part'

type TRoom = {
    isFirstReady: boolean
    isSecondReady: boolean
    didSend: boolean
    game: Game | null
}

type Matching = {
    firstPlayer: string
    firstPlayerSocket: string
    secondPlayer: string
    secondPlayerSocket: string
    room: TRoom
}

class SocketServer {
    private io: Server
    private queue: string[]
    private idTable: Map<string, string>
    private inMatching: Map<string, Matching>
    private inQueue: Set<string>

    constructor(server: HTTPServer) {
        this.io = new Server(server, {
            serveClient: false,
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: true,
            maxHttpBufferSize: 1e7,
            cors: {
                origin: '*',
                credentials: true
            }
        })

        this.queue = []
        this.idTable = new Map<string, string>
        this.inQueue = new Set()
        this.inMatching = new Map<string, Matching>()
        this.io.on('connection', this.startListening)
    }

    startListening = (socket: Socket) => {
        socket.on("send_username", (username: string) => this.receiveUserName(socket, username))
        socket.on("start_matching", (username: string) => this.startMatching(socket, username))
        socket.on("ready_for_start", () => this.readyForStart(socket))
        socket.on("start_game", () => this.startGame(socket))
        socket.on("move_mine_snake", () => this.moveSnake(socket))
        socket.on("change_mine_direction", (direction: string) => this.changeDirection(socket, direction))
    }

    receiveUserName = (socket: Socket, username: string) => {
        if (!username) {
            socket?.emit("receive_username", 2, username) // 2, for unexpected error, try again
            return
        }

        // Check if the username exists.
        const isUsernameExists = this.idTable.has(username)
        if (isUsernameExists) {
            socket?.emit("receive_username", 1, username) // 1, for username exists.
            return
        }

        // if username doesn't exist, save it.
        socket?.emit("receive_username", 0, username) // 0, username created.
        if (socket) {
            this.idTable.set(username, socket.id)
            socket.join(socket.id)
        }

    }

    startMatching = (socket: Socket, username: string) => {
        if (!this.idTable.has(username) || this.inMatching.has(socket.id)) return

        if (this.queue.length === 0 && !this.inQueue.has(username)) {
            this.queue.push(username)
            this.inQueue.add(username)
            return
        }

        let firstPlayer = username
        let firstPlayerSocket = this.idTable.get(firstPlayer) as string
        let secondPlayer = this.queue.shift() as string
        let secondPlayerSocket = this.idTable.get(secondPlayer) as string

        if (firstPlayer && secondPlayer) {
            let room: TRoom = {
                didSend: false,
                isFirstReady: false,
                isSecondReady: false,
                game: null
            }

            let matchingInfo = {
                firstPlayer: firstPlayer,
                firstPlayerSocket: firstPlayerSocket,
                secondPlayer: secondPlayer,
                secondPlayerSocket: secondPlayerSocket,
                room: room
            }

            this.inMatching.set(firstPlayerSocket, matchingInfo)
            this.inMatching.set(secondPlayerSocket, matchingInfo)

            this.io.to(firstPlayerSocket).emit("opponent_info", secondPlayer)
            this.io.to(secondPlayerSocket).emit("opponent_info", firstPlayer)
        }
    }

    readyForStart = (socket: Socket) => {
        let id = socket.id
        let userInfo = this.inMatching.get(id)
        if (!userInfo) return

        const { firstPlayerSocket, secondPlayerSocket, room } = userInfo
        if (id === firstPlayerSocket) {
            room.isFirstReady = true
            this.io.to(secondPlayerSocket).emit("opponent_ready")
        }

        if (id === secondPlayerSocket) {
            room.isSecondReady = true
            this.io.to(userInfo.firstPlayerSocket).emit("opponent_ready")
        }
    }

    startGame = (socket: Socket) => {
        const id = socket.id
        const userInfo = this.inMatching.get(id)
        if (!userInfo) return

        const { room, firstPlayerSocket, secondPlayerSocket } = userInfo
        if (room.isFirstReady && room.isSecondReady && !room.didSend) {
            const game = new Game(800, 800, 20, 20)
            room.game = game
            room.game.createSnakes()
            const positions = room.game.returnPositions()
            room.didSend = true

            let first = {
                mine: positions.first,
                mineDir: positions.firstDir,
                opponent: positions.second,
                opponentDir: positions.secondDir,
                food: positions.food
            }

            let second = {
                mine: positions.second,
                mineDir: positions.secondDir,
                opponent: positions.first,
                opponentDir: positions.firstDir,
                food: positions.food
            }

            this.io.to(firstPlayerSocket).emit("start_game", first)
            this.io.to(secondPlayerSocket).emit("start_game", second)
        }
    }

    moveSnake = (socket: Socket) => {
        const id = socket.id
        const userInfo = this.inMatching.get(id)
        if (!userInfo) return

        const { firstPlayerSocket, secondPlayerSocket, room } = userInfo
        const game = room.game
        const snake = game?.snakes
        const food = game?.food

        if (id === firstPlayerSocket) {
            let removeTail = true
            let { x, y } = snake?.first.head() as Part
            if (x === food?.x && y === food?.y) {
                removeTail = false
                food.generate()
            }
            snake?.first.move(removeTail)

            let foodPosition = [food?.x, food?.y]
            this.io.to(firstPlayerSocket).emit("receive_mine_movement", removeTail, foodPosition)
            this.io.to(secondPlayerSocket).emit("receive_opponent_movement", removeTail, foodPosition)
        }

        if (id === secondPlayerSocket) {
            let removeTail = true
            let { x, y } = snake?.second.head() as Part
            if (x === food?.x && y === food?.y) {
                removeTail = false
                food.generate()
            }
            snake?.second.move(removeTail)

            let foodPosition = [food?.x, food?.y]
            this.io.to(secondPlayerSocket).emit("receive_mine_movement", removeTail, foodPosition)
            this.io.to(firstPlayerSocket).emit("receive_opponent_movement", removeTail, foodPosition)
        }

    }

    changeDirection = (socket: Socket, direction: string) => {
        const id = socket.id
        const userInfo = this.inMatching.get(id)
        if (!userInfo) return

        const { firstPlayerSocket, secondPlayerSocket, room } = userInfo
        const game = room.game
        const snake = game?.snakes

        if (id === firstPlayerSocket) {
            snake?.first.setDir(direction)
            this.io.to(firstPlayerSocket).emit("change_mine_direction", direction)
            this.io.to(secondPlayerSocket).emit("change_opponent_direction", direction)
        }

        if(id === secondPlayerSocket){
            snake?.second.setDir(direction)
            this.io.to(secondPlayerSocket).emit("change_mine_direction", direction)
            this.io.to(firstPlayerSocket).emit("change_opponent_direction", direction)
        }
    }
}

export default SocketServer