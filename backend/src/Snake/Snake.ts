import Part from './Part'
import LinkedList from '../misc/LinkedList'
import IndexedMap from '../misc/IndexedMap'

export type Directions = "u" | "d" | "l" | "r"

class Snake {
    public id: string
    public freeCells: IndexedMap
    public positions: Set<string>
    public parts: LinkedList<Part>
    public dir: Directions | undefined

    constructor(id: string, x: number, y: number, dir: Directions, freeCells: IndexedMap) {
        this.id = id
        let head = new Part(x, y)
        this.freeCells = freeCells
        this.positions = new Set()
        this.positions.add(`${x},${y}`)
        this.freeCells.delete(`${x},${y}`)
        this.parts = new LinkedList(head)
        this.dir = dir
        this.createSnake(x, y)
    }

    createSnake = (x: number, y: number) => {
        switch (this.dir) {
            case "u":
                this.addPart(x, y + 1)
                this.addPart(x, y + 2)
                this.addPart(x, y + 3)
                break
            case "d":
                this.addPart(x, y - 1)
                this.addPart(x, y - 2)
                this.addPart(x, y - 3)
                break
            case "l":
                this.addPart(x + 1, y)
                this.addPart(x + 2, y)
                this.addPart(x + 3, y)
                break
            case "r":
                this.addPart(x - 1, y)
                this.addPart(x - 2, y)
                this.addPart(x - 3, y)
                break
            default:
                break
        }
    }

    head = (): Part | undefined => {
        if (this.parts.head) return this.parts.head.data
    }

    addPart = (x: number, y: number) => {
        let part = new Part(x, y)
        this.parts.addTail(part)
        this.positions.add(`${x},${y}`)
        this.freeCells.delete(`${x},${y}`)
    }

    move = (removeTail: boolean) => {
        let head = this.head()
        let x = head?.x as number
        let y = head?.y as number

        switch (this.dir) {
            case 'u': y--; break;
            case 'd': y++; break;
            case 'l': x--; break;
            case 'r': x++; break;
        }

        let newHead = new Part(x, y)
        this.positions.add(`${x},${y}`)
        this.parts.addHead(newHead)
        this.freeCells.delete(`${x},${y}`)

        if (removeTail) {
            let tail = this.parts.popTail()
            this.positions.delete(`${tail?.x},${tail?.y}`)
            this.freeCells.add(`${tail?.x},${tail?.y}`)
        }
    }

    getNextMove = () => {
        let dir = this.dir
        let data = this.parts.head?.data
        let part = new Part(data?.x as number, data?.y as number)
        switch (dir) {
            case 'u': part.y--; break;
            case 'd': part.y++; break;
            case 'l': part.x--; break;
            case 'r': part.x++; break;
        }

        return part
    }

    setDir = (direction: Directions) => {
        this.dir = direction
    }
}

export default Snake