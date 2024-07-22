import type { Server as HTTPServer } from 'http'
import { Server, type Socket} from 'socket.io'

class SocketServer {
    private io: Server
    private queue: string[]
    private idTable: Map<string, string>
    private rooms: Map<string, string[]>

    constructor(server: HTTPServer) {
        this.io = new Server(server, {
            serveClient: false,
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: true,
            maxHttpBufferSize: 1e7,
            cors: {
                origin: 'http://localhost:5173',
                credentials: true
            }
        })

        this.queue = []
        this.idTable = new Map<string ,string>
        this.rooms = new Map<string ,string[]>
        this.io.on('connection', this.startListening)
    }

    startListening = (socket: Socket) => {
        socket.on("send_username", (username:string) => this.receiveUserName(socket, username))
        socket.on("start_matching", (username:string) => this.startMatching(socket, username))
    }

    receiveUserName = (socket: Socket, username: string) => {
        if (!username) {
            socket?.emit("receive_username", 2) // 2, for unexpected error, try again
            return
        }

        // Check if the username exists.
        const isUsernameExists = this.idTable.has(username)
        if(isUsernameExists) {
            socket?.emit("receive_username", 1) // 1, for username exists.
            return
        }
        
        // if username doesn't exist, save it.
        socket?.emit("receive_username", 0) // 0, username created.
        if (socket) this.idTable.set(username, socket.id)
        
    }

    startMatching = (socket: Socket, username: string) => {
        // add the user to the queue.
        if (!this.idTable.has(username)) return

        if (this.queue.length === 0) {
            this.queue.push(username)
            return
        }

        let first = username
        let second = this.queue.shift()
    }
}

export default SocketServer