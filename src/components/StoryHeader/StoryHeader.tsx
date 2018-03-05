import React, { Component } from 'react';
import './StoryHeader.scss';

interface Props {
    formattedDate: string;
    mindState: string;
};

const StoryHeader = (props:Props) => {
    const emoji = props.mindState.toLowerCase() === 'high' ? `😑` : `🍺`;

    return (
        <section className='story__header'>
            <span className='story__emoji'>{emoji}</span>
            <span className='story__date'>{props.formattedDate}</span>
        </section>
    );
}

export default StoryHeader;
