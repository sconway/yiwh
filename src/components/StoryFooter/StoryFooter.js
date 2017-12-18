import React, { Component } from 'react';
import Counter from 'components/Counter/Counter';
import './StoryFooter.scss';

const StoryFooter = (props) => {
    return (
        <section className='story__footer'>
            <Counter points={props.points} storyID={props.storyID} />

            <a className='story__comment-toggle' onClick={props.toggleComments}>
                Comments 
                ({props.numComments})
            </a>
        </section>
    );
}

export default StoryFooter;
