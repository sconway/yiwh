import React, { Component } from 'react';
import classNames from 'classnames';
import DebounceInput from 'react-debounce-input';
import './CommentBox.scss';

const CommentBox = (props) => {
     const errorMessage = "Stories must be at least 3 characters, without any special characters (%, <, *, &, etc.)";
     const commentBoxClasses = classNames('comment-box', {
          'error': props.shouldErrorMessageShow,
          'visible': props.shouldCommentsShow
     });

     return (
          <article className={commentBoxClasses}>
               <DebounceInput
                    className='comment-box__comment'
                    debounceTimeout={500}
                    defaultValue={props.comment}
                    element='textarea'
                    name='comment-box' 
                    type='text'
                    onChange={props.updateComment}
                    placeholder="Leave a comment, but don't be a troll" 
                    value={props.comment}
               />

               {props.shouldErrorMessageShow && <p className='error-message'>{errorMessage}</p>}

               <button 
                    className='comment-box__add-comment mdl-button mdl-button--fab mdl-button--colored  mdl-button--primary mdl-js-button mdl-js-ripple-effect'
                    onClick={props.validateComment}
               >
                    +
               </button>
          </article>
     );
};

export default CommentBox;
