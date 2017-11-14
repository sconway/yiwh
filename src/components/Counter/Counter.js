import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Counter.scss';

export default class Counter extends Component {
    constructor(props) {
        super(props);

        this.pointsChanged = 0;
        
        this.state = {
          points: this.props.points || 0
        };
    }

    /**
     * Used to decrement the point count by 1
     */
    decrementCount = () => {
        if (this.pointsChanged > -1) {
            this.pointsChanged--;

            this.setState((prevState) => {
                return {
                    points: prevState.points - 1
                }
            }, this.postData);
        }
    }

    /**
     * Used to increment the point count by 1
     */
    incrementCount = () => {
        if (this.pointsChanged < 1) {
            this.pointsChanged++;

            this.setState((prevState) => {
                return {
                    points: prevState.points + 1
                }
            }, this.postData);
        }
    }

    /**
     * Posts our point data to the server.
     */
    postData = () => {
        const pointUpdate = {
            points: this.state.points,
            storyID: this.props.storyID
        };

        fetch('/updatePoints', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pointUpdate)
        })
        .then((response) => {
            if (response.ok) {
                console.log('Point Data Posted');
            } else {
                console.log('Error posting points. Response not OK');
            }
        })
        .catch((err) => {
            console.log('Error posting points: ', err);
        });
    }

    render() {
        return (
            <div className='counter'>
                <span className='counter__points'>
                    <span className='counter__points__number'>{this.state.points}</span>
                    <span className='mdl-layout--large-screen-only'>Points</span>
                </span>

                <div className='counter__buttons'>
                    <button 
                        className='counter__buttons--plus mdl-button mdl-button--fab mdl-button--colored  mdl-button--primary mdl-js-button mdl-js-ripple-effect'
                        onClick={this.incrementCount}
                    >
                        <i className='material-icons'>add</i>
                    </button>
                    <button 
                        className='counter__buttons--minus mdl-button mdl-button--fab mdl-button--colored mdl-js-button mdl-js-ripple-effect'
                        onClick={this.decrementCount}
                    >
                        <i className='material-icons'>remove</i>
                    </button>
                </div>
            </div>
        );
    }
}
