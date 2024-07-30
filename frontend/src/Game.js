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
        this.socket.on("move_snake", this.handleMovingSnake)
        this.socket.on("change_direction", this.handleChangingDirection)
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

    changeDirection = (key) => {
        let snake = this.snakes[0]
        snake.setDir(key)
        this.socket.changeSnakeDirection(snake.queue.head.data)
    }

    handleMovingSnake = (data) => {
        const { id, removeTail, food, isDead } = data
        let snake = this.snakes.find(snake => snake.id === id)
        
        if (!isDead) {
            snake.move(removeTail)
        }

        this.food.createFromPosition(food)
    }

    handleChangingDirection = (data) => {
        let { id, direction } = data
        let snake = this.snakes.find(snake => snake.id === id)
        snake.dir = direction
    }

    multiGameLoop = async () => {
        this.renderer.renderCanvas(this.snakes, this.food)
        this.socket.moveSnake()
    }

    startMultiGame = (positions) => {
        this.createSnakesFromPositions(positions)
        this.canvas.animate(this.multiGameLoop)
    }

    gameLoop = async () => {
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