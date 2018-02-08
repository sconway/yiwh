import React, { Component } from 'react';
// import root from 'window-or-global';
import classNames from 'classnames';
import DebounceInput from 'react-debounce-input';
import './CommentBox.scss';

export default class CommentBox extends Component {
     constructor(props) {
        super(props);

        this.state = {
            isOffline: false
        };
     }

     componentDidMount() {
        window.addEventListener('online', this.handleOnline, false);
     }

     componentWillUnmount() {
        // Remove the event listener when we leave this page/component.
        window.removeEventListener('online', this.handleOnline, false);
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
        if (!navigator.onLine) {
            this.setState({ isOffline: true });
        } else {
            this.props.validateComment();
        }
     }

     render() {
          const connectionErrorMessage = 'There doesn\'t appear to be an Internet connection :(';
          const errorMessage = "Stories must be at least 3 characters, without any special characters (%, <, *, &, etc.)";
          const commentBoxClasses = classNames('comment-box', {
               'error': this.props.shouldErrorMessageShow,
               'visible': this.props.shouldCommentsShow
          });

          return (
               <article className={commentBoxClasses}>
                    <DebounceInput
                         className='comment-box__comment'
                         debounceTimeout={500}
                         element='textarea'
                         name='comment-box' 
                         type='text'
                         onChange={this.props.updateComment}
                         placeholder="Leave a comment, but don't be a troll"
                    />

                    {this.props.shouldErrorMessageShow && <p className='error-message'>{errorMessage}</p>}

                    {this.state.isOffline && <p className='error-message'>{connectionErrorMessage}</p>}

                    <button 
                         className='comment-box__add-comment'
                         onClick={this.onSubmit}
                    >
                        post
                    </button>
               </article>
          );
     }
}
