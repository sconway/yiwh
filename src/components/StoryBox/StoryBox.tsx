import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import root from 'window-or-global'
import classNames from 'classnames';
// import DebounceInput from 'react-debounce-input';
import ImageUploader from '../../containers/ImageUploader/ImageUploader';
import RadioButtons from '../../components/RadioButtons/RadioButtons';
import Spinner from '../../components/Spinner/Spinner';
import './StoryBox.scss';

interface Props {
    domain: string;
    handleRadioButtonSelection: any;
    handleStoryBoxToggle: any;
    isValidStory: boolean;
    isPosting: boolean;
    mindState: string;
    shouldErrorMessageShow: boolean;
    shouldStoryBoxShow: boolean;
    storyImage: string;
    updateStory: any;
    updateStoryImage: any;
    validateStory: any;
};

interface State {
    isOffline: boolean;
};

export default class StoryBox extends Component<Props, State> {
    constructor(props:Props) {
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
            'has-image': this.props.storyImage.length > 0,
            'invalid': !this.props.isValidStory,
            'is-posting': this.props.isPosting,
            'visible': this.props.shouldStoryBoxShow
        });

        return (
            <section>
                <button className='story-box__toggle' onClick={this.props.handleStoryBoxToggle} >
                    Tell us a story <span className='story-box__icon'>✏️</span>
                </button>

                <div className={storyBoxClasses}>
                    <textarea
                        className='story-box__story'
                        name='story'
                        onChange={this.props.updateStory}
                        placeholder='Tell us a funny story...'
                    />

                    {this.props.shouldErrorMessageShow && <p className='error-message'>{errorMessage}</p>}

                    {this.props.domain.length < 2 && (
                        <RadioButtons 
                            handleRadioButtonSelection={this.props.handleRadioButtonSelection} 
                            mindState={this.props.mindState}
                        />
                    )}

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
