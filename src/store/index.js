import GridModel from "./Grid";
import { computed, observable } from "mobx";
import { generateMoves } from "../utils";


class Controller {
    constructor() {
        this.grid = new GridModel(10)
        this.grid.placeShips()
        this.moves = generateMoves()
    }

    /**
     * Returns the number of alive ships
     */
    @computed
    get aliveShips() {
        return this.grid.aliveShips
    }

    fire = () => {
        let targetCell = this.moves.pop()
        this.grid.fire(targetCell)
    }

}

const controller = new Controller()
export default controller