import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Footer.scss';

interface Props {
    domain: string;
};

const Footer = (props:Props) => {
    // Format the name that displays in the footer
    const domain = props.domain.length > 3 ? ' ' + props.domain : '...';

    /**
     * Called when the contact button is clicked. Copies the contact
     * email to the clipboard for later use.
     */
    const handleClick = (e) => {
        e.preventDefault();

        let emailText = document.getElementById('emailText') as HTMLInputElement;
        
        emailText.select();
        document.execCommand('copy');
        alert('email address copied to clipboard');
    };

    return (
        <footer className='footer mdl-mini-footer'>
            <div className='mdl-mini-footer__left-section'>
                <div className='mdl-logo'>Yes, I was{domain} &copy; 2017</div>

                <a href='' className='footer__contact' id='tooltip' onClick={handleClick}>
                    <span className='icon material-icons'>email</span>
                    Contact
                </a>

                <label className='mdl-tooltip mdl-tooltip--large mdl-tooltip--top' htmlFor='tooltip'>
                    yesiwas.com@gmail.com
                </label>
                
                <input className='email-input' defaultValue='yesiwas.com@gmail.com' id='emailText' type='text' />
            </div>
        </footer>
    );
}

export default Footer;
