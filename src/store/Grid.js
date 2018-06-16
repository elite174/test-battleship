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
            this.ships.push(new Ship(ShipTypes.DOT, null, 1))
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
    placeShips() {
        let moves = generateMoves()
        let cell, currnetShipIndex = 0
        let currnetShip = this.ships[currnetShipIndex]
        while (moves.length > 0) {
            cell = moves.pop()
            if (this.canPlaceShip(cell, currnetShip)) {
                this.placeShip(cell, currnetShip)
                this.fillNearArea(currnetShip)
                if (currnetShipIndex + 1 === this.ships.length) {
                    break
                } else {
                    currnetShipIndex += 1
                    currnetShip = this.ships[currnetShipIndex]
                }
            }
        }
    }

    /**
     * check if it's possible to place a ship into the cell
     * @param {Cell} cell 
     * @param {Ship} ship 
     */
    canPlaceShip(cell, ship) {
        switch (ship.type) {
            case ShipTypes.DOT:
                for (let i = cell.x - 1; i <= cell.x + 1; i++) {
                    for (let j = cell.y - 1; j <= cell.y + 1; j++) {
                        if (this.isInsideGrid(i, j) && this.matrix[i][j].shipID !== null) {
                            return false
                        }
                    }
                }
                break
            case ShipTypes.I:
                switch (ship.rotation) {
                    case 'right':
                        if (this.isInsideGrid(cell.x, cell.y + 3)) {
                            for (let i = cell.x - 1; i <= cell.x + 1; i++) {
                                for (let j = cell.y - 1; j <= cell.y + 3 + 1; j++) {
                                    if (this.isInsideGrid(i, j) && this.matrix[i][j].shipID !== null) {
                                        return false
                                    }
                                }
                            }
                        } else {
                            return false
                        }
                        break
                    case 'left':
                        if (this.isInsideGrid(cell.x, cell.y - 3)) {
                            for (let i = cell.x - 1; i <= cell.x + 1; i++) {
                                for (let j = cell.y + 1; j >= cell.y - 3 - 1; j--) {
                                    if (this.isInsideGrid(i, j) && this.matrix[i][j].shipID !== null) {
                                        return false
                                    }
                                }
                            }
                        } else {
                            return false
                        }
                        break
                    case 'up':
                        if (this.isInsideGrid(cell.x - 3, cell.y)) {
                            for (let i = cell.x + 1; i >= cell.x - 3 - 1; i--) {
                                for (let j = cell.y - 1; j <= cell.y + 1; j++) {
                                    if (this.isInsideGrid(i, j) && this.matrix[i][j].shipID !== null) {
                                        return false
                                    }
                                }
                            }
                        } else {
                            return false
                        }
                        break
                    case 'down':
                        if (this.isInsideGrid(cell.x + 3, cell.y)) {
                            for (let i = cell.x - 1; i <= cell.x + 3 + 1; i++) {
                                for (let j = cell.y - 1; j <= cell.y + 1; j++) {
                                    if (this.isInsideGrid(i, j) && this.matrix[i][j].shipID !== null) {
                                        return false
                                    }
                                }
                            }
                        } else {
                            return false
                        }
                        break
                }
                break
            case ShipTypes.L:
                switch (ship.rotation) {
                    case 'right':
                        if (this.isInsideGrid(cell.x, cell.y + 2) && this.isInsideGrid(cell.x - 1, cell.y + 2)) {
                            for (let i = cell.x - 1; i <= cell.x + 1; i++) {
                                for (let j = cell.y - 1; j <= cell.y + 2 + 1; j++) {
                                    if (this.isInsideGrid(i, j) && this.matrix[i][j].shipID !== null) {
                                        return false
                                    }
                                }
                            }
                            for (let j = cell.y + 1; j <= cell.y + 2 + 1; j++) {
                                if (this.isInsideGrid(cell.x - 2, j) && this.matrix[cell.x - 2][j].shipID !== null) {
                                    return false
                                }
                            }
                        } else {
                            return false
                        }
                        break
                    case 'left':
                        if (this.isInsideGrid(cell.x, cell.y - 2) && this.isInsideGrid(cell.x + 1, cell.y - 2)) {
                            for (let i = cell.x - 1; i <= cell.x + 1; i++) {
                                for (let j = cell.y + 1; j >= cell.y - 2 - 1; j--) {
                                    if (this.isInsideGrid(i, j) && this.matrix[i][j].shipID !== null) {
                                        return false
                                    }
                                }
                            }
                            for (let j = cell.y - 1; j >= cell.y - 2 - 1; j--) {
                                if (this.isInsideGrid(cell.x + 2, j) && this.matrix[cell.x + 2][j].shipID !== null) {
                                    return false
                                }
                            }
                        } else {
                            return false
                        }
                        break
                    case 'up':
                        if (this.isInsideGrid(cell.x - 2, cell.y) && this.isInsideGrid(cell.x - 2, cell.y - 1)) {
                            for (let i = cell.x + 1; i >= cell.x - 2 - 1; i--) {
                                for (let j = cell.y - 1; j <= cell.y + 1; j++) {
                                    if (this.isInsideGrid(i, j) && this.matrix[i][j].shipID !== null) {
                                        return false
                                    }
                                }
                            }
                            for (let i = cell.x - 1; i >= cell.x - 2 - 1; i--) {
                                if (this.isInsideGrid(i, cell.y - 2) && this.matrix[i][cell.y - 2].shipID !== null) {
                                    return false
                                }
                            }
                        } else {
                            return false
                        }
                        break
                    case 'down':
                        if (this.isInsideGrid(cell.x + 2, cell.y) && this.isInsideGrid(cell.x + 2, cell.y + 1)) {
                            for (let i = cell.x - 1; i <= cell.x + 2 + 1; i++) {
                                for (let j = cell.y - 1; j <= cell.y + 1; j++) {
                                    if (this.isInsideGrid(i, j) && this.matrix[i][j].shipID !== null) {
                                        return false
                                    }
                                }
                            }
                            for (let i = cell.x + 1; i <= cell.x + 2 + 1; i++) {
                                if (this.isInsideGrid(i, cell.y + 2) && this.matrix[i][cell.y + 2].shipID !== null) {
                                    return false
                                }
                            }
                        } else {
                            return false
                        }
                        break
                }
                break
        }
        return true
    }

    /**
     * Place ship into cell
     * @param {Cell} cell 
     * @param {Ship} ship 
     */
    placeShip(cell, ship) {
        switch (ship.type) {
            case ShipTypes.DOT:
                this.matrix[cell.x][cell.y].setShipId(ship.id)
                ship.setPosition(cell)
                break
            case ShipTypes.I:
                switch (ship.rotation) {
                    case 'right':
                        for (let j = cell.y; j < cell.y + 4; j++) {
                            this.matrix[cell.x][j].setShipId(ship.id)
                        }
                        ship.setPosition(cell)
                        break
                    case 'left':
                        for (let j = cell.y; j > cell.y - 4; j--) {
                            this.matrix[cell.x][j].setShipId(ship.id)
                        }
                        ship.setPosition(cell)
                        break
                    case 'up':
                        for (let i = cell.x; i > cell.x - 4; i--) {
                            this.matrix[i][cell.y].setShipId(ship.id)
                        }
                        ship.setPosition(cell)
                        break
                    case 'down':
                        for (let i = cell.x; i < cell.x + 4; i++) {
                            this.matrix[i][cell.y].setShipId(ship.id)
                        }
                        ship.setPosition(cell)
                        break
                }
                break
            case ShipTypes.L:
                switch (ship.rotation) {
                    case 'right':
                        for (let j = cell.y; j < cell.y + 3; j++) {
                            this.matrix[cell.x][j].setShipId(ship.id)
                        }
                        this.matrix[cell.x - 1][cell.y + 2].setShipId(ship.id)
                        ship.setPosition(cell)
                        break
                    case 'left':
                        for (let j = cell.y; j > cell.y - 3; j--) {
                            this.matrix[cell.x][j].setShipId(ship.id)
                        }
                        this.matrix[cell.x + 1][cell.y - 2].setShipId(ship.id)
                        ship.setPosition(cell)
                        break
                    case 'up':
                        for (let i = cell.x; i > cell.x - 3; i--) {
                            this.matrix[i][cell.y].setShipId(ship.id)
                        }
                        this.matrix[cell.x - 2][cell.y - 1].setShipId(ship.id)
                        ship.setPosition(cell)
                        break
                    case 'down':
                        for (let i = cell.x; i < cell.x + 3; i++) {
                            this.matrix[i][cell.y].setShipId(ship.id)
                        }
                        this.matrix[cell.x + 2][cell.y + 1].setShipId(ship.id)
                        ship.setPosition(cell)
                        break
                }
                break
        }
    }

    /**
     * Fill the area near the ship (show that ship is near)
     * @param {Ship} ship 
     */
    fillNearArea(ship) {
        switch (ship.type) {
            case ShipTypes.DOT:
                for (let i = ship.position.x - 1; i <= ship.position.x + 1; i++) {
                    for (let j = ship.position.y - 1; j <= ship.position.y + 1; j++) {
                        if (this.isInsideGrid(i, j) && this.matrix[i][j].shipID === null) {
                            this.matrix[i][j].setShipIsNear(true)
                        }
                    }
                }
                break
            case ShipTypes.I:
                switch (ship.rotation) {
                    case 'right':
                        for (let i = ship.position.x - 1; i <= ship.position.x + 1; i++) {
                            for (let j = ship.position.y - 1; j <= ship.position.y + 3 + 1; j++) {
                                if (this.isInsideGrid(i, j) && this.matrix[i][j].shipID == null) {
                                    this.matrix[i][j].setShipIsNear(true)
                                }
                            }
                        }
                        break
                    case 'left':
                        for (let i = ship.position.x - 1; i <= ship.position.x + 1; i++) {
                            for (let j = ship.position.y + 1; j >= ship.position.y - 3 - 1; j--) {
                                if (this.isInsideGrid(i, j) && this.matrix[i][j].shipID == null) {
                                    this.matrix[i][j].setShipIsNear(true)
                                }
                            }
                        }
                        break
                    case 'up':
                        for (let i = ship.position.x + 1; i >= ship.position.x - 3 - 1; i--) {
                            for (let j = ship.position.y - 1; j <= ship.position.y + 1; j++) {
                                if (this.isInsideGrid(i, j) && this.matrix[i][j].shipID == null) {
                                    this.matrix[i][j].setShipIsNear(true)
                                }
                            }
                        }
                        break
                    case 'down':
                        for (let i = ship.position.x - 1; i <= ship.position.x + 3 + 1; i++) {
                            for (let j = ship.position.y - 1; j <= ship.position.y + 1; j++) {
                                if (this.isInsideGrid(i, j) && this.matrix[i][j].shipID == null) {
                                    this.matrix[i][j].setShipIsNear(true)
                                }
                            }
                        }
                        break
                }
                break
            case ShipTypes.L:
                switch (ship.rotation) {
                    case 'right':
                        for (let i = ship.position.x - 1; i <= ship.position.x + 1; i++) {
                            for (let j = ship.position.y - 1; j <= ship.position.y + 2 + 1; j++) {
                                if (this.isInsideGrid(i, j) && this.matrix[i][j].shipID == null) {
                                    this.matrix[i][j].setShipIsNear(true)
                                }
                            }
                        }
                        for (let j = ship.position.y + 1; j <= ship.position.y + 2 + 1; j++) {
                            if (this.isInsideGrid(ship.position.x - 2, j) && this.matrix[ship.position.x - 2][j].shipID == null) {
                                this.matrix[ship.position.x - 2][j].setShipIsNear(true)
                            }
                        }

                        break
                    case 'left':
                        for (let i = ship.position.x - 1; i <= ship.position.x + 1; i++) {
                            for (let j = ship.position.y + 1; j >= ship.position.y - 2 - 1; j--) {
                                if (this.isInsideGrid(i, j) && this.matrix[i][j].shipID == null) {
                                    this.matrix[i][j].setShipIsNear(true)
                                }
                            }
                        }
                        for (let j = ship.position.y - 1; j >= ship.position.y - 2 - 1; j--) {
                            if (this.isInsideGrid(ship.position.x + 2, j) && this.matrix[ship.position.x + 2][j].shipID == null) {
                                this.matrix[ship.position.x + 2][j].setShipIsNear(true)
                            }
                        }
                        break
                    case 'up':
                        for (let i = ship.position.x + 1; i >= ship.position.x - 2 - 1; i--) {
                            for (let j = ship.position.y - 1; j <= ship.position.y + 1; j++) {
                                if (this.isInsideGrid(i, j) && this.matrix[i][j].shipID == null) {
                                    this.matrix[i][j].setShipIsNear(true)
                                }
                            }
                        }
                        for (let i = ship.position.x - 1; i >= ship.position.x - 2 - 1; i--) {
                            if (this.isInsideGrid(i, ship.position.y - 2) && this.matrix[i][ship.position.y - 2].shipID == null) {
                                this.matrix[i][ship.position.y - 2].setShipIsNear(true)
                            }
                        }
                        break
                    case 'down':
                        for (let i = ship.position.x - 1; i <= ship.position.x + 2 + 1; i++) {
                            for (let j = ship.position.y - 1; j <= ship.position.y + 1; j++) {
                                if (this.isInsideGrid(i, j) && this.matrix[i][j].shipID == null) {
                                    this.matrix[i][j].setShipIsNear(true)
                                }
                            }
                        }
                        for (let i = ship.position.x + 1; i <= ship.position.x + 2 + 1; i++) {
                            if (this.isInsideGrid(i, ship.position.y + 2) && this.matrix[i][ship.position.y + 2].shipID == null) {
                                this.matrix[i][ship.position.y + 2].setShipIsNear(true)
                            }
                        }
                        break
                }
                break
        }
    }

}