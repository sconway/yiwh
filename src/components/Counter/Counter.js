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
        console.log('posting points');
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
                <div className='counter__buttons'>
                    <button 
                        className='counter__buttons--plus  mdl-button mdl-button--fab mdl-button--colored  mdl-button--primary mdl-js-button mdl-js-ripple-effect'
                        onClick={this.incrementCount}
                    >
                        <span>+</span>
                    </button>
                    <button 
                        className='counter__buttons--minus  mdl-button mdl-button--fab mdl-button--colored mdl-js-button mdl-js-ripple-effect'
                        onClick={this.decrementCount}
                    >
                        <span>-</span>
                    </button>
                </div>

                <span className='counter__points mdl-button mdl-button--fab'>
                    {this.state.points}
                </span>
            </div>
        );
    }
}
