class Canvas {
    public width: number
    public height: number
    public cellWidth: number
    public cellHeight: number
    public gridWidth: number
    public gridHeight: number

    constructor(width: number, height: number, cellWidth: number, cellHeight: number) {
        this.width = width
        this.height = height
        this.cellWidth = cellWidth
        this.cellHeight = cellHeight
        this.gridWidth = width / cellWidth
        this.gridHeight = height / cellHeight
    }
}

export default Canvas