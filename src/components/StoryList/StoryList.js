import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Story from 'components/Story/Story';
import './StoryList.scss';

const StoryList = (props) => {
    /**
     * Constructs the list of stories
     */
    const buildStoryList = () => {
        return props.stories.map((story, index) => {
            return (
                <Story 
                    date={story.date}
                    key={story._id}
                    points={story.points}
                    story={story.story} 
                    storyID={story._id}
                    storyImageUrl={story.storyImageUrl}
                />
            );
        });
    }

    return (
        <div className='story-list'>
            {buildStoryList()}
        </div>
    );
}

export default StoryList;
