import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import DebounceInput from 'react-debounce-input';
import ImageUploader from 'containers/ImageUploader/ImageUploader';
import RadioButtons from 'components/RadioButtons/RadioButtons';
import Spinner from 'components/Spinner/Spinner';
import './StoryBox.scss';

const StoryBox = (props) => {
    const errorMessage = "Stories must be at least 10 characters, without any special characters (%, <, *, &, etc.)";
    const storyBoxClasses = classNames('story-box', {
        'error': props.shouldErrorMessageShow,
        'has-image': props.storyImage,
        'invalid': !props.isValidStory,
        'is-posting': props.isPosting,
        'visible': props.shouldStoryBoxShow
    });

    return (
        <section>
            <button className='story-box__toggle' onClick={props.handleStoryBoxToggle} >
                Tell us a story
            </button>

            <div className={storyBoxClasses}>
                <DebounceInput
                    className='story-box__story'
                    debounceTimeout={500}
                    defaultValue={props.story}
                    element='textarea'
                    name='story' 
                    type='text'
                    onChange={props.updateStory}
                    placeholder='Tell us a funny story...' 
                    value={props.story}
                />

                {props.shouldErrorMessageShow && <p className='error-message'>{errorMessage}</p>}

                <RadioButtons handleRadioButtonSelection={props.handleRadioButtonSelection} />

                <ImageUploader updateStoryImage={props.updateStoryImage} />

                <button className='story-box__submit' onClick={props.validateStory} >
                    <Spinner />
                    Submit
                </button>
            </div>
        </section>
    );
};

export default StoryBox;
