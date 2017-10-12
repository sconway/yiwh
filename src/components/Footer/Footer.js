import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Footer.scss';

const Footer = () => {
    return (
        <footer className="mdl-mini-footer">
            <div className="mdl-mini-footer__left-section">
                <div className="mdl-logo">Yes, I was... &copy; 2017 Scripted Media LLC</div>
                <ul className="mdl-mini-footer__link-list">
                    <li><a href="#">Help</a></li>
                    <li><a href="#">Privacy & Terms</a></li>
                </ul>
            </div>
        </footer>
    );
}

export default Footer;
