import { getRandomNumber } from "../utils"

class Food {
    constructor(canvas, snakes) {
        this.snakes = snakes
        this.canvas = canvas
        this.generate()
    }

    getPositions = () => {
        let set = new Set()
        let snakes = this.snakes

        for(let snake of snakes){
            snake.getPositions(set)
        }

        return set
    }

    generate = () => {
        let gridWidth = this.canvas.gridWidth
        let gridHeight = this.canvas.gridHeight
        
        let free = []
        
        let positions = this.getPositions()

        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                if (!positions.has(`${x},${y}`)) {
                    free.push([x, y])
                }
            }
        }

        let i = getRandomNumber(free.length)
        this.x = free[i][0]
        this.y = free[i][1]
    }
}

export default Food