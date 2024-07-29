class Node<T> {
    public data: T
    public next: Node<T> | undefined
    public prev: Node<T> | undefined

    constructor(data: T, prev: Node<T> | undefined = undefined, next: Node<T> | undefined = undefined) {
        this.data = data
        this.prev = prev
        this.next = next
    }
}

class LinkedList<T> {
    public head: Node<T> | undefined
    public tail: Node<T> | undefined
    public count: number

    constructor(data?: T) {
        this.head = undefined
        this.tail = undefined
        this.count = 0

        if (data) this.addTail(data)
    }

    addHead = (data: T) => {
        let node = new Node<T>(data, undefined, this.head)
        if (this.head) this.head.prev = node
        this.head = node

        this.count++
    }

    popHead = () => {
        let next = this.head?.next
        let deleted = this.head?.data
        if (next) {
            next.prev = undefined
            this.head = next
        }

        this.count--

        return deleted
    }

    addTail = (data: T) => {
        if (this.count == 0) {
            let node = new Node<T>(data)
            this.head = node
            this.tail = node
        }
        else {
            let node = new Node<T>(data, this.tail)
            if (this.tail) this.tail.next = node
            this.tail = node
        }

        this.count++
    }

    popTail = () => {
        let prev = this.tail?.prev
        let deleted = this.tail?.data
        if (prev) prev.next = undefined

        this.tail = prev

        this.count--

        return deleted
    }

    has = (id: string) => {
        if (!this.head) return false

        let current: Node<T> | undefined = this.head
        while (current) {
            if (current.data === id) return true
            current = current.next
        }

        return false
    }
}

export default LinkedList