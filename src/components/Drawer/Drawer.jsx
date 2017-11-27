import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const Drawer = (props) => {
    const showNewest = () => props.filterByDate(1);
    const showOldest = () => props.filterByDate(-1);
    const showLowestRated = () => props.filterByRating(-1);
    const showTopRated = () => props.filterByRating(1);

    return (
        <div className='mdl-layout__drawer  mdl-layout--small-screen-only'>
            <span className='mdl-layout-title'>Yes, I was...</span>

            <nav className='mdl-navigation'>
                <a className='mdl-navigation__link' onClick={showTopRated}>Top Rated</a>
                <a className='mdl-navigation__link' onClick={showLowestRated}>Lowest Rated</a>
                <a className='mdl-navigation__link' onClick={showNewest}>Newest</a>
                <a className='mdl-navigation__link' onClick={showOldest}>Oldest</a>
            </nav>
        </div>
    );
}

export default Drawer;
