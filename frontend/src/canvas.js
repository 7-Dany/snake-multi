class Canvas {
    constructor(id, width, height, cellWidth = 1, cellHeight = 1) {
        this.canvas = document.querySelector(`#${id}`)
        this.context = this.canvas.getContext('2d')
        this.canvas.width = width
        this.canvas.height = height
        this.canvas.style.backgroundColor = '#eee'
        this.cellWidth = cellWidth
        this.cellHeight = cellHeight
        this.gridWidth = width / cellWidth
        this.gridHeight = height / cellHeight
    }

    animate = async (callback) => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        callback()
        await this.sleep(50)
        window.requestAnimationFrame(async () => await this.animate(callback))
    }

    drawRect = (x, y, width, height, color) => {
        this.context.fillStyle = color
        this.context.fillRect(x, y, width, height)
    }

    sleep = async (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}



export default Canvas