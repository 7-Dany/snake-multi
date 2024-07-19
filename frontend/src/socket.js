import { io } from "socket.io-client";

class Socket {

    constructor(url) {
        this.data = {}

        this.socket = io(url)

        this.socket.on("connect", this.connect) 
    }

    connect = () => {
        console.log(this.socket.id)
    }

    registerUserName = (username, callBack) => {
        this.socket.emit("send_username", username)

        this.socket.on("receive_username", (received) => {
            if (received) callBack()
        })
    }
}

export default Socket