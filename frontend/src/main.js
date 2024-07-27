import { isValidUsername } from "./misc/utils"
import Socket from "./Socket"
import Game from "./Game"

class Main {
    constructor() {
        this.socket = new Socket("http://localhost:3000")
        this.game = new Game(800, 800, 20, 20, this.socket)
        this.isSingle = true

        // Sections
        this.playerOption = document.querySelector('#player-option')
        this.userInfo = document.querySelector('#user-info')
        this.matchCards = document.querySelector('#match-cards')
        this.snakeCanvas = document.querySelector('#snake-canvas')

        // Player option
        this.singePlayer = document.querySelector('#single-option')
        this.mutpliePlayers = document.querySelector('#multi-option')
        this.confirmOption = document.querySelector('#confirm-option')

        // User form
        this.form = document.querySelector('#user-form')
        this.input = document.querySelector('#username')

        // Matching
        this.match = document.querySelector('#match')

        // My Card
        this.myCard = document.querySelector('#mine')
        this.myUsername = document.querySelector('#mine-name')

        // Opponent Card
        this.opponentCard = document.querySelector('#opponent')
        this.opponentName = document.querySelector('#opponent-name')

        // Events
        this.socketEvents()
        this.frontEvents()
    }

    socketEvents = () => {
        this.socket.on("receive_username", this.handleRecievedUsername)
        this.socket.on("opponent_info", this.handleOpponentInfo)
        this.socket.on("opponent_ready", this.handleOpponentReady)
        this.socket.on("start_game", this.startGame)
    }

    handleRecievedUsername = (recieved, username) => {
        const recievedLog = {
            0: "Username has been created.",
            1: "Username exists.",
            2: "Unexpected error."
        }

        switch (recieved) {
            case 0:
                this.userInfo.classList.remove('active')
                this.matchCards.classList.add('active')
                this.myUsername.textContent = username
                this.socket.username = username
                break
            default:
                alert(recievedLog[recieved]);
                break;
        }
    }

    handleOpponentReady = () => {
        this.opponentCard.classList.add('ready')
        this.socket.startGame()
    }

    handleOpponentInfo = (username) => {
        this.opponentCard.classList.add('active')
        this.opponentName.textContent = username

        this.match.textContent = "Ready"
        this.match.disabled = false
        this.match.classList.add("before-ready")

        this.match.addEventListener("click", (event) => {
            this.match.classList.add("ready")
            this.myCard.classList.add('ready')
            this.socket.readyForStart()
        })
    }

    startGame = (positions) => {
        window.addEventListener("keydown", (event) => {
            let key = event.key
            this.socket.changeSnakeDirection(key)
        })

        this.matchCards.classList.remove('active')
        this.snakeCanvas.classList.add('active')
        this.game.startMultiGame(positions)
    }

    keyEvents = () => {
        // Window event for snake
        window.addEventListener('keydown', event => {
            let key = event.key
            this.game.mainSnake.setDir(key)
        })
    }

    frontEvents = () => {
        // Single player event
        this.singePlayer.addEventListener('click', (event) => {
            this.isSingle = true
            this.mutpliePlayers.classList.remove('active')
            this.singePlayer.classList.add('active')
        })

        // MultiPlayer event
        this.mutpliePlayers.addEventListener('click', (event) => {
            this.isSingle = false
            this.singePlayer.classList.remove('active')
            this.mutpliePlayers.classList.add('active')
        })

        // Confirm option
        this.confirmOption.addEventListener('click', (event) => {
            if (this.isSingle) {
                this.playerOption.classList.remove('active')
                this.snakeCanvas.classList.add('active')
                this.game.createMainSnake()
                this.keyEvents()
                this.game.startGame()
            }
            else {
                this.playerOption.classList.remove('active')
                this.userInfo.classList.add('active')
            }
        })

        // Form event
        this.form.addEventListener("submit", (event) => {
            event.preventDefault()

            let username = this.input.value
            if (!username) return

            if (!isValidUsername(username)) {
                alert("A valid username: letters + numbers, no spaces or symbols.")
                return
            }

            this.socket.registerUsername(username)
        })

        // Match Event
        this.match.addEventListener('click', (event) => {
            this.socket.startMatching()
            this.match.disabled = true
        })
    }
}

const main = new Main()