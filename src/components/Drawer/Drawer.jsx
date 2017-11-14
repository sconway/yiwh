import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const Drawer = (props) => {
    return (
        <div className='mdl-layout__drawer  mdl-layout--small-screen-only'>
            <span className='mdl-layout-title'>Yes, I was...</span>

            <nav className='mdl-navigation'>
                <a 
                    className='mdl-navigation__link'
                    onClick={props.showTopRated}
                >
                    Top Rated
                </a>

                <a 
                    className='mdl-navigation__link'
                    onClick={props.showLowestRated}
                >
                    Lowest Rated
                </a>

                <a 
                    className='mdl-navigation__link'
                    onClick={props.showNewest}
                >
                    Newest
                </a>

                <a 
                    className='mdl-navigation__link'
                    onClick={props.showOldest}
                >
                    Oldest
                </a>
            </nav>
        </div>
    );
}

export default Drawer;
