import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import CommentBox from 'components/CommentBox/CommentBox';
import CommentList from 'components/CommentList/CommentList';
import Counter from 'components/Counter/Counter';
import { defaultDate } from 'global/js/helpers';
import './Story.scss';

export default class Story extends PureComponent {
    constructor(props) {
        super(props);
        
        this.state = {
            comment: '',
            comments: this.props.comments || [],
            didCommentPost: false,
            isValidComment: false,
            shouldCommentsShow: false,
            shouldErrorMessageShow: false
        };
    }

    /**
     * Called when the submit button is pressed. Updates the
     * list of comments in our state.
     *
     * @param {Object} newComment
     */
    addComment = (newComment) => {
        this.setState((prevState) => {
            return {
                isValidComment: false,
                comments: [...prevState.comments, newComment],
                comment: '',
                didCommentPost: true
            };
        });
    }

    /**
     * Constructs the comment based on the current values and
     * posts it to the server.
     *
     * @param     {Object : newComment}
     */
    postComment = (newComment) => {
        fetch('/comments', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newComment)
        })
        .then((response) => {
            if (response.ok) this.addComment(newComment);
        })
        .catch((err) => {
            console.log('Error Posting: ', err);
        });
    }

    /**
     * Toggles the visibility of the comments.
     */
    toggleComments = () => {
        this.setState((prevState) => {
            return {
                shouldCommentsShow: !prevState.shouldCommentsShow
            };
        });
    }

    /**
     * Called when text is entered in the comment box. Checks the text to
     * see if it's valid and updates the state with it.
     */
    updateComment = (e) => {
        const comment = e.target.value;
        const length = comment.length;
        const validRegExp = new RegExp(/^[\w\-\,\.\(\)\/\!\$\?\:\;\'\"\s]+$/);
        const isValidCharacters = validRegExp.test(comment);

        this.setState({
            isValidComment: length > 2 && isValidCharacters,
            shouldErrorMessageShow: length > 0 && (length <= 2 || !isValidCharacters),
            comment: comment
        });
    }

    /**
     * Makes sure that a valid comment was entered.
     */
    validateComment = () => {
        const newComment = {
            date: Date.now(),
            comment: this.state.comment,
            storyID: this.props.storyID
        };

        if (this.state.isValidComment) this.postComment(newComment);
    }

    render() {    
        const date = this.props.date ? new Date(this.props.date) : defaultDate;
        const formattedDate = date.toDateString();

        return (
            <li className='story-wrapper'>
                <div className='story mdl-shadow--4dp'>
                    <section className='story__body'>
                        <span className='story__date'>{formattedDate}</span>

                        <p className='story__text'>{this.props.story}</p>

                        {this.props.storyImageUrl && (
                            <img 
                                alt='visual depiction of the story' 
                                className='story__image' 
                                src={this.props.storyImageUrl} 
                            />
                        )}

                        {this.props.mindState && this.props.mindState.toLowerCase() !== 'neither' && (
                            <span className='story__signature'>
                                &mdash; Yes, I was {this.props.mindState}
                            </span>
                        )}
                    </section>

                    <section className='story__footer'>
                        <Counter points={this.props.points} storyID={this.props.storyID} />

                        <a className='story__comment-toggle' onClick={this.toggleComments}>
                            {this.state.shouldCommentsShow ? 'Hide ' : 'Show '} 
                            Comments 
                            ({this.state.comments.length})
                        </a>
                    </section>
                </div>

                {this.state.comments.length > 0 && (
                    <CommentList 
                        comments={this.state.comments} 
                        shouldCommentsShow={this.state.shouldCommentsShow}
                    />
                )}
    
                {!this.state.didCommentPost && (
                    <CommentBox 
                        comment={this.state.comment} 
                        shouldCommentsShow={this.state.shouldCommentsShow}
                        shouldErrorMessageShow={this.state.shouldErrorMessageShow}
                        validateComment={this.validateComment}
                        updateComment={this.updateComment} 
                    />
                )}
            </li>
        );
    }
}
