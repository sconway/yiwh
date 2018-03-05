import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Counter.scss';

interface Props {
    points: number;    
    story: string;
    storyID: string;
};

interface State {
    points: number;
};

export default class Counter extends Component<Props, State> {
    private pointsChanged: number;

    constructor(props:Props) {
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

            this.setState((prevState) => ({
                points: prevState.points - 1
            }), this.postData);
        }
    }

    /**
     * Used to increment the point count by 1
     */
    incrementCount = () => {
        if (this.pointsChanged < 1) {
            this.pointsChanged++;

            this.setState((prevState) => ({
                points: prevState.points + 1
            }), this.postData);
        }
    }

    /**
     * Posts our point data to the server.
     */
    postData = () => {
        const pointUpdate = {
            points: this.state.points,
            story: this.props.story,
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
                    <span className='counter__points__text'>Points</span>
                </span>

                <div className='counter__buttons'>
                    <button 
                        className='counter__buttons--plus'
                        onClick={this.incrementCount}
                    >
                        <i className='material-icons'>add</i>
                    </button>

                    <button 
                        className='counter__buttons--minus'
                        onClick={this.decrementCount}
                    >
                        <i className='material-icons'>remove</i>
                    </button>
                </div>
            </div>
        );
    }
}
