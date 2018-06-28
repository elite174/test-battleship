import { generateMoves, ShipTypes, getRandomRotation } from "../utils";
import Ship from "./Ship";
import GridCellModel from "./GridCell";
import { observable, computed, action } from "mobx";

const DOT_COUNT = 2
const I_COUNT = 1
const L_COUNT = 1


export default class GridModel {
    constructor(size) {

        // fill board grid
        this.size = size
        let matrix = []
        for (let i = 0; i < size; i++) {
            matrix[i] = []
            for (let j = 0; j < size; j++) {
                matrix[i][j] = new GridCellModel(i, j)
            }
        }
        this.matrix = matrix

        // Initialize ships for the game
        this.ships = []
        for (let i = 0; i < DOT_COUNT; i++) {
            this.ships.push(new Ship(ShipTypes.DOT, getRandomRotation(), 1))
        }
        for (let i = 0; i < I_COUNT; i++) {
            this.ships.push(new Ship(ShipTypes.I, getRandomRotation(), 4))
        }
        for (let i = 0; i < L_COUNT; i++) {
            this.ships.push(new Ship(ShipTypes.L, getRandomRotation(), 4))
        }
    }

    /**
     * Returns the number of alive ships
     * it recomputes only when a ship's status changes
     */
    @computed
    get aliveShips() {
        let count = 0
        for (let ship of this.ships) {
            if (ship.status === 'alive') {
                count += 1
            }
        }
        return count
    }

    /**
     * Find a ship that has initial position at the targetCell
     * @param {Cell} targetCell
     */
    getShipForCell = (targetCell) => {
        return this.ships.find(ship => {
            return ship.position.x === targetCell.x && ship.position.y === targetCell.y
        })
    }

    /**
     * Fire target cell
     * @param {Cell} targetCell 
     */
    fire(targetCell) {
        let matrixCell = this.matrix[targetCell.x][targetCell.y]
        if (matrixCell.shipID !== null) {
            let ship = this.ships.find(ship => { return ship.id === matrixCell.shipID })
            matrixCell.setStatus('hit')
            ship.hit()
        } else {
            matrixCell.setStatus('miss')
        }
    }

    /**
     * check if the coordinates inside the grid
     * @param {number} x 
     * @param {number} y 
     */
    isInsideGrid(x, y) {
        return x > -1 && y > -1 && x < this.size && y < this.size
    }


    /**
     * Place ships into board grid
     */
    placeShips = () => {
        let moves = generateMoves()
        let cell, currentShipIndex = 0
        let currentShip = this.ships[currentShipIndex]
        while (moves.length > 0) {
            cell = moves.pop()
            if (this.checkOrMarkArea(cell, currentShip, true)) {
                this.placeShip(cell, currentShip)
                this.checkOrMarkArea(cell, currentShip, false)
                if (currentShipIndex + 1 === this.ships.length) {
                    break
                } else {
                    currentShipIndex += 1
                    currentShip = this.ships[currentShipIndex]
                }
            }
        }
    }

    /**
     * The function 
     * part 1: check if it's possible to place the farest cell onto the grid
     * part 2: check if there is a ship overlapping with possible position
     * part 3: check if there is an overlap for L-ship "appendix"
     * @param {Cell} cell 
     * @param {Ship} ship 
     * @param {boolean} check
     */
    checkOrMarkArea = (cell, ship, check = true) => {
        let minX, maxX, minY, maxY
        minX = maxX = minY = maxY = 1
        switch (ship.rotation.toString()) {
            case 'right':
                maxY = ship.length
                break
            case 'left':
                minY = ship.length
                break
            case 'up':
                minX = ship.length
                break
            case 'down':
                maxX = ship.length
                break
        }
        // part 1
        if (check) {
            if (ship.rotation.toString() === 'right' || ship.rotation.toString() === 'left') {
                if (!this.isInsideGrid(cell.x, cell.y + ship.rotation * (ship.length - 1))) {
                    return false
                }
                if (ship.type === ShipTypes.L && !this.isInsideGrid(cell.x - ship.rotation * 1, cell.y + 2 * ship.rotation)) {
                    return false
                }
            } else {
                if (!this.isInsideGrid(cell.x + ship.rotation * (ship.length - 1)), cell.y) {
                    return false
                }
                if (ship.type === ShipTypes.L && !this.isInsideGrid(cell.x + ship.rotation * 2, cell.y + 1 * ship.rotation)) {
                    return false
                }
            }
        }
        //part 2
        for (let i = cell.x - minX; i <= cell.x + maxX; i++) {
            for (let j = cell.y - minY; j <= cell.y + maxY; j++) {
                if (check && this.isInsideGrid(i, j) && this.matrix[i][j].shipID !== null) {
                    return false
                } else if (!check && this.isInsideGrid(i, j) && this.matrix[i][j].shipID === null) {
                    this.matrix[i][j].setShipIsNear(true)
                }
            }
        }
        //part 3
        if (ship.type === ShipTypes.L) {
            switch (ship.rotation.toString()) {
                case 'left':
                    for (let j = cell.y - 1; j >= cell.y - ship.length; j--) {
                        if (check && this.isInsideGrid(cell.x + (ship.length - 1), j) && this.matrix[cell.x + (ship.length - 1)][j].shipID !== null) {
                            return false
                        } else if (!check && this.isInsideGrid(ship.position.x + (ship.length - 1), j) && this.matrix[ship.position.x + (ship.length - 1)][j].shipID === null) {
                            this.matrix[ship.position.x + (ship.length - 1)][j].setShipIsNear(true)
                        }
                    }
                    break
                case 'right':
                    for (let j = cell.y + 1; j <= cell.y + ship.length; j++) {
                        if (check && this.isInsideGrid(cell.x - (ship.length - 1), j) && this.matrix[cell.x - (ship.length - 1)][j].shipID !== null) {
                            return false
                        } else if (!check && this.isInsideGrid(cell.x - (ship.length - 1), j) && this.matrix[cell.x - (ship.length - 1)][j].shipID === null) {
                            this.matrix[ship.position.x - (ship.length - 1)][j].setShipIsNear(true)
                        }
                    }
                    break
                case 'up':
                    for (let i = cell.x - 1; i >= cell.x - ship.length; i--) {
                        if (check && this.isInsideGrid(i, cell.y - (ship.length - 1)) && this.matrix[i][cell.y - (ship.length - 1)].shipID !== null) {
                            return false
                        } else if (!check && this.isInsideGrid(i, ship.position.y - (ship.length - 1)) && this.matrix[i][ship.position.y - (ship.length - 1)].shipID === null) {
                            this.matrix[i][ship.position.y - (ship.length - 1)].setShipIsNear(true)
                        }
                    }
                    break
                case 'down':
                    for (let i = cell.x + 1; i <= cell.x + ship.length; i++) {
                        if (check && this.isInsideGrid(i, cell.y + (ship.length - 1)) && this.matrix[i][cell.y + (ship.length - 1)].shipID === null) {
                            return false
                        } else if (!check && this.isInsideGrid(i, ship.position.y + (ship.length - 1)) && this.matrix[i][ship.position.y + (ship.length - 1)].shipID == null) {
                            this.matrix[i][ship.position.y + (ship.length - 1)].setShipIsNear(true)
                        }
                    }
                    break
            }
        }
        return true
    }

    /**
     * Place ship into cell
     * @param {Cell} cell 
     * @param {Ship} ship 
     */
    placeShip = (cell, ship) => {
        switch (ship.rotation.toString()) {
            case 'right':
                for (let j = cell.y; j < cell.y + ship.length; j++) {
                    this.matrix[cell.x][j].setShipId(ship.id)
                }
                if (ship.type === ShipTypes.L) {
                    console.log(cell.x - 1, cell.y + 2)
                    this.matrix[cell.x - 1][cell.y + 2].setShipId(ship.id)
                }
                ship.setPosition(cell)
                break
            case 'left':
                for (let j = cell.y; j > cell.y - ship.length; j--) {
                    this.matrix[cell.x][j].setShipId(ship.id)
                }
                if (ship.type === ShipTypes.L) {
                    console.log(cell.x + 1, cell.y - 2)
                    this.matrix[cell.x + 1][cell.y - 2].setShipId(ship.id)
                }
                ship.setPosition(cell)
                break
            case 'up':
                for (let i = cell.x; i > cell.x - ship.length; i--) {
                    this.matrix[i][cell.y].setShipId(ship.id)
                }
                if (ship.type === ShipTypes.L) {
                    console.log(cell.x - 2, cell.y - 1)
                    this.matrix[cell.x - 2][cell.y - 1].setShipId(ship.id)
                }
                ship.setPosition(cell)
                break
            case 'down':
                for (let i = cell.x; i < cell.x + ship.length; i++) {
                    this.matrix[i][cell.y].setShipId(ship.id)
                }
                if (ship.type === ShipTypes.L) {
                    console.log(cell.x + 2, cell.y + 1)
                    this.matrix[cell.x + 2][cell.y + 1].setShipId(ship.id)
                }
                ship.setPosition(cell)
                break
            default:
                for (let i = cell.x; i < cell.x + ship.length; i++) {
                    this.matrix[i][cell.y].setShipId(ship.id)
                }
                ship.setPosition(cell)
        }
    }

}