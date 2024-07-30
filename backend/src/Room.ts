import Snake from "./Snake/Snake";
import Food from "./Snake/Food";
import IndexedMap from "./misc/IndexedMap";
import Canvas, { CanvasParams } from "./misc/Canvas";
import Part from "./Snake/Part";
import { Server } from "socket.io";

type Players = {
  [key: string]: Snake
};

class Room {
  public io: Server
  public freeCells: IndexedMap;
  public snakes: Players;
  public food: Food;
  public canvas: Canvas;

  constructor(io: Server, canvasParams: CanvasParams) {
    this.io = io

    this.canvas = new Canvas(canvasParams);
    this.freeCells = new IndexedMap();

    this.snakes = {} as Players;
    this.food = new Food(this.freeCells)
  }

  createFreeCells = () => {
    for (let y = 0; y < this.canvas.gridHeight; y++) {
      for (let x = 0; x < this.canvas.gridWidth; x++) {
        this.freeCells.add(`${x},${y}`);
      }
    }
  };

  createSnakes = (ids: string[]) => {
    let [firstId, secondId] = ids
    let midY = Math.floor(this.canvas.gridHeight / 2);
    this.snakes[firstId] = new Snake(firstId, 10, midY, "d", this.freeCells);
    this.snakes[secondId] = new Snake(secondId, this.canvas.gridWidth - 10, midY, "u", this.freeCells);
  };

  isHittingBoundries = (snake: Snake) => {
    let nextMove = snake.getNextMove();
    return (
      nextMove.x < 0 ||
      nextMove.x >= this.canvas.gridWidth ||
      nextMove.y < 0 ||
      nextMove.y >= this.canvas.gridHeight
    );
  };

  isHittingItSelf = (snake: Snake) => {
    let positions = snake.positions;
    return positions.size < snake.parts.count;
  };

  isHittingOtherSnakes = (snake: Snake) => {
    let { x, y } = snake.head() as Part
    for (let other in this.snakes) {
      if (other !== snake.id) {
        let otherSnake = this.snakes[other]
        if (otherSnake.positions.has(`${x},${y}`)) return true
      }
    }
    return false;
  };


  isEatingFood = (snake: Snake) => {
    let { x, y } = snake.head() as Part
    let foodEaten = false
    if (Number(x) === Number(this.food.x) && Number(y) === Number(this.food.y)) {
      foodEaten = true
    }
    return foodEaten
  }

  getOpponents = (snakeId: string) => {
    let opponents = []

    for (let other in this.snakes) {
      if (other === snakeId) continue
      let otherSnake = this.snakes[other]
      let opponent = {
        id: otherSnake.id,
        positions: Array.from(otherSnake.positions),
        dir: otherSnake.dir
      }
      opponents.push(opponent)
    }

    return opponents
  }

  sendSnakes = () => {
    let food = [this.food.x, this.food.y]

    for (let snake in this.snakes) {
      let current = this.snakes[snake]
      let mySnake = { id: current.id, positions: Array.from(current.positions), dir: current.dir }
      let opponents = this.getOpponents(current.id)

      this.io.to(current.id).emit("start_game", { mySnake, opponents, food })
    }
  }

  handleSnakeMovement = (snake: Snake) => {
    let didHit = false
    if (
      this.isHittingBoundries(snake) ||
      this.isHittingItSelf(snake) ||
      this.isHittingOtherSnakes(snake)
    ) {
      didHit = true
    }

    let didEat = false
    console.log("Snake, ", snake.head())
    console.log("Food, ", this.food.x, this.food.y)
    if (this.isEatingFood(snake)) {
      didEat = true
    }

    let data = { id: snake.id, isHitting: didHit, removeTail: !didEat, dir: snake.dir }
    if (!didHit) snake.move(!didEat)
    return [data, didEat]
  }

  updateSnakes = () => {
    let snakesData = []
    let isFoodEaten = false

    for (let snake in this.snakes) {
      let current = this.snakes[snake]
      let [data, didEat] = this.handleSnakeMovement(current)
      if (didEat) isFoodEaten = true
      snakesData.push(data)
    }

    if (isFoodEaten) this.food.generate()
    let foodPosition = [this.food.x, this.food.y]

    let updatedMovement = {
      foodPosition, snakesData
    }

    for (let snake in this.snakes) {
      this.io.to(snake).emit("update_snakes", updatedMovement)
    }
  }

  startGame = (ids: string[]) => {
    this.createFreeCells()
    this.food.generate()
    this.createSnakes(ids)
    this.sendSnakes()

    setInterval(() => {
      this.updateSnakes()
    }, 100)
  };

  updateSnakeDirection = (id: string, direction: string) => {
    for (let snakeId in this.snakes) {
      if (snakeId === id) {
        this.snakes[snakeId].setDir(direction)
      }
    }
  }
}

export default Room;
