import { getRandomNumber } from "./utils"

class IndexedMap {
    constructor(){
        this.array = []
        this.map = new Map()
    }

    add = (element) => {
        let index = this.array.length
        this.map.set(element, index)
        this.array.push(element)
    }

    delete = (element) => {
        let index = this.map.get(element)
        let lastElement = this.array[this.array.length - 1]

        this.map.delete(element)
        this.map.set(lastElement, index)
        
        this.array.pop()
        this.array[index] = lastElement
    }

    getRandomPosition = () => {
        let randomNum = getRandomNumber(this.array.length)
        return this.array[randomNum]
    }
}

export default IndexedMap