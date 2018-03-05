import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Story from '../../containers/Story/Story';
import './StoryList.scss';

interface CommentType {
    comment: string;
    date: string;
};

interface StoryType {
    comments?: CommentType[];
    date: string;
    _id: string;
    mindState: string;
    points: number;
    story: string;
    storyImageUrl: string;
};

interface Props {
    stories: StoryType[];
};

const StoryList = (props:Props) => {
    /**
     * Constructs the list of stories
     */
    const buildStoryList = () => {
        return props.stories.map((story, index) => {
            return (
                <Story
                    comments={story.comments}
                    date={story.date}
                    key={story._id + index}
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
