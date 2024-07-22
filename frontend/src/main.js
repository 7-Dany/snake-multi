import Canvas from "./canvas"
import Socket from "./socket"
import { isValidUsername } from "./utils"

const socket = new Socket("http://localhost:3000")

// TODO
// When the user starts a game, it should create a room, then pick the first 2 in the queue and join them in the room
// Share the data between both rooms.

const form = document.querySelector('#dialog-form')
const dialog = document.querySelector('#dialog')
const input = document.querySelector('#username')
const match = document.querySelector('#match')

const canvas = new Canvas('snake', 500, 500)

const recievedHandler = (recieved) =>{
    const recievedLog = {
        0: "Username has been created.",
        1: "Username exists.",
        2: "Unexpected error."
    }

    switch (recieved) {
        case 0: dialog.close(); break;
        default: alert(recievedLog[recieved]); break;
    }

    return recieved === 0
}

form.addEventListener("submit", (event) => {
    event.preventDefault()

    let value = input.value
    if (!value) return
    
    if(!isValidUsername(value)) {
        alert("A valid username: letters + numbers, no spaces or symbols.")
        return
    }

    socket.registerUsername(input.value, recievedHandler)
})

match.addEventListener('click', (event) => {
    socket.startMatching()
})