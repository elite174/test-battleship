import React from 'react'
import Grid from '../../components/Grid';
import './style.css'
import Info from '../../components/Info';
import { Provider } from 'mobx-react'
import controller from '../../store';
import Figures from './Figures';

const App = () => {
    return <Provider controller={controller}>
        <div className='app'>
            <Figures />
            <Info />
            <Grid />
        </div>
    </Provider>
}

export default App