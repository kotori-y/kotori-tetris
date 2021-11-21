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

  offsetLeft: number
  offsetTop: number

  fallDownSpeed: number

  protected constructor(positions: Array<Position>) {
    this.game = document.querySelector("#game") as HTMLElement
    this.blocks = document.getElementById("game")!.getElementsByClassName("active")
    this.fixedBlocks = document.getElementById("game")!.getElementsByClassName("fixed")
    this.blockWidth = this.game.clientWidth / 10

    this.offsetLeft = 3
    this.offsetTop = -1

    this.positions = positions
    this.fallDownSpeed = 500
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
      block.style.left = `${(this.offsetLeft + position.col) * this.blockWidth}px`
      block.style.top = `${(this.offsetTop + position.row) * this.blockWidth}px`
    }
  }

  fallDown(): Promise<any> {
    return this.interval(this.fallDownSpeed, (resolve: Function, task: number): void => {

      if (this.isTouchBottom()) {
        Array.from(this.blocks).forEach(block => block.classList.add("fixed"))
        Array.from(this.blocks).forEach(block => block.classList.remove("active"))
        clearInterval(task)
        resolve()
        return;
      }

      this.offsetTop++
      this.locateBlock()
    })
  }


  private computeMinDistance(block: HTMLElement, direction: string): number {
    let minDistance = Number.MAX_VALUE
    for (let i: number = 0; i < this.fixedBlocks.length; i++) {
      const fixBlock: HTMLElement = this.fixedBlocks[i] as HTMLElement
      let tmp: number = direction === "Y"
        ? ((block.offsetLeft === fixBlock.offsetLeft) && (block.offsetTop - fixBlock.offsetTop)) || Number.MAX_VALUE
        : ((block.offsetLeft === fixBlock.offsetLeft) && (block.offsetTop - fixBlock.offsetTop)) || Number.MAX_VALUE
      tmp = Math.abs(tmp)
      if (tmp < minDistance) {
        minDistance = tmp
      }
    }
    return minDistance
  }

  isTouchBottom(): Boolean {
    for (let i: number = 0; i <= 3; i++) {
      const block: HTMLElement = this.blocks[i] as HTMLElement
      const minDistance = this.computeMinDistance(block, "Y")
      if (minDistance <= this.blockWidth || block.offsetTop == (this.game.clientHeight - this.blockWidth)) {
        return true
      }
    }
    return false
  }

  protected interval(delay: number, callback: Function): Promise<any> {
    return new Promise(resolve => {
      let task = setInterval(() => {
        callback(resolve, task)
      }, delay)
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
      {row: 1, col: 0},
      {row: 1, col: 1},
      {row: 1, col: 2},
      {row: 1, col: 3}
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