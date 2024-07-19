import { io } from "socket.io-client";

class Socket {
    constructor(url) {
        this.socket = io(url)

        this.socket.on("connect", this.connect) 
    }

    connect = () => {
        console.log(this.socket.id)
    }
}

export default Socket