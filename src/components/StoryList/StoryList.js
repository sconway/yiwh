import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Story from 'containers/Story/Story';
import './StoryList.scss';

const StoryList = (props) => {
    /**
     * Constructs the list of stories
     */
    const buildStoryList = () => {
        return props.stories.map((story, index) => {
            return (
                <Story
                    comments={story.comments}
                    date={story.date}
                    key={index}
                    mindState={story.mindState}
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
