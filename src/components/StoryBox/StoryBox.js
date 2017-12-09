import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import root from 'window-or-global'
import classNames from 'classnames';
import DebounceInput from 'react-debounce-input';
import ImageUploader from 'containers/ImageUploader/ImageUploader';
import RadioButtons from 'components/RadioButtons/RadioButtons';
import Spinner from 'components/Spinner/Spinner';
import './StoryBox.scss';

export default class StoryBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOffline: false
        };
    }

    componentDidMount() {
        root.addEventListener('online', this.handleOnline, false);
    }

    componentWillUnmount() {
        // Remove the event listener when we leave this page/component.
        root.removeEventListener('online', this.handleOnline, false);
    }

    /**
     * Called when the device goes back online. Sets the state
     * to reflect this, if it has not already.
     */
    handleOnline = () => {
        if (this.state.isOffline) this.setState({ isOffline: false });
    }

    /**
     * Called when the submit button is clicked. Displays an message if
     * there is no connection, or invokes the callback to validate the story.
     */
    onSubmit = () => {
        navigator.onLine ? this.props.validateStory() : this.setState({ isOffline: true });
    }

    render() {
        const connectionErrorMessage = 'There doesn\'t appear to be an Internet connection :(';
        const errorMessage = 'Stories must be at least 10 characters, without any special characters (%, <, *, &, etc.)';
        const storyBoxClasses = classNames('story-box', {
            'error': this.props.shouldErrorMessageShow,
            'has-image': this.props.storyImage,
            'invalid': !this.props.isValidStory,
            'is-posting': this.props.isPosting,
            'visible': this.props.shouldStoryBoxShow
        });

        return (
            <section>
                <button className='story-box__toggle' onClick={this.props.handleStoryBoxToggle} >
                    Tell us a story
                </button>

                <div className={storyBoxClasses}>
                    <DebounceInput
                        className='story-box__story'
                        debounceTimeout={500}
                        element='textarea'
                        name='story' 
                        type='text'
                        onChange={this.props.updateStory}
                        placeholder='Tell us a funny story...'
                    />

                    {this.props.shouldErrorMessageShow && <p className='error-message'>{errorMessage}</p>}

                    <RadioButtons 
                        handleRadioButtonSelection={this.props.handleRadioButtonSelection} 
                        mindState={this.props.mindState}
                    />

                    <ImageUploader
                        domain={this.props.domain} 
                        updateStoryImage={this.props.updateStoryImage} 
                    />

                    {this.state.isOffline && <p className='error-message'>{connectionErrorMessage}</p>}

                    <button className='story-box__submit' onClick={this.onSubmit} >
                        <Spinner /> Submit
                    </button>
                </div>
            </section>
        );
    }
}
