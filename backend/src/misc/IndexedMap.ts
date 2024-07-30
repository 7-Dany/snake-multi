import { getRandomNumber } from "./utils"

class IndexedMap {
    public array: string[]
    public map: Map<string, number>

    constructor() {
        this.array = []
        this.map = new Map()
    }

    add(element: string): void {
        if (!this.map.has(element)) {
            const index = this.array.length
            this.map.set(element, index)
            this.array.push(element)
        }
    }

    delete(element: string): void {
        const index = this.map.get(element)
        if (index !== undefined) {
            const lastIndex = this.array.length - 1
            const lastElement = this.array[lastIndex]

            this.map.delete(element)

            if (index !== lastIndex) {
                this.map.set(lastElement, index)
                this.array[index] = lastElement
            }

            this.array.pop()
        }
    }

    getRandomPosition(): string | undefined {
        if (this.array.length === 0) {
            return undefined
        }
        const randomNum = getRandomNumber(this.array.length)
        return this.array[randomNum]
    }
}

export default IndexedMap
