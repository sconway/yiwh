import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Footer.scss';

const Footer = (props) => {
    /**
     * Called when the contact button is clicked. Copies the contact
     * email to the clipboard for later use.
     */
    const handleClick = (e) => {
        e.preventDefault();

        document.getElementById('emailText').select();
        document.execCommand('copy');
        alert('email address copied to clipboard');
    };

    // Format the name that displays in the footer
    const domain = props.domain.length > 3 ? ' ' + props.domain : '...';

    return (
        <footer className='footer mdl-mini-footer'>
            <div className='mdl-mini-footer__left-section'>
                <div className='mdl-logo'>Yes, I was{domain} &copy; 2017</div>
                <a href='' className='footer__contact' id='tooltip' onClick={handleClick}>
                    <span className='icon material-icons'>email</span>
                    Contact
                </a>
                <div className='mdl-tooltip mdl-tooltip--large mdl-tooltip--top' htmlFor='tooltip'>
                    yesiwas@gmail.com
                </div>
                <input className='email-input' defaultValue='yesiwas@gmail.com' id='emailText' type='text' />
            </div>
        </footer>
    );
}

export default Footer;
