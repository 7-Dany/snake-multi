import { getRandomNumber } from "../misc/utils"

class Food {
    constructor(canvas, snakes) {
        this.snakes = snakes
        this.canvas = canvas
        this.generate()
    }

    checkPosition = (x, y) => {
        let snakes = this.snakes

        for(let snake of snakes){
            let positions = snake.positions
            if(positions.has(`${x},${y}`)) return true
        }

        return false
    }

    generate = () => {
        let gridWidth = this.canvas.gridWidth
        let gridHeight = this.canvas.gridHeight
        
        let free = []
        
        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                if (!this.checkPosition(x, y)) {
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