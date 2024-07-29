import IndexedMap from '../misc/IndexedMap'

class Food {
    private freeCells: IndexedMap
    public x: number | null
    public y: number | null

    constructor(freeCells: IndexedMap) {
        this.freeCells = freeCells
        this.x = null
        this.y = null
    }

    generate = () => {
        if (this.x && this.y) {
            this.freeCells.add(`${this.x},${this.y}`)
        }

        let position = this.freeCells.getRandomPosition()
        const [x, y] = position.split(',')
        this.x = Number(x)
        this.y = Number(y)
        this.freeCells.delete(`${this.x},${this.y}`)
    }
}

export default Food