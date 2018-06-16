import { observable, action, computed } from "mobx";

export default class Ship {
    constructor(type, rotation, cellCount) {
        this.type = type
        this.rotation = rotation
        this.id = Math.random()
        this.cellCount = cellCount
    }

    /**
     * ship's position on a grid (Cell)
     */
    position = null

    /**
     * A ship can have one of the following status: alive, died
     */
    @observable
    status = 'alive'

    @computed
    get alive() {
        return this.status === 'alive'
    }

    hitCount = 0

    @action.bound
    hit() {
        this.hitCount += 1
        if (this.hitCount === this.cellCount) {
            this.status = 'died'
        }
    }

    /**
     * Set ship position
     * @param {Cell} cell 
     */
    setPosition(cell) {
        this.position = cell
    }

}