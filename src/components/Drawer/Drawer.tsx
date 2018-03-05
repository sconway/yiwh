import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Drawer.scss';

interface Props {
    domain: any;
    filterByDate: any;
    filterByRating: any;
};

const Drawer = (props: Props) => {
    const showNewest = () => props.filterByDate(1);
    const showOldest = () => props.filterByDate(-1);
    const showLowestRated = () => props.filterByRating(-1);
    const showTopRated = () => props.filterByRating(1);
    // Format the name that displays in the footer
    const domain = props.domain.length > 3 ? ' ' + props.domain : '...';

    return (
        <div className='drawer mdl-layout__drawer mdl-layout--small-screen-only'>
            <span className='mdl-layout-title'>Yes, I was{domain}</span>

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
