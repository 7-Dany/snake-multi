import Canvas from "./canvas"
import Snake from "./Snake"

const canvas = new Canvas('snake', 800, 800)
const cellWidth = 800 / 30
const cellHeight = 800 / 30
let snake = new Snake(20, 20, 'u')
snake.addPart(20, 21)
snake.addPart(20, 22)

window.addEventListener('keydown', event => {
    let key = event.key
    snake.setDir(key)
})

function gameLoop() {
    snake.move(true)
    let head = snake.parts.head
    while (head != null) {
        canvas.drawRect(head.data.x * cellWidth, head.data.y * cellHeight, cellWidth, cellHeight, `rgb(30, 30 ,30)`)
        head = head.next
    }
}

canvas.animate(gameLoop)
