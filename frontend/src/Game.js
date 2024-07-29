import Canvas from "./front/Canvas"
import Snake from "./Snake/Snake"
import Food from "./Snake/Food"
import Renderer from './front/Renderer'
import IndexedMap from "./misc/IndexedMap"

class Game {
    constructor(width, height, cellWidth, cellHeight, socket) {
        this.canvas = new Canvas('snake', width, height, cellWidth, cellHeight)
        this.renderer = new Renderer(this.canvas)
        this.freeCells = new IndexedMap()
        this.createFreeCells()

        this.snakes = []
        this.food = new Food(this.canvas, this.freeCells)
        this.running = true

        this.socket = socket

        this.socketEvents()
    }

    socketEvents = () => {
        this.socket.on("update_snakes", this.updateSnakes)
    }

    createMainSnake = () => {
        let midX = Math.floor(this.canvas.gridWidth / 2)
        let midY = Math.floor(this.canvas.gridHeight / 2)
        this.mainSnake = new Snake(1, 'u', this.freeCells)
        this.mainSnake.createSnake(midX, midY)
        this.snakes.push(this.mainSnake)
    }

    createSnakesFromPositions = (positions) => {
        const { food, mySnake, opponents } = positions

        this.food.createFromPosition(food)

        this.snakes = []
        const mine = new Snake(mySnake.id, mySnake.dir, this.freeCells)
        mine.createFromPositions(mySnake.positions)
        this.snakes.push(mine)

        for (let opponent of opponents) {
            const oppSnake = new Snake(opponent.id, opponent.dir, this.freeCells)
            oppSnake.createFromPositions(opponent.positions)
            this.snakes.push(oppSnake)
        }
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

    updateSnakes = (updatedMovement) => {
        const { foodPosition, snakesData } = updatedMovement
        this.food.createFromPosition(foodPosition)

        for (let snake of snakesData) {
            for (let current of this.snakes) {
                if (current.id === snake.id) {
                    console.log(current.positions.size)
                    current.dir = snake.dir
                    if (!snake.isHitting) current.move(snake.removeTail)
                }
            }
        }
    }

    multiGameLoop = () => {
        this.renderer.renderCanvas(this.snakes, this.food)
    }

    startMultiGame = (positions) => {
        this.createSnakesFromPositions(positions)
        this.canvas.animate(this.multiGameLoop)
    }

    gameLoop = async () => {
        await this.canvas.sleep(40)

        this.renderer.renderCanvas(this.snakes, this.food)

        if (!this.running) return

        if (this.isHittingBoundries(this.mainSnake) ||
            this.isHittingItSelf(this.mainSnake)) {
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