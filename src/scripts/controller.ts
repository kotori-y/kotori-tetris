import {BlueRicky, ClevelandZ, Hero, OrangeRicky, RhodeIslandZ, SmashBoy, Teewee} from "./block"


export class Controller {

  avaIndex: Array<number>
  nowBlock: SmashBoy | Hero | Teewee | OrangeRicky | BlueRicky | ClevelandZ | RhodeIslandZ
  nextBlock: SmashBoy | Hero | Teewee | OrangeRicky | BlueRicky | ClevelandZ | RhodeIslandZ
  isLive: Boolean
  allowLeft: Boolean
  allowRight: Boolean

  scorePanel: HTMLElement
  levelPanel: HTMLElement
  linePanel: HTMLElement
  nextPanel: HTMLElement

  constructor() {
    this.isLive = true

    this.scorePanel = document.querySelector("#score") as HTMLElement
    this.levelPanel = document.querySelector("#level") as HTMLElement
    this.linePanel = document.querySelector("#line") as HTMLElement
    this.nextPanel = document.querySelector("#next") as HTMLElement

    this.init()
  }

  private choose(): number {
    let i: number = Math.floor(Math.random() * this.avaIndex.length);
    let index: number = this.avaIndex[i]
    this.avaIndex = this.avaIndex.filter(item => item !== index)
    return index
  }

  createBlockObject(index: number): any {
    switch (index) {
      case 0:
        return new SmashBoy()
      case 1:
        return new Hero()
      case 2:
        return new Teewee()
      case 3:
        return new OrangeRicky()
      case 4:
        return new BlueRicky()
      case 5:
        return new ClevelandZ()
      case 6:
        return new RhodeIslandZ()
    }
  }

  private checkOverFlow(): void {
    for (let i: number = 0; i < this.nowBlock.fixedBlocks.length; i++) {
      const block: HTMLElement = this.nowBlock.fixedBlocks[i] as HTMLElement
      if (block.offsetTop < 0) {
        this.isLive = false
        this.overGame().then()
      }
    }
  }

  private checkMoveStatus() {
    let tmpL: Boolean = true
    let tmpR: Boolean = true

    for (let i: number = 0; i <= 3; i++) {
      const block: HTMLElement = this.nowBlock.blocks[i] as HTMLElement

      const minLeft = this.nowBlock.computeMinDistance(block, "left")
      const minRight = this.nowBlock.computeMinDistance(block, "right")

      tmpL = tmpL && (block.offsetLeft > 0) && (minLeft > this.nowBlock.blockWidth)
      tmpR = tmpR && block.offsetLeft !== (this.nowBlock.game.clientWidth - this.nowBlock.blockWidth) && (minRight > this.nowBlock.blockWidth)
    }
    this.allowLeft = tmpL
    this.allowRight = tmpR
  }

  private move(direction: string): void {
    const step: number = direction === "left" ? -1 : 1
    this.nowBlock.offsetLeft += step
  }


  private isOverlap(): Boolean {
    for (let i: number = 0; i <= 3; i++) {
      const block: HTMLElement = this.nowBlock.blocks[i] as HTMLElement
      const distance: number = this.nowBlock.computeMinDistance(block, "down")
      if (distance === 0) {
        return true
      }
    }
    return false
  }

  private rotate(): void {
    for (let i: number = 0; i <= 3; i++) {
      const position = this.nowBlock.positions[i];
      [position.row, position.col] = [position.col, 3 - position.row];
    }
  }

  private fastDown(): void {
    if (!this.nowBlock.isTouchBottom()) {
      this.nowBlock.offsetTop += 1
    }
  }

  private async overGame(): Promise<void> {
    const overBlock: Array<Array<HTMLElement>> = []

    for (let row: number = 0; row < 20; row++) {
      const tmp: Array<HTMLElement> = []
      for (let col: number = 0; col < 10; col++) {
        const block = document.createElement("div");
        block.classList.add(...["block", "fixed"])
        block.style.top = `${row * this.nowBlock.blockWidth}px`
        block.style.left = `${col * this.nowBlock.blockWidth}px`
        tmp.push(block)
      }
      overBlock.push(tmp)
    }

    for (let i = 0; i < overBlock.length; i++) {
      const row = overBlock[i]
      row.forEach((elem: HTMLElement) => this.nowBlock.game.appendChild(elem))
      await this.nowBlock.sleep(100)
    }

  }

  private keyDownEvent(event: KeyboardEvent) {
    event.preventDefault()

    if (this.isLive) {
      this.checkMoveStatus()
      switch (event.key) {
        case "ArrowLeft":
          if (this.allowLeft) this.move("left");
          break;
        case "ArrowRight":
          if (this.allowRight) this.move("right");
          break;
        case "ArrowUp":
          this.rotate()
          break;
        case "ArrowDown":
          this.fastDown()
          break;
        default:
          break
      }
    }
  }

  private updatePanel(nLine: number): void {
    if (nLine === 0) {
      return;
    }
    const nowScore: number = parseInt(this.scorePanel.innerText)
    this.scorePanel.innerText = `${nowScore + 100 * nLine}`

    const nowLines: number = parseInt(this.linePanel.innerText)
    const newLines: number = nowLines + nLine

    this.linePanel.innerText = `${newLines}`

    if (newLines % 10 === 0) {
      const nowLevel: number = parseInt(this.levelPanel.innerText)
      this.levelPanel.innerText = `${nowLevel + 1}`
    }

  }

  private removeLine() {
    const count = new Map()
    const shouldRemovedRow: Array<number> = []
    const shouldRemovedBlock: Array<HTMLElement> = []
    const shouldDownBlock: Array<HTMLElement> = []

    for (let i: number = 0; i < this.nowBlock.fixedBlocks.length; i++) {
      const fixed: HTMLElement = this.nowBlock.fixedBlocks[i] as HTMLElement
      const top = fixed.offsetTop
      count.set(top, (count.get(top) || 0) + 1)
      if (count.get(top) >= 10) {
        shouldRemovedRow.push(top)
      }
    }

    for (let i: number = 0; i < this.nowBlock.fixedBlocks.length; i++) {
      const fixed: HTMLElement = this.nowBlock.fixedBlocks[i] as HTMLElement
      const top = fixed.offsetTop

      if (shouldRemovedRow.indexOf(top) !== -1) {
        shouldRemovedBlock.push(fixed)
        continue
      }

      const flag: Boolean = shouldRemovedRow.some(row => {
        return top < row
      })

      if (flag) shouldDownBlock.push(fixed)

    }

    shouldRemovedBlock.forEach(elem => elem.remove())
    shouldDownBlock.forEach(elem => {
      const elemTop = elem.offsetTop
      let n: number = 0

      for (let i: number = 0; i < shouldRemovedRow.length; i++) {
        if (shouldRemovedRow[i] > elemTop) {
          n++
        }
      }
      elem.style.top = `${elemTop + this.nowBlock.blockWidth * n}px`
    })

    this.updatePanel(shouldRemovedRow.length)
  }

  private displayNext() {
    this.nextPanel.innerHTML = ""
    for (let i: number = 0; i <= 3; i++) {
      const pos = this.nextBlock.positions[i]
      const {row, col} = pos
      const nextBlock = document.createElement("div");
      nextBlock.style.top = `${(row + 1) * this.nowBlock.blockWidth}px`
      nextBlock.style.left = `${(col + 1) * this.nowBlock.blockWidth}px`
      nextBlock.classList.add("block")
      this.nextPanel.appendChild(nextBlock)
    }
  }

  async start(): Promise<void> {

    let currIndex = this.choose()
    this.nowBlock = this.createBlockObject(currIndex)

    let nextIndex = this.choose()
    this.nextBlock = this.createBlockObject(nextIndex)

    while (this.isLive) {

      if (this.avaIndex.length === 0) {
        this.avaIndex = [...Array(7).keys()].concat([...Array(7).keys()])
      }

      this.displayNext()
      await this.nowBlock.run()
      this.removeLine()
      this.checkOverFlow()

      this.nowBlock = this.nextBlock

      let nextIndex = this.choose()
      this.nextBlock = this.createBlockObject(nextIndex)

    }
  }


  init(): void {
    this.avaIndex = [...Array(7).keys()].concat([...Array(7).keys()])
    document.addEventListener("keydown", this.keyDownEvent.bind(this))
  }
}