import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { defaultDate } from 'global/js/helpers';
import './Comment.scss';

const Comment = (props) => {
    const date = props.date ? new Date(props.date) : defaultDate;
    const formattedDate = date.toDateString();
    const commentClasses = classNames('comment mdl-shadow--4dp', {
        'visible': props.shouldCommentsShow
    });

    return (
        <li className={commentClasses} key={props.index}>
            <span className='comment__date'>{formattedDate}</span>
            <p className='comment__text'>{props.comment}</p>
        </li>
    );
}

export default Comment;
