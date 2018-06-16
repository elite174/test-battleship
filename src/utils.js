import Cell from "./store/Cell";

/**
 * Returns random int value (x) between a and b : a <= x <= b
 * @param {number} a 
 * @param {number} b 
 */
export const random = (a, b) => {
    return a + Math.round(Math.random() * (b - a))
}

/**
 * Set of rotations
 */
export const Rotation = ['left', 'right', 'up', 'down']

export const ShipTypes = {
    DOT: 'dot',
    L: 'L',
    I: 'I'
}

export const getRandomRotation = () => { return Rotation[random(0, Rotation.length - 1)] }

/**
 * Returns the moves for 1 game
 */
export const generateMoves = () => {
    let moves = []
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            moves[i * 10 + j] = new Cell(i, j)
        }
    }
    return shuffle(moves)
}

/**
 * Shuffle an array (the code from the internet)
 * @param {array} array 
 */
const shuffle = (array) => {
    let counter = array.length;

    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);
        counter--;
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}
