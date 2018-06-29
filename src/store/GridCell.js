import Cell from "./Cell";
import { observable, action } from "mobx";

/**
 * Represents Cell on a grid
 */
export default class GridCellModel extends Cell {

    shipID = null

    /**
     * status: empty, miss, hit
     */
    @observable
    status = 'empty'

    @action.bound
    setStatus(value) {
        this.status = value
    }

    setShipId(id) {
        this.shipID = id
    }
}