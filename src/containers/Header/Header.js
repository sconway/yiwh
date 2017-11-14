import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Header.scss';

export default class Header extends Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        return (
            <header className="mdl-layout__header">
                <div className="mdl-layout__header-row">
                    <span className="mdl-layout-title mdl-layout--large-screen-only">Yes, I was...</span>

                    <div className="mdl-layout-spacer"></div>

                    <nav className="mdl-navigation mdl-layout--large-screen-only">
                        <a className="mdl-navigation__link" onClick={this.props.showTopRated}>Top Rated</a>
                        <a className="mdl-navigation__link" onClick={this.props.showLowestRated}>Lowest Rated</a>
                        <a className="mdl-navigation__link" onClick={this.props.showNewest}>Newest</a>
                        <a className="mdl-navigation__link" onClick={this.props.showOldest}>Oldest</a>
                    </nav>

                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable mdl-textfield--floating-label mdl-textfield--align-right">
                        <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="fixed-header-drawer-exp">
                            <i className="material-icons">search</i>
                        </label>
                        <div className="mdl-textfield__expandable-holder">
                            <input 
                                className="mdl-textfield__input" 
                                id="fixed-header-drawer-exp" 
                                onChange={this.props.updateSearchTerm}
                                name="sample" 
                                type="text" 
                            />
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}
