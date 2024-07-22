import Canvas from "./canvas"
import Snake from "./Snake"
import Food from "./Snake/food"
import Renderer from './Renderer'

const cellWidth = 20
const cellHeight = 20

const canvas = new Canvas('snake', 800, 800, cellWidth, cellHeight)
const snake = new Snake(20, 20, 'u')
const food = new Food(canvas, [snake])
const renderer = new Renderer(canvas)
let running = true

snake.addPart(20, 21)
snake.addPart(20, 22)
snake.addPart(20, 22)

window.addEventListener('keydown', event => {
    let key = event.key
    snake.setDir(key)
})

function draw(){
    let head = snake.parts.head

    while (head != null) {
        renderer.renderSnake(head)
        head = head.next
    }

    renderer.renderFood(food)
}

function gameLoop() {
    draw()

    if (!running) return

    let head = snake.parts.head

    let removeTail = true

    let nextMove = snake.getNextMove()

    if (nextMove.x < 0 || nextMove.x >= canvas.gridWidth || nextMove.y < 0 || nextMove.y >= canvas.gridHeight) {
        running = false
        return
    } 

    if (head.data.x == food.x && head.data.y == food.y) {
        removeTail = false
        food.generate()
    }

    snake.move(removeTail)

    let set = new Set()
    snake.getPositions(set)

    if (set.size < snake.parts.count) {
        running = false
        return
    }
}


export function startSingleGame(){
    canvas.animate(gameLoop)
}