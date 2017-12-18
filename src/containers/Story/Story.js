import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import CommentBox from 'components/CommentBox/CommentBox';
import CommentList from 'components/CommentList/CommentList';
import StoryHeader from 'components/StoryHeader/StoryHeader';
import StoryFooter from 'components/StoryFooter/StoryFooter';
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
     * Computes the time that has elapsed since the provided date.
     */
    computeTimeSince = () => {
        const date = this.props.date ? new Date(this.props.date) : defaultDate;
        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
            return interval + ' years';
        }

        interval = Math.floor(seconds / 2592000);

        if (interval > 1) {
            return interval + ' months';
        }

        interval = Math.floor(seconds / 86400);

        if (interval > 1) {
            return interval + ' days';
        }

        interval = Math.floor(seconds / 3600);

        if (interval > 1) {
            return interval + ' hours';
        }

        interval = Math.floor(seconds / 60);

        if (interval > 1) {
            return interval + ' minutes';
        }

        return Math.floor(seconds) + ' seconds';
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
        const formattedDate = this.computeTimeSince() + ' ago';

        return (
            <li className='story-wrapper'>
                <div className='story'>
                    <section className='story__body'>
                        <StoryHeader 
                            formattedDate={formattedDate} 
                            mindState={this.props.mindState} 
                        />

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

                        <StoryFooter 
                            numComments={this.state.comments.length} 
                            points={this.props.points} 
                            storyID={this.props.storyID} 
                            toggleComments={this.toggleComments}
                        />
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
