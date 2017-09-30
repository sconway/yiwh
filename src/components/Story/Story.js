import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Counter from 'components/Counter/Counter';
import { defaultDate } from 'global/js/helpers';
import './Story.scss';

const Story = (props) => {
    const date = props.date ? new Date(props.date) : defaultDate;
    const formattedDate = date.toDateString();

    return (
        <li className='story mdl-shadow--4dp'>
            <span className='story__date'>{formattedDate}</span>
            <p className='story__text'>{props.story}</p>
            {props.storyImageUrl && <img alt='picture depection of the story' src={props.storyImageUrl} />}
            <span className='story__signature'>&mdash; Yes, I was high</span>
            <Counter points={props.points} storyID={props.storyID} />
        </li>
    );
}

export default Story;
