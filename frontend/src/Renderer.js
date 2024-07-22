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

    renderSnake = (head) => {
        let x = head.data.x * this.canvas.cellWidth
        let y = head.data.y * this.canvas.cellHeight
        let cellWidth = this.canvas.cellWidth
        let cellHeight = this.canvas.cellHeight

        this.canvas.drawRect(x, y, cellWidth, cellHeight, `rgb(30, 30 ,30)`)
    }
}

export default Renderer