class Renderer {
    constructor(canvas) {
        this.canvas = canvas
    }

    renderFood = (food) => {
        let x = food.x * this.canvas.cellWidth
        let y = food.y * this.canvas.cellHeight
        let cellWidth = this.canvas.cellWidth
        let cellHeight = this.canvas.cellHeight

        this.canvas.drawRect(x, y, cellWidth, cellHeight, `rgb(100, 100 ,100)`)
    }

    renderPart = (part) => {
        let x = part.data.x * this.canvas.cellWidth
        let y = part.data.y * this.canvas.cellHeight
        let cellWidth = this.canvas.cellWidth
        let cellHeight = this.canvas.cellHeight

        this.canvas.drawRect(x, y, cellWidth, cellHeight, `rgb(30, 30 ,30)`)
    }

    renderSnake = (snake) => {
        let head = snake.parts.head

        while (head != null) {
            this.renderPart(head)
            head = head.next
        }
    }

    renderCanvas = (snakes, food) => {
        for(let snake of snakes){
            this.renderSnake(snake)
        }
        this.renderFood(food)
    }
}

export default Renderer