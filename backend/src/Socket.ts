import type { Server as HTTPServer } from 'http'
import { Server, type Socket} from 'socket.io'

class SocketServer {
    private io: Server
    private socket: Socket | undefined
    private queue: string[]
    private idTable: Map<string, string>

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
        this.io.on('connection', this.startListening)
    }

    startListening = (socket: Socket) => {
        this.socket = socket
        console.log('Listening', socket.id)
        socket.on("send_username", this.receiveUserName)
    }

    receiveUserName = (username: string) => {
        console.log(username)
        if (username) {
            this.socket?.emit("receive_username", true)
            this.queue.unshift(username)
            if (this.socket) this.idTable.set(username, this.socket.id)
            console.log(this.idTable)
        }
    }
}

export default SocketServer