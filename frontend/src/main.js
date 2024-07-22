import Socket from "./socket"
import { isValidUsername } from "./utils"
import { startSingleGame } from "./game"

const socket = new Socket("http://localhost:3000")

// TODO
// When the user starts a game, it should create a room, then pick the first 2 in the queue and join them in the room
// Share the data between both rooms.

const form = document.querySelector('#dialog-form')
const dialog = document.querySelector('#dialog')
const input = document.querySelector('#username')
const match = document.querySelector('#match')
const playerOption = document.querySelector('#player-option')
const matchCards = document.querySelector('#match-cards')
const snakeCanvas = document.querySelector('#snake-canvas')
const singePlayer = document.querySelector('#single-option')
const mutpliePlayers = document.querySelector('#multi-option')
const confirmOption = document.querySelector('#confirm-option')
let isSingle = true

const recievedHandler = (recieved) => {
    const recievedLog = {
        0: "Username has been created.",
        1: "Username exists.",
        2: "Unexpected error."
    }

    switch (recieved) {
        case 0:
            dialog.close()
            playerOption.classList.add('active')
            break
        default: alert(recievedLog[recieved]); break;
    }

    return recieved === 0
}

form.addEventListener("submit", (event) => {
    event.preventDefault()

    let value = input.value
    if (!value) return

    if (!isValidUsername(value)) {
        alert("A valid username: letters + numbers, no spaces or symbols.")
        return
    }

    socket.registerUsername(input.value, recievedHandler)
})

singePlayer.addEventListener('click', (event) => {
    isSingle = true
    mutpliePlayers.classList.remove('active')
    singePlayer.classList.add('active')
})

mutpliePlayers.addEventListener('click', (event) => {
    isSingle = false
    singePlayer.classList.remove('active')
    mutpliePlayers.classList.add('active')
})

confirmOption.addEventListener('click', (event) => {
    if(isSingle){
        playerOption.classList.remove('active')
        snakeCanvas.classList.add('active')
        startSingleGame()
    }
    else{
        playerOption.classList.remove('active')
        matchCards.classList.add('active')
    }
})

match.addEventListener('click', (event) => {
    socket.startMatching()
})