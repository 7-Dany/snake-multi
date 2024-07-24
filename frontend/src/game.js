import Canvas from "./front/canvas"
import Snake from "./Snake"
import Food from "./Snake/food"
import Renderer from './front/Renderer'
import IndexedMap from "./misc/indexed-map"

class Game {
    constructor(width, height, cellWidth, cellHeight) {
        this.canvas = new Canvas('snake', width, height, cellWidth, cellHeight)
        this.freeCells = new IndexedMap()
        this.createFreeCells()

        this.snakes = [new Snake(5, 5, 'u', this.freeCells)]
        this.food = new Food(this.canvas, this.snakes, this.freeCells)
        this.renderer = new Renderer(this.canvas)

        this.running = true
        this.mainSnake = this.snakes[0]
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
        this.canvas.animate(this.gameLoop)
    }
}

export default Game