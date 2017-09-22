import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const Drawer = () => {
    return (
        <div className="mdl-layout__drawer  mdl-layout--small-screen-only">
            <span className="mdl-layout-title">Yes, I was high</span>
            <nav className="mdl-navigation">
                <a className="mdl-navigation__link" href="">Link</a>
                <a className="mdl-navigation__link" href="">Link</a>
                <a className="mdl-navigation__link" href="">Link</a>
                <a className="mdl-navigation__link" href="">Link</a>
            </nav>
        </div>
    );
}

export default Drawer;
