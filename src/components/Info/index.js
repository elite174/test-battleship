import React from 'react'
import './style.css'
import { inject, observer } from 'mobx-react';

/**
 * Represents info panel at the left
 */
@inject('controller')
@observer
class Info extends React.Component {
    state = {
        play: false
    }
    playGame = () => {
        this.setState({ play: true })
        this.timer = setInterval(this.fire, 500)
    }
    pauseGame = () => {
        clearInterval(this.timer)
        this.setState({ play: false })
    }
    fire = () => {
        if (this.props.controller.aliveShips > 0) {
            this.props.controller.fire()
        }
    }
    handleClick = () => {
        if (this.state.play) {
            this.pauseGame()
        } else {
            this.playGame()
        }
    }
    componentDidMount() {
        document.addEventListener('click', this.fire)
        document.addEventListener('keydown', this.fire)
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.fire)
        document.removeEventListener('keydown', this.fire)
    }
    render() {
        if (this.props.controller.aliveShips === 0 && this.state.play) {
            this.pauseGame()
        }
        return <div className='info'>
            <div className='info__logo'>
                <i className='material-icons logo__icon'>directions_boat</i>
                <span>BattleShip</span>
            </div>
            <span className={this.props.controller.aliveShips === 0 ? 'btn disabled' : 'btn'} onClick={this.handleClick}>{this.state.play ? 'Stop' : 'Start'}</span>
            <div className='info__ships'>{`ALIVE SHIPS: ${this.props.controller.aliveShips}`}</div>
            <div className='info__ships'>PRESS SOMETHING TO FIRE</div>
        </div>
    }
}

export default Info