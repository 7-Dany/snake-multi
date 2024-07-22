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