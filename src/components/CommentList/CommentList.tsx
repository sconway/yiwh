import React, { Component } from 'react';
import Comment from '../../components/Comment/Comment';
import './CommentList.scss';

interface Comment {
    comment: string;
    date: string;
};

interface Props {
    comments: Comment[];
    shouldCommentsShow: boolean;
};

const CommentList = (props: Props) => {
    /**
     * Constructs the list of comments
     */
    const buildCommentList = () => {
        return props.comments.map((comment, index) => {
            return (
                <Comment 
                    comment={comment.comment} 
                    date={comment.date} 
                    key={index}
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
