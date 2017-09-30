import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DebounceInput from 'react-debounce-input';
import ImageUploader from 'containers/ImageUploader/ImageUploader'
import classNames from 'classnames';
import './StoryBox.scss';

const StoryBox = (props) => {
    const errorMessage = "Stories must be at least 10 characters, without any special characters (%, <, *, &, etc.)";
    const storyBoxClasses = classNames('story-box', {
        'error': props.shouldErrorMessageShow,
        'invalid': !props.isValidStory
    });

    return (
        <div className={storyBoxClasses}>
            <DebounceInput
                className='story-box__story'
                debounceTimeout={500}
                defaultValue={props.story}
                element='textarea'
                name='story' 
                type='text'
                onChange={props.updateStory}
                placeholder='Tell us a funny high story...' 
                value={props.story}
            />

            {props.shouldErrorMessageShow && <p className='error-message'>{errorMessage}</p>}

            {props.isValidStory && (
                <button 
                    className='story-box__submit'
                    onClick={props.validateStory}
                >
                    Submit
                </button>
            )}

            <ImageUploader updateStoryImage={props.updateStoryImage} />
        </div>
    );
};

export default StoryBox;
