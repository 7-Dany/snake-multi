class Node {
    constructor(data, prev, next) {
        this.data = data
        this.prev = prev
        this.next = next
    }
}

class LinkedList {
    constructor(data) {
        this.head = null
        this.tail = null
        this.count = 0

        if (data) this.addTail(data)
    }

    addTail = (data) => {
        if (this.count === 0) {
            let node = new Node(data, null, null)
            this.head = node
            this.tail = node
        }
        else {
            let node = new Node(data, this.tail, null)
            this.tail.next = node
            this.tail = node
        }

        this.count++
    }

    addHead = (data) => {
        let node = new Node(data, null, this.head)
        if (this.count > 0) {
            this.head.prev = node
        }

        this.head = node

        this.count++
    }

    popTail = () => {
        let prev = this.tail.prev
        let data = this.tail.data
        if(prev) prev.next = null
        this.tail = prev

        this.count--

        return data
    }

    popHead = () => {
        let next = this.head.next
        let data = this.head.data
        if (next) next.prev = null
        this.head = next

        this.count--

        return data
    }
}

export default LinkedList