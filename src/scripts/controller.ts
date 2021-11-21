import {SmashBoy, Hero, Teewee, OrangeRicky, BlueRicky, ClevelandZ, RhodeIslandZ} from "./block"


export class Controller {

  avaIndex: Array<number>
  nowBlock: SmashBoy | Hero | Teewee | OrangeRicky | BlueRicky | ClevelandZ | RhodeIslandZ
  isLive: Boolean
  allowLeft: Boolean
  allowRight: Boolean

  constructor() {
    this.isLive = true
    this.init()
  }

  private choose(): number {
    let i: number = Math.floor(Math.random() * this.avaIndex.length);
    let index: number = this.avaIndex[i]
    this.avaIndex = this.avaIndex.filter(item => item !== index)
    return index
  }

  createBlockObject(index: number): void {
    switch (index) {
      case 0:
        this.nowBlock = new SmashBoy()
        break;
      case 1:
        this.nowBlock = new Hero()
        break;
      case 2:
        this.nowBlock = new Teewee()
        break;
      case 3:
        this.nowBlock = new OrangeRicky()
        break;
      case 4:
        this.nowBlock = new BlueRicky()
        break;
      case 5:
        this.nowBlock = new ClevelandZ()
        break;
      case 6:
        this.nowBlock = new RhodeIslandZ()
        break;
    }

    this.allowLeft = true
    this.allowRight = true
  }

  private checkOverFlow(): void {
    for (let i: number = 0; i < this.nowBlock.fixedBlocks.length; i++) {
      const block: HTMLElement = this.nowBlock.fixedBlocks[i] as HTMLElement
      if (block.offsetTop < 0) {
        this.isLive = false
      }
    }
  }

  private checkMoveStatus() {
    let tmpL: Boolean = true
    let tmpR: Boolean = true

    for (let i: number = 0; i <= 3; i++) {
      const block: HTMLElement = this.nowBlock.blocks[i] as HTMLElement

      const minLeft = this.nowBlock.computeMinDistance(block, "left")
      const minRight =this.nowBlock.computeMinDistance(block, "right")

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
    // if (this.isOverlap()) {
    //   console.log("Overlap")
    // }
  }

  private keyDownEvent(event: KeyboardEvent) {
    event.preventDefault()
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
      default:
        break
    }
  }

  async start(): Promise<void> {
    while (this.isLive) {

      if (this.avaIndex.length === 0) {
        this.avaIndex = [0, 1, 2, 3, 4, 5, 6]
      }

      const index = this.choose()
      this.createBlockObject(index)
      await this.nowBlock.run()
      this.checkOverFlow()
    }
  }


  init(): void {
    this.avaIndex = [0, 1, 2, 3, 4, 5, 6]
    document.addEventListener("keydown", e => this.keyDownEvent(e))
  }
}