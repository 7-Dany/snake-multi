import Part from './part'
import LinkedList from './linked-list'

class Snake{
    constructor(x, y, dir) {
        let head = new Part(x, y)
        this.parts = new LinkedList(head)
        this.queue = new LinkedList(dir)
    }

    head = () => {
        return this.parts.head.data
    }

    addPart = (x, y) => {
        let part = new Part(x, y)
        this.parts.addTail(part)
    } 

    move = (removeTail) => {
        let {x, y} = this.head()
        if (this.queue.count > 0) this.dir = this.queue.popHead()

        switch (this.dir) {
            case 'u': y--; break;
            case 'd': y++; break;
            case 'l': x--; break;
            case 'r': x++; break;
        }

        let newHead = new Part(x, y)
        this.parts.addHead(newHead)

        if (removeTail) this.parts.popTail()
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

    getPositions = (set) => {
        let node = this.parts.head
        while (node != null) {
            let x = node.data.x
            let y = node.data.y
            set.add(`${x},${y}`)

            node = node.next
        }
    }

    setDir = (key) => {
        if(key === 'a' && this.dir === 'r') return
        if(key === 's' && this.dir === 'u') return
        if(key === 'd' && this.dir === 'l') return
        if(key === 'w' && this.dir === 'd') return

        switch (key) {
            case 'a': this.queue.addTail('l'); break;
            case 's': this.queue.addTail('d'); break;
            case 'd': this.queue.addTail('r'); break;
            case 'w': this.queue.addTail('u'); break;
        }
    }
}

export default Snake