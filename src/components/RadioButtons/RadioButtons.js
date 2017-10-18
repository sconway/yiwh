import React, { Component } from 'react';
import './RadioButtons.scss';

const RadioButtons = (props) => {
    /**
     * Called when a radio button is clicked. Sends
     * the selected value back to the parent.
     */
    const onRadioButtonChange = (e) => {
        props.handleRadioButtonSelection(e.target.value);
    }

    return (
        <div className='radio-buttons'>
            <span className='radio-buttons__text'>I was: </span>
            <input 
                className='radio-buttons__button' 
                id='drunkButton' 
                name='mindState' 
                onChange={onRadioButtonChange}
                type='radio'
                value='drunk' 
            />
            <label className='radio-buttons__label' htmlFor='drunkButton'>Drunk</label>
            <input 
                className='radio-buttons__button' 
                id='highButton'
                name='mindState'
                onChange={onRadioButtonChange}
                type='radio' 
                value='high'
            />
            <label className='radio-buttons__label' htmlFor='highButton'>High</label>
            <input
                checked 
                className='radio-buttons__button' 
                id='noneButton'
                name='mindState'
                onChange={onRadioButtonChange}
                type='radio' 
                value='neither'
            />
            <label className='radio-buttons__label' htmlFor='noneButton'>Neither</label>
        </div>
    );
}

export default RadioButtons;