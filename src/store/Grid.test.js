import GridModel from './Grid'
import Ship from './Ship';
import { ShipTypes, getRandomRotation, Rotations } from '../utils';
import Cell from './Cell';

describe('Testing placeShip function', () => {
    let grid, ship
    beforeEach(() => {
        grid = new GridModel(10)
    })
    test('placeShip works for DOT ship', () => {
        ship = new Ship(ShipTypes.DOT, getRandomRotation(), 1)
        grid.placeShip(new Cell(1, 1), ship)
        expect(grid.matrix[1][1].shipID).not.toBeNull()
    })
    test('placeShip works for I ship (left)', () => {
        ship = new Ship(ShipTypes.I, Rotations[0], 4)
        grid.placeShip(new Cell(2, 4), ship)
        let result = true
        for (let i = 4; i > 4 - ship.length; i--) {
            result = result && grid.matrix[2][i].shipID !== null
        }
        expect(result).toBe(true)
    })
    test('placeShip works for I ship (right)', () => {
        ship = new Ship(ShipTypes.I, Rotations[1], 4)
        grid.placeShip(new Cell(2, 4), ship)
        let result = true
        for (let i = 4; i < 4 + ship.length; i++) {
            result = result && grid.matrix[2][i].shipID !== null
        }
        expect(result).toBe(true)
    })
    test('placeShip works for I ship (up)', () => {
        ship = new Ship(ShipTypes.I, Rotations[2], 4)
        grid.placeShip(new Cell(4, 4), ship)
        let result = true
        for (let i = 4; i > 4 - ship.length; i--) {
            result = result && grid.matrix[i][4].shipID !== null
        }
        expect(result).toBe(true)
    })
    test('placeShip works for I ship (down)', () => {
        ship = new Ship(ShipTypes.I, Rotations[3], 4)
        grid.placeShip(new Cell(4, 4), ship)
        let result = true
        for (let i = 4; i < 4 + ship.length; i++) {
            result = result && grid.matrix[i][4].shipID !== null
        }
        expect(result).toBe(true)
    })
    test('placeShip works for L ship (left)', () => {
        ship = new Ship(ShipTypes.L, Rotations[0], 4)
        grid.placeShip(new Cell(2, 4), ship)
        let result = true
        for (let i = 4; i > 4 - ship.length; i--) {
            result = result && grid.matrix[2][i].shipID !== null
        }
        result = result && grid.matrix[3][2].shipID !== null
        expect(result).toBe(true)
    })
    test('placeShip works for L ship (right)', () => {
        ship = new Ship(ShipTypes.L, Rotations[1], 4)
        grid.placeShip(new Cell(2, 4), ship)
        let result = true
        for (let i = 4; i < 4 + ship.length; i++) {
            result = result && grid.matrix[2][i].shipID !== null
        }
        result = result && grid.matrix[1][6].shipID !== null
        expect(result).toBe(true)
    })
    test('placeShip works for L ship (up)', () => {
        ship = new Ship(ShipTypes.L, Rotations[2], 4)
        grid.placeShip(new Cell(4, 4), ship)
        let result = true
        for (let i = 4; i > 4 - ship.length; i--) {
            result = result && grid.matrix[i][4].shipID !== null
        }
        result = result && grid.matrix[2][3].shipID !== null
        expect(result).toBe(true)
    })
    test('placeShip works for L ship (down)', () => {
        ship = new Ship(ShipTypes.L, Rotations[3], 4)
        grid.placeShip(new Cell(4, 4), ship)
        let result = true
        for (let i = 4; i < 4 + ship.length; i++) {
            result = result && grid.matrix[i][4].shipID !== null
        }
        result = result && grid.matrix[6][5].shipID !== null
        expect(result).toBe(true)
    })
})
describe('Testing the possibility to place DOT ship', () => {
    let grid, ship
    beforeEach(() => {
        grid = new GridModel(10)
    })
    test(`It's possible to place a DOT ship at empty cell`, () => {
        ship = new Ship(ShipTypes.DOT, getRandomRotation(), 1)
        expect(grid.canPlaceShip(new Cell(0, 0), ship, true)).toBe(true)
    })
    test(`It's not possible to place a DOT ship outside the grid`, () => {
        ship = new Ship(ShipTypes.DOT, getRandomRotation(), 1)
        expect(grid.canPlaceShip(new Cell(10, 0), ship, true)).toBe(false)
    })
    test(`It's not possible to place a DOT if some ship is near`, () => {
        ship = new Ship(ShipTypes.DOT, getRandomRotation(), 1)
        grid.placeShip(new Cell(0, 1), new Ship(ShipTypes.DOT, getRandomRotation(), 1))
        expect(grid.canPlaceShip(new Cell(0, 0), ship, true)).toBe(false)
    })
})

describe('Testing the possibility to place I ship', () => {
    let grid, ship
    beforeEach(() => {
        grid = new GridModel(10)
    })
    test(`It's possible to place I ship at empty cell`, () => {
        ship = new Ship(ShipTypes.I, Rotations[0], 4)
        expect(grid.canPlaceShip(new Cell(0, 5), ship, true)).toBe(true)
    })
    test(`It's not possible to place a I ship outside the grid`, () => {
        ship = new Ship(ShipTypes.I, Rotations[0], 4)
        expect(grid.canPlaceShip(new Cell(0, 0), ship, true)).toBe(false)
    })
    test(`It's not possible to place a I if some ship is near`, () => {
        ship = new Ship(ShipTypes.I, Rotations[3], 4)
        grid.placeShip(new Cell(0, 1), new Ship(ShipTypes.DOT, getRandomRotation(), 1))
        expect(grid.canPlaceShip(new Cell(0, 0), ship, true)).toBe(false)
    })
})

describe('Testing the possibility to place L ship', () => {
    let grid, ship
    beforeEach(() => {
        grid = new GridModel(10)
    })
    test(`It's possible to place L ship at empty cell`, () => {
        ship = new Ship(ShipTypes.L, Rotations[0], 4)
        expect(grid.canPlaceShip(new Cell(0, 5), ship, true)).toBe(true)
    })
    test(`It's not possible to place a L ship outside the grid`, () => {
        ship = new Ship(ShipTypes.L, Rotations[1], 4)
        expect(grid.canPlaceShip(new Cell(0, 0), ship, true)).toBe(false)
    })
    test(`It's not possible to place a L if some ship is near`, () => {
        ship = new Ship(ShipTypes.L, Rotations[3], 4)
        grid.placeShip(new Cell(0, 1), new Ship(ShipTypes.DOT, getRandomRotation(), 1))
        expect(grid.canPlaceShip(new Cell(0, 0), ship, true)).toBe(false)
    })
})


describe('Fire works', () => {
    let grid, ship
    beforeEach(() => {
        grid = new GridModel(10)
    })
    test('Fire to empty cell works', () => {
        grid.fire(new Cell(0, 0))
        expect(grid.matrix[0][0].status).toBe('miss')
    })
    test('Fire to ship cell works', () => {
        ship = new Ship(ShipTypes.DOT, getRandomRotation(), 1)
        grid.placeShip(new Cell(0, 0), ship)
        grid.fire(new Cell(0, 0))
        expect(grid.matrix[0][0].status).toBe('hit')
    })
})
