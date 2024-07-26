import IndexedMap from '../misc/IndexedMap'

class Food {
    private freeCells: IndexedMap
    public x: string | null
    public y: string | null

    constructor(freeCells: IndexedMap) {
        this.freeCells = freeCells
        this.x = null
        this.y = null
        this.generate()
    }

    generate = () => {
        if (this.x && this.y) {
            this.freeCells.add(`${this.x},${this.y}`)
        }

        let position = this.freeCells.getRandomPosition()
        const [x, y] = position.split(',')
        this.x = x
        this.y = y
        this.freeCells.delete(`${this.x},${this.y}`)
    }
}

export default Food