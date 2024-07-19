import Socket from "./socket"

const socket = new Socket("http://localhost:3000")

// Login the user with username
// Send the username to the server to create an id for that user.
// Create a queue on the backend
// When the user starts a game, it should create a room, then pick the first 2 in the queue and join them in the room
// Share the data between both rooms.

const form = document.querySelector('#dialog-form')
const dialog = document.querySelector('#dialog')
const input = document.querySelector('#username')

form.addEventListener("submit", (event) => {
    event.preventDefault()
    if (input.value) {
        socket.registerUserName(input.value)
        dialog.close()
    }
    console.log(event.target)
})