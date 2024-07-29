import { io } from "socket.io-client";
import EventEmitter from './misc/EventEmitter';

class Socket extends EventEmitter {
    constructor(url) {
        super();
        this.username = "";

        this.socket = io(url);

        this.socket.on('connect', this.connect);
    }

    emitEvent = (event) => {
        this.socket.on(event, (...args) => {
            this.emit(event, ...args);
        });
    }

    connect = () => {
        this.emitEvent("receive_username");
        this.emitEvent("opponent_info");
        this.emitEvent("opponent_ready");
        this.emitEvent("start_game")
        this.emitEvent("update_snakes")
    }

    registerUsername = (username) => {
        this.socket.emit("send_username", username);
    }

    startMatching = () => {
        this.socket.emit("start_matching", this.username);
    }

    readyForStart = () => {
        this.socket.emit("ready_for_start");
    }

    startGame = () => {
        this.socket.emit("start_game")
    }

    moveSnake = () => {
        this.socket.emit('move_mine_snake')
    }

    changeSnakeDirection = (direction) => {
        this.socket.emit("change_direction", direction)
    }
}

export default Socket;
