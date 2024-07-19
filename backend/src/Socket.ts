import type { Server as HTTPServer } from 'http'
import { Server, type Socket} from 'socket.io'

class SocketServer {
    private io: Server
    constructor(server: HTTPServer) {
        this.io = new Server(server, {
            serveClient: false,
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: true,
            maxHttpBufferSize: 1e7,
            cors: {
                origin: 'http://localhost:3000',
                credentials: true
            }
        })

        this.io.on('connection', this.startListening)
    }

    startListening = (socket: Socket) => {
        console.log('Listening')
    }
}

export default SocketServer