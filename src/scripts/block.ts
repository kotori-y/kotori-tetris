interface Position {
  row: number
  col: number
}


abstract class BasicBlock {

  game: HTMLElement
  blocks: HTMLCollection
  fixedBlocks: HTMLCollection

  blockWidth: number
  positions: Array<Position>

  protected _offsetLeft: number
  protected _offsetTop: number

  fallDownSpeed: number

  protected constructor(positions: Array<Position>) {
    this.game = document.querySelector("#game") as HTMLElement
    this.blocks = document.getElementById("game")!.getElementsByClassName("active")
    this.fixedBlocks = document.getElementById("game")!.getElementsByClassName("fixed")
    this.blockWidth = this.game.clientWidth / 10

    this._offsetLeft = 3
    this._offsetTop = -3

    this.positions = positions
    this.fallDownSpeed = 300
  }

  get offsetTop() {
    return this._offsetTop
  }

  get offsetLeft() {
    return this._offsetLeft
  }

  set offsetLeft(left: number) {
    this._offsetLeft = left
    this.locateBlock()
  }

  set offsetTop(top: number) {
    this._offsetTop = top
    this.locateBlock()
  }

  generate(): void {
    for (let i: number = 0; i <= 3; i++) {
      const block = document.createElement("div");
      block.classList.add(...["block", "active"])
      this.game.appendChild(block)
    }
    this.locateBlock()
  }

  locateBlock(): void {
    for (let i: number = 0; i <= 3; i++) {
      const position: Position = this.positions[i]
      const block: HTMLElement = this.blocks[i] as HTMLElement
      block.style.left = `${(this._offsetLeft + position.col) * this.blockWidth}px`
      block.style.top = `${(this._offsetTop + position.row) * this.blockWidth}px`
    }
  }

  fallDown(): Promise<any> {
    return this.interval(this.fallDownSpeed, (resolve: Function, task: number): void => {

      if (this.isTouchBottom()) {
        clearInterval(task)
        resolve()
        return
      }

      this._offsetTop++
      this.locateBlock()

    }).then(() => this.sleep(800))
      .then(() => {
        if (this.isTouchBottom()) {
          Array.from(this.blocks).forEach(block => block.classList.add("fixed"))
          Array.from(this.blocks).forEach(block => block.classList.remove("active"))
        } else {
          return this.fallDown()
        }
      })
  }

   computeMinDistance(block: HTMLElement, direction: string): number {
    let minDistance = Number.MAX_VALUE

    for (let i: number = 0; i < this.fixedBlocks.length; i++) {
      const fixBlock: HTMLElement = this.fixedBlocks[i] as HTMLElement
      let tmp: number = Number.MAX_VALUE;

      switch (direction) {
        case "down":
          tmp = ((block.offsetLeft === fixBlock.offsetLeft) && (fixBlock.offsetTop - block.offsetTop)) || Number.MAX_VALUE;
          break;
        case "left":
          tmp = ((block.offsetTop === fixBlock.offsetTop) && (block.offsetLeft - fixBlock.offsetLeft)) || Number.MAX_VALUE;
          break;
        case "right":
          tmp = ((block.offsetTop === fixBlock.offsetTop) && (fixBlock.offsetLeft - block.offsetLeft)) || Number.MAX_VALUE;
          break;
        default:
          break
      }

      if (tmp < minDistance && tmp > 0) {
        minDistance = tmp
      }

    }
    return minDistance
  }

  isTouchBottom(): Boolean {
    for (let i: number = 0; i <= 3; i++) {
      const block: HTMLElement = this.blocks[i] as HTMLElement
      const minDistance = this.computeMinDistance(block, "down")
      if ((minDistance <= this.blockWidth && minDistance > 0 )|| block.offsetTop == (this.game.clientHeight - this.blockWidth)) {
        return true
      }
    }
    return false
  }

  private interval(delay: number, callback: Function): Promise<any> {
    return new Promise(resolve => {
      let task = setInterval(() => {
        callback(resolve, task)
      }, delay)
    })
  }

  private async sleep(delay: number): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => resolve(), delay)
    })
  }

  run() {
    this.generate()
    return this.fallDown()
  }
}


export class SmashBoy extends BasicBlock {
  /**
   * OO
   * OO
   */
  constructor() {
    super([
      {row: 1, col: 1},
      {row: 1, col: 2},
      {row: 2, col: 1},
      {row: 2, col: 2}
    ]);
  }
}


export class Hero extends BasicBlock {
  /**
   * OOOO
   */
  constructor() {
    super([
      {row: 2, col: 0},
      {row: 2, col: 1},
      {row: 2, col: 2},
      {row: 2, col: 3}
    ]);
  }
}

export class Teewee extends BasicBlock {
  /**
   *   O
   * O O O
   */
  constructor() {
    super([
      {row: 1, col: 1},
      {row: 2, col: 0},
      {row: 2, col: 1},
      {row: 2, col: 2}
    ]);
  }

}

export class OrangeRicky extends BasicBlock {
  /**
   *     O
   * O O O
   */
  constructor() {
    super([
      {row: 1, col: 2},
      {row: 2, col: 0},
      {row: 2, col: 1},
      {row: 2, col: 2}
    ]);
  }
}

export class BlueRicky extends BasicBlock {
  /**
   *  O
   * O O O
   */
  constructor() {
    super([
      {row: 1, col: 0},
      {row: 2, col: 0},
      {row: 2, col: 1},
      {row: 2, col: 2}
    ]);
  }
}

export class ClevelandZ extends BasicBlock {
  /**
   *  O O
   *    O O
   */
  constructor() {
    super([
      {row: 1, col: 0},
      {row: 1, col: 1},
      {row: 2, col: 1},
      {row: 2, col: 2}
    ]);
  }
}

export class RhodeIslandZ extends BasicBlock {
  /**
   *    O O
   *  O O
   */
  constructor() {
    super([
      {row: 2, col: 0},
      {row: 2, col: 1},
      {row: 1, col: 1},
      {row: 1, col: 2}
    ]);
  }
}