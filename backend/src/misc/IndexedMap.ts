import { getRandomNumber } from "./utils"

class IndexedMap {
    public array: string[]
    public map: Map<string, number>
    constructor() {
        this.array = []
        this.map = new Map()
    }

    add = (element: string) => {
        let index = this.array.length
        this.map.set(element, index)
        this.array.push(element)
    }

    delete = (element: string) => {
        let index = this.map.get(element) as number
        let lastElement = this.array[this.array.length - 1]

        this.map.delete(element)
        this.map.set(lastElement, index)

        this.array.pop()
        this.array[index] = lastElement
    }

    getRandomPosition = (): string => {
        let randomNum = getRandomNumber(this.array.length)
        return this.array[randomNum]
    }
}

export default IndexedMap