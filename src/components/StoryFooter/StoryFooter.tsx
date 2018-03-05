import React, { Component } from 'react';
import Counter from '../../components/Counter/Counter';
import './StoryFooter.scss';

interface Props {
    numComments: number;
    points: number;
    story: string;
    storyID: string;
    toggleComments: any;
}
const StoryFooter = (props: Props) => {
    return (
        <section className='story__footer'>
            <Counter 
              points={props.points} 
              story={props.story}
              storyID={props.storyID} 
            />

            <a className='story__comment-toggle' onClick={props.toggleComments}>
                Comments 
                ({props.numComments})
            </a>
        </section>
    );
}

export default StoryFooter;
