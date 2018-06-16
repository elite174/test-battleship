import React from 'react'
import './style.css'
import { observer } from 'mobx-react'

/**
 * Represents square cell on a grid
 */
const GridCell = observer(({ cell }) => {
    return <div className='grid__cell'>
        {cell.status === 'miss' && <div className='grid__cell grid__cell--miss' ><i className='material-icons icon'>radio_button_unchecked</i></div>}
        {cell.status === 'hit' && <div className='grid__cell grid__cell--hit' ><i className='material-icons icon'>clear</i></div>}
    </div>
})


export default GridCell