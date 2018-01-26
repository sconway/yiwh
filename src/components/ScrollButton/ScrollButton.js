import React, { Component } from 'react';
import classNames from 'classnames';
import './ScrollButton.scss';

const ScrollButton = (props) => {
    const buttonClasses = classNames('scroll-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--primary', {
        'visible': props.shouldBeVisible
    });

    /**
     * Called when the scroll button is clicked.
     * Dispatches the scroll function.
     */
    const handleClick = () => scrollToTop(500);

    /**
     * Scrolls the page to the top in an animated fasion. Adapted from:
     * https://stackoverflow.com/questions/21474678/scrolltop-animation-without-jquery
     *
     * @param {Integer} scrollDuration
     */
    const scrollToTop = (scrollDuration) => {
        let container = document.querySelector('.mdl-layout__content'),
            scrollStep = -container.scrollTop / (scrollDuration / 15);

        const scrollInterval = setInterval(() => {
            if (container.scrollTop != 0) {
                if (container.scrollBy) {
                    container.scrollBy(0, scrollStep );
                } else {
                    container.scrollTop = 0;
                }
            } else {
                clearInterval(scrollInterval); 
            }
        }, 15);
    };

    return (
        <button className={buttonClasses} onClick={handleClick} >
            <i className='material-icons'>arrow_upward</i>
        </button>
    );
};

export default ScrollButton;
