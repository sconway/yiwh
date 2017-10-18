import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Comment from 'components/Comment/Comment';
import './CommentList.scss';

const CommentList = (props) => {
    console.log('comments: ', props.comments);
    /**
     * Constructs the list of stories
     */
    const buildCommentList = () => {
        return props.comments.map((comment, index) => {
            return (
                <Comment 
                    comment={comment.comment} 
                    date={comment.date} 
                    index={index}
                    shouldCommentsShow={props.shouldCommentsShow}
                />
            );
        });
    }

    return (
        <ul className='comment-list'>
            {buildCommentList()}
        </ul>
    );
}

export default CommentList;
