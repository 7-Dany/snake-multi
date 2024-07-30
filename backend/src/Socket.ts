import type { Server as HTTPServer } from 'http'
import { Server, type Socket } from 'socket.io'
import Room from './Room'
import { Directions } from './Snake/Snake'
import LinkedList from './misc/LinkedList'


type Matching = {
    firstId: string
    secondId: string
    isFirstReady: boolean
    isSecondReady: boolean
    didSendRequest: boolean
    room: Room
}

class SocketServer {
    private io: Server
    private users: Map<string, string>
    private queue: LinkedList<string>
    private inMatching: Map<string, Matching>

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

        this.queue = new LinkedList<string>()
        this.users = new Map<string, string>()
        this.inMatching = new Map<string, Matching>()

        this.io.on('connection', this.startListening)
    }

    startListening = (socket: Socket) => {
        socket.on("send_username", (username: string) => this.receiveUserName(socket, username))
        socket.on("start_matching", () => this.startMatching(socket))
        socket.on("ready_for_start", () => this.readyForStart(socket))
        socket.on("start_game", () => this.startGame(socket))
        socket.on("move_snake", () => this.moveSnake(socket))
        socket.on("change_direction", (direction: Directions) => this.changeDirection(socket, direction))
    }

    receiveUserName = (socket: Socket, username: string) => {
        // 2, for unexpected error, try again
        if (!username) return socket?.emit("receive_username", 2, username)

        // Check if the username exists. 
        const isUsernameExists = this.users.has(username)
        // 1, for username exists.
        if (isUsernameExists) return socket?.emit("receive_username", 1, username)

        // if username doesn't exist, save it.
        socket?.emit("receive_username", 0, username) // 0, username created.
        this.users.set(socket.id, username)
        socket.join(socket.id)
    }

    startMatching = (socket: Socket) => {
        let id = socket.id

        if (!this.users.has(id) || this.inMatching.has(id)) return
        if (this.queue.count === 0 && !this.queue.has(id)) {
            this.queue.addTail(id)
            return
        }

        let firstId = id
        let secondId = this.queue.popHead()
        if (!firstId || !secondId) return

        let canvas = { width: 800, height: 800, cellWidth: 20, cellHeight: 20 }
        let room = new Room(this.io, canvas)
        let matching: Matching = {
            firstId,
            secondId,
            isFirstReady: false,
            isSecondReady: false,
            didSendRequest: false,
            room
        }

        this.inMatching.set(firstId, matching)
        this.inMatching.set(secondId, matching)

        this.io.to(firstId).emit("opponent_info", this.users.get(secondId))
        this.io.to(secondId).emit("opponent_info", this.users.get(firstId))

    }

    readyForStart = (socket: Socket) => {
        let id = socket.id
        let matching = this.inMatching.get(id)
        if (!matching) return

        const { firstId, secondId } = matching
        if (id === firstId) {
            matching.isFirstReady = true
            this.io.to(secondId).emit("opponent_ready")
        }

        if (id === secondId) {
            matching.isSecondReady = true
            this.io.to(firstId).emit("opponent_ready")
        }
    }

    startGame = (socket: Socket) => {
        const id = socket.id
        const matching = this.inMatching.get(id)
        if (!matching) return

        const { isFirstReady, isSecondReady, didSendRequest, room, firstId, secondId } = matching
        if (!isFirstReady || !isSecondReady || didSendRequest) return

        matching.didSendRequest = true
        room.startGame([firstId, secondId])
    }

    moveSnake = (socket: Socket) => {
        let id = socket.id
        let userInfo = this.inMatching.get(id)
        if(!userInfo) return

        userInfo.room.moveSnake(id)
    }

    changeDirection = (socket: Socket, direction: Directions) => {
        const id = socket.id
        const userInfo = this.inMatching.get(id)
        if (!userInfo) return
        userInfo.room.updateSnakeDirection(id, direction)
    }
}

export default SocketServer