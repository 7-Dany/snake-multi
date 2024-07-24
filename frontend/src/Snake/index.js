import Part from './part'
import LinkedList from './linked-list'

class Snake {
    constructor(x, y, dir, freeCells) {
        let head = new Part(x, y)
        this.freeCells = freeCells
        this.positions = new Set()
        this.positions.add(`${x},${y}`)
        this.freeCells.delete(`${x},${y}`)
        this.parts = new LinkedList(head)
        this.queue = new LinkedList(dir)
        this.createSnake(x, y)
    }

    createSnake = (x, y) => {
        this.addPart(x, y + 1)
        this.addPart(x, y + 2)
        this.addPart(x, y + 3)
    }

    head = () => {
        return this.parts.head.data
    }

    addPart = (x, y) => {
        let part = new Part(x, y)
        this.parts.addTail(part)
        this.positions.add(`${x},${y}`)
        this.freeCells.delete(`${x},${y}`)
    }

    move = (removeTail) => {
        let { x, y } = this.head()
        if (this.queue.count > 0) this.dir = this.queue.popHead()

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
            let {x, y} = this.parts.popTail()
            this.positions.delete(`${x},${y}`)
            this.freeCells.add(`${x},${y}`)
        }
    }

    getNextMove = () => {
        let dir = this.queue.count > 0 ? this.queue.head.data : this.dir
        let data = this.parts.head.data
        let part = new Part(data.x, data.y)
        switch (dir) {
            case 'u': part.y--; break;
            case 'd': part.y++; break;
            case 'l': part.x--; break;
            case 'r': part.x++; break;
        }

        return part
    }

    setDir = (key) => {
        if (key === 'a' && this.dir === 'r') return
        if (key === 's' && this.dir === 'u') return
        if (key === 'd' && this.dir === 'l') return
        if (key === 'w' && this.dir === 'd') return

        switch (key) {
            case 'a': this.queue.addTail('l'); break;
            case 's': this.queue.addTail('d'); break;
            case 'd': this.queue.addTail('r'); break;
            case 'w': this.queue.addTail('u'); break;
        }
    }
}

export default Snake