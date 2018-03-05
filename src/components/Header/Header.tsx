import React, { Component } from 'react';
import './Header.scss';

interface Props {
    domain: string;
    filterByDate: any;
    filterByRating: any;
    updateSearchTerm: any;
};

const Header = (props:Props) => {
    const showNewest = () => props.filterByDate(1);
    const showOldest = () => props.filterByDate(-1);
    const showLowestRated = () => props.filterByRating(-1);
    const showTopRated = () => props.filterByRating(1);
    // Format the name that displays in the footer
    const domain = props.domain.length > 3 ? ' ' + props.domain : '...';

    return (
        <header className='mdl-layout__header'>
            <div className='mdl-layout__header-row'>
                <h1 className='mdl-layout-title mdl-layout--large-screen-only'>Yes, I was{domain}</h1>

                <div className='mdl-layout-spacer'></div>

                <nav className='mdl-navigation mdl-layout--large-screen-only'>
                    <a className='mdl-navigation__link' onClick={showTopRated}>Top Rated</a>
                    <a className='mdl-navigation__link' onClick={showLowestRated}>Lowest Rated</a>
                    <a className='mdl-navigation__link' onClick={showNewest}>Newest</a>
                    <a className='mdl-navigation__link' onClick={showOldest}>Oldest</a>
                </nav>

                <div className='mdl-textfield mdl-js-textfield mdl-textfield--expandable mdl-textfield--floating-label mdl-textfield--align-right'>
                    <label className='mdl-button mdl-js-button mdl-button--icon' htmlFor='fixed-header-drawer-exp'>
                        <i className='material-icons'>search</i>
                    </label>
                    
                    <div className='mdl-textfield__expandable-holder'>
                        <input 
                            className='mdl-textfield__input' 
                            id='fixed-header-drawer-exp' 
                            onChange={props.updateSearchTerm}
                            name='sample' 
                            type='text' 
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
