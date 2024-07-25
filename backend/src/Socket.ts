import type { Server as HTTPServer } from 'http'
import { Server, type Socket } from 'socket.io'

type Matching = {
    username: string
    opponentUsername: string
    opponentSocket: string
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
            this.inMatching.set(firstPlayerSocket, { username: firstPlayer, opponentUsername: secondPlayer, opponentSocket: secondPlayerSocket })
            this.inMatching.set(secondPlayerSocket, { username: secondPlayer, opponentUsername: firstPlayer, opponentSocket: firstPlayerSocket })
            this.io.to(firstPlayerSocket).emit("opponent_info", secondPlayer)
            this.io.to(secondPlayerSocket).emit("opponent_info", firstPlayer)
        }
    }

    readyForStart = (socket:Socket) => {
        let id = socket.id
        let roomInfo = this.inMatching.get(id)
        let opponentSocket = roomInfo?.opponentSocket as string
        this.io.to(opponentSocket).emit("opponent_ready")
    }
}

export default SocketServer