import React from 'react'
import { observer } from 'mobx-react';
import { ShipTypes } from '../../utils';
import './style.css'

const DotShip = observer(({ ship }) => {
    let x = ship.position.x + 1, y = ship.position.y + 1
    let style = {
        gridRow: `${x} / span 1`,
        gridColumn: `${y} / span 1`
    }
    return <div style={style} className={ship.status === 'died' ? 'hidden-cell active' : 'hidden-cell'} />
})

const IShip = observer(({ ship }) => {
    let style
    let x = ship.position.x + 1, y = ship.position.y + 1
    switch (ship.rotation) {
        case 'left':
            style = {
                gridRow: `${x} / span 1`,
                gridColumn: `${y - 3} / span 4`
            }
            break
        case 'right':
            style = {
                gridRow: `${x} / span 1`,
                gridColumn: `${y} / span 4`
            }
            break
        case 'up':
            style = {
                gridRow: `${x - 3} / span 4`,
                gridColumn: `${y} / span 1`
            }
            break
        case 'down':
            style = {
                gridRow: `${x} / span 4`,
                gridColumn: `${y} / span 1`
            }
            break
    }
    return <div style={style} className={ship.status === 'died' ? 'hidden-cell active' : 'hidden-cell'} />
})

const LShip = observer(({ ship }) => {
    let style, styleL
    let x = ship.position.x + 1, y = ship.position.y + 1
    switch (ship.rotation) {
        case 'left':
            style = {
                gridRow: `${x} / span 1`,
                gridColumn: `${y - 2} / span 3`
            }
            styleL = {
                gridRow: `${x} / span 2`,
                gridColumn: `${y - 2} / span 1`
            }
            break
        case 'right':
            style = {
                gridRow: `${x} / span 1`,
                gridColumn: `${y} / span 3`
            }
            styleL = {
                gridRow: `${x - 1} / span 2`,
                gridColumn: `${y + 2} / span 1`
            }
            break
        case 'up':
            style = {
                gridRow: `${x - 2} / span 3`,
                gridColumn: `${y} / span 1`
            }
            styleL = {
                gridRow: `${x - 2} / span 1`,
                gridColumn: `${y - 1} / span 2`
            }
            break
        case 'down':
            style = {
                gridRow: `${x} / span 3`,
                gridColumn: `${y} / span 1`
            }
            styleL = {
                gridRow: `${x + 2} / span 1`,
                gridColumn: `${y} / span 2`
            }
            break

    }
    return <React.Fragment>
        <div style={style} className={ship.status === 'died' ? 'hidden-cell active' : 'hidden-cell'} />
        <div style={styleL} className={ship.status === 'died' ? 'hidden-cell active' : 'hidden-cell'} />
    </React.Fragment>
})

const HiddenCell = ({ ship }) => {
    let shipComponent
    if (ship !== undefined) {
        if (ship.type === ShipTypes.DOT) {
            shipComponent = <DotShip ship={ship} />
        } else if (ship.type === ShipTypes.I) {
            shipComponent = <IShip ship={ship} />
        } else {
            shipComponent = <LShip ship={ship} />
        }
    }
    return shipComponent
}

export default HiddenCell