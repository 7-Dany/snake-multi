import Canvas from "./front/Canvas"
import Snake from "./Snake/Snake"
import Food from "./Snake/Food"
import Renderer from './front/Renderer'
import IndexedMap from "./misc/IndexedMap"

class Game {
    constructor(width, height, cellWidth, cellHeight) {
        this.canvas = new Canvas('snake', width, height, cellWidth, cellHeight)
        this.freeCells = new IndexedMap()
        this.createFreeCells()

        this.snakes = []
        this.food = new Food(this.canvas, this.snakes, this.freeCells)
        this.renderer = new Renderer(this.canvas)

        this.running = true
    }

    createMainSnake = () => {
        let midX = Math.floor(this.canvas.gridWidth / 2)
        let midY = Math.floor(this.canvas.gridHeight / 2)
        this.mainSnake = new Snake(midX, midY, 'u', this.freeCells)
        this.snakes.push(this.mainSnake)
    }

    createFreeCells = () => {
        for (let y = 0; y < this.canvas.gridHeight; y++) {
            for (let x = 0; x < this.canvas.gridWidth; x++) {
                this.freeCells.add(`${x},${y}`)
            }
        }
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

        let head = this.mainSnake.head()
        let removeTail = true
        if (head.x == this.food.x && head.y == this.food.y) {
            removeTail = false
            this.food.generate()
        }
        this.mainSnake.move(removeTail)
    }

    startGame = () => {
        this.createMainSnake()
        this.canvas.animate(this.gameLoop)
    }
}

export default Game