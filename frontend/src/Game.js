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
        this.socket.on("receive_mine_movement", this.handleMovingSnake)
        this.socket.on("receive_opponent_movement", this.handleOpponentMovement)
        this.socket.on("change_mine_direction", this.handleMineDirection)
        this.socket.on("change_opponent_direction", this.handleOpponentDirection)
    }

    createMainSnake = () => {
        let midX = Math.floor(this.canvas.gridWidth / 2)
        let midY = Math.floor(this.canvas.gridHeight / 2)
        this.mainSnake = new Snake('u', this.freeCells)
        this.mainSnake.createSnake(midX, midY)
        this.snakes.push(this.mainSnake)
    }

    createSnakesFromPositions = (positions) => {
        const { mine, mineDir, opponent, opponentDir, food } = positions

        this.mineSnake = new Snake(mineDir, this.freeCells)
        this.mineSnake.createFromPositions(mine)
        this.opponentSnake = new Snake(opponentDir, this.freeCells)
        this.opponentSnake.createFromPositions(opponent)

        this.food.createFromPosition(food)
        this.snakes = []
        this.snakes.push(this.mineSnake)
        this.snakes.push(this.opponentSnake)
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

    isHittingOtherSnakes = (snake) => {
        for (let other of this.snakes) {
            if (snake == other) continue;

            if (other.positions.has(`${snake.head().x},${snake.head().y}`)) {
                return true
            }
        }

        return false
    }

    handleMovingSnake = (removeTail, foodPosition) => {
        this.mineSnake.move(removeTail)
        this.food.createFromPosition(foodPosition)
    }

    handleOpponentMovement = (removeTail, foodPosition) => {
        this.opponentSnake.move(removeTail)
        this.food.createFromPosition(foodPosition)
    }

    handleMineDirection = (direction) => {
        this.mineSnake.setDir(direction)
    }

    handleOpponentDirection = (direction) => {
        this.opponentSnake.setDir(direction)
    }

    multiGameLoop = () => {
        this.renderer.renderCanvas(this.snakes, this.food)
        this.socket.moveSnake()
    }

    startMultiGame = (positions) => {
        this.createSnakesFromPositions(positions)
        this.canvas.animate(this.multiGameLoop)
    }

    gameLoop = () => {
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