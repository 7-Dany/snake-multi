import Snake from "./Snake/Snake"
import Food from "./Snake/Food"
import IndexedMap from "./misc/IndexedMap"
import Canvas from "./misc/Canvas"
import Part from "./Snake/Part"

type Players = {
    first: Snake
    second: Snake
}

class Game {
    public freeCells: IndexedMap
    public snakes: Players
    public food: Food
    public canvas: Canvas

    constructor(width: number, height: number, cellWidth: number, cellHeight: number) {
        this.canvas = new Canvas(width, height, cellWidth, cellHeight)
        this.freeCells = new IndexedMap()
        this.createFreeCells()

        this.snakes = {} as Players
        this.food = new Food(this.freeCells)
    }

    createFreeCells = () => {
        for (let y = 0; y < this.canvas.gridHeight; y++) {
            for (let x = 0; x < this.canvas.gridWidth; x++) {
                this.freeCells.add(`${x},${y}`)
            }
        }
    }

    createSnakes = () => {
        let midY = Math.floor(this.canvas.gridHeight / 2)
        this.snakes.first = new Snake(10, midY, 'd', this.freeCells)
        this.snakes.second = new Snake(this.canvas.gridWidth - 10, midY, 'u', this.freeCells)
    }

    isHittingBoundries = (snake: Snake) => {
        let nextMove = snake.getNextMove()
        return nextMove.x < 0 || nextMove.x >= this.canvas.gridWidth || nextMove.y < 0 || nextMove.y >= this.canvas.gridHeight
    }

    isHittingItSelf = (snake: Snake) => {
        let positions = snake.positions
        return positions.size < snake.parts.count
    }

    isHittingOtherSnakes = (snake: Snake) => {
        let other = snake == this.snakes.first ? this.snakes.second : this.snakes.first
        if (snake.head()) {
            const { x, y } = snake.head() as Part
            if (other.positions.has(`${x},${y}`)) return true
        }

        return false
    }

    returnPositions = () => {
        let positions = {
            first: Array.from(this.snakes.first.positions),
            firstDir: this.snakes.first.dir,
            second: Array.from(this.snakes.second.positions),
            secondDir: this.snakes.second.dir,
            food: [this.food.x, this.food.y]
        }
        return positions
    }
}

export default Game