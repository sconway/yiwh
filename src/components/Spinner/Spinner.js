import React, { Component } from 'react';
import './Spinner.scss';

const Spinner = () => {
    return (
        <div className='spinner'>
            <svg className='spinner__circular' viewBox='25 25 50 50'>
                <circle className='spinner__path' cx='50' cy='50' r='20' fill='none' strokeWidth='2' strokeMiterlimit='10'/>
            </svg>
        </div>
    );
}

export default Spinner;