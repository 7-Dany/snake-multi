import { io } from "socket.io-client";

class Socket {
    constructor(url) {
        this.data = {}
        this.username = ""

        this.socket = io(url)
        
        this.socket.on("connect", this.connect) 
    }

    connect = () => {
        console.log(this.socket.id)
    }

    registerUsername = (username, recievedHandler) => {
        this.socket.emit("send_username", username)

        this.socket.on("receive_username", (received) => {
            const isReceived = recievedHandler(received)
            if(isReceived) this.username = username
        })
    }

    startMatching = () => {
        this.socket.emit("start_matching", this.username)
    }
}

export default Socket