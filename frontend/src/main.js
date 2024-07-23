import Socket from "./socket"
import { isValidUsername } from "./misc/utils"
import Game from "./game"

// Game Classes
const socket = new Socket("http://localhost:3000")
const game = new Game(800, 800, 20, 20)

// Sections
const playerOption = document.querySelector('#player-option')
const userInfo = document.querySelector('#user-info')
const matchCards = document.querySelector('#match-cards')
const snakeCanvas = document.querySelector('#snake-canvas')

// Player option
const singePlayer = document.querySelector('#single-option')
const mutpliePlayers = document.querySelector('#multi-option')
const confirmOption = document.querySelector('#confirm-option')

// User form
const form = document.querySelector('#user-form')
const input = document.querySelector('#username')

// Matching
const match = document.querySelector('#match')

let isSingle = true

const recievedHandler = (recieved) => {
    const recievedLog = {
        0: "Username has been created.",
        1: "Username exists.",
        2: "Unexpected error."
    }

    switch (recieved) {
        case 0:
            userInfo.classList.remove('active')
            matchCards.classList.add('active')
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
        game.startGame()
    }
    else{
        playerOption.classList.remove('active')
        userInfo.classList.add('active')
    }
})

match.addEventListener('click', (event) => {
    socket.startMatching()
})

window.addEventListener('keydown', event => {
    let key = event.key
    game.mainSnake.setDir(key)
})