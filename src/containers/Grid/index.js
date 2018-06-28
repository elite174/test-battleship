import React from 'react'
import './style.css'
import GridCell from '../../components/GridCell';
import GridModel from '../../store/Grid';
import { generateMoves } from '../../utils';
import { inject, observer } from 'mobx-react';
import HiddenCell from '../../components/HiddenCell';


/**
 * Renders two grids:
 * One with squares, another (hidden) with ships
 */
@inject('controller')
@observer
class Grid extends React.Component {
    constructor(props) {
        super(props)
        this.cells = []
        this.hiddenCells = []
        let ship
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                let cell = props.controller.grid.matrix[i][j]
                ship = props.controller.grid.getShipForCell(cell)
                if (ship !== undefined) {
                    this.hiddenCells.push(<HiddenCell key={ship.id} ship={ship} />)
                }
                this.cells.push(<GridCell key={i * 10 + j} cell={props.controller.grid.matrix[i][j]} />)
            }
        }
    }
    render() {
        return <div className='board'>
            <div className='grid'>
                {this.cells}
                <div className='hidden-grid'>
                    {this.hiddenCells}
                </div>
                {this.props.controller.aliveShips === 0 && <div className='restart'>
                    <div className='restart__button' onClick={() => document.location.reload()}>Restart</div>
                </div>}
            </div>
        </div>
    }
}

export default Grid