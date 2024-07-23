import Canvas from "./front/canvas"
import Snake from "./Snake"
import Food from "./Snake/food"
import Renderer from './front/Renderer'

class Game {
    constructor(width, height, cellWidth, cellHeight) {
        this.canvas = new Canvas('snake', width, height, cellWidth, cellHeight)
        this.snakes = [new Snake(20, 20, 'u')]
        this.mainSnake = this.snakes[0]
        this.food = new Food(this.canvas, this.snakes)
        this.renderer = new Renderer(this.canvas)
        this.running = true
    }

    isHittingBoundries = (snake) => {
        let nextMove = snake.getNextMove()
        return nextMove.x < 0 || nextMove.x >= this.canvas.gridWidth || nextMove.y < 0 || nextMove.y >= this.canvas.gridHeight
    }

    isHittingItSelf = (snake) => {
        let positions = snake.positions
        return positions.size < snake.parts.count
    }

    gameLoop = () => {
        this.renderer.renderCanvas(this.snakes, this.food)

        if (!this.running) return
        if (this.isHittingBoundries(this.mainSnake) || this.isHittingItSelf(this.mainSnake)) {
            this.running = false
            return
        }

        let head = this.mainSnake.parts.head
        let removeTail = true
        if (head.data.x == this.food.x && head.data.y == this.food.y) {
            removeTail = false
            this.food.generate()
        }
        this.mainSnake.move(removeTail)
    }

    startGame = () => {
        this.canvas.animate(this.gameLoop)
    }
}

export default Game