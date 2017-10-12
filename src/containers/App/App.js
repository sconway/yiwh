import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import request from 'superagent';
import Drawer from 'components/Drawer/Drawer';
import Header from 'containers/Header/Header';
import Footer from 'components/Footer/Footer';
import Message from 'components/Message/Message';
import StoryBox from 'components/StoryBox/StoryBox';
import StoryList from 'components/StoryList/StoryList';
import { defaultDate } from 'global/js/helpers';
import { url } from 'global/js/config.js';
import 'global/js/material';
import 'global/scss/reset.scss';
import 'global/scss/material.scss';
import './App.scss';

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/yesiwas/upload';
const UPLOAD_PRESET = 'yesiwas';

export default class App extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            filteredStories: [],
            isFetched: false,
            isPosted: false,
            isPosting: false,
            isValidStory: false,
            mindState: 'neither',
            shouldErrorMessageShow: false,
            shouldStoryboxShow: false,
            story: '',
            stories: [],
            storyImage: null
        };
    }

    componentDidMount() {
        this.fetchStories();
    }

    /**
     * Called when the submit button is pressed. Updates the
     * list of stories in our state.
     *
     * @param {Object} newStory
     */
    addStory = (newStory) => {
        this.setState((prevState) => {
            return {
                filteredStories: [...prevState.filteredStories, newStory],
                isPosted: true,
                isPosting: false,
                isValidStory: false,
                mindState: 'neither',
                stories: [...prevState.stories, newStory],
                story: ''
            };
        });
    }

    /**
     * Fetches the stories from our mongo collection.
     */
    fetchStories = () => {
        fetch('/stories')
        .then((response) => {
            if (response.ok) return response.json()
        })
        .then((results) => {
            this.setState({
                filteredStories: results,
                isFetched: true,
                stories: results
            });
        })
        .catch((err) => {
            console.log('Error Fetching: ', err);
        });
    }

    /**
     * Called when a radio button option for the mental state
     * radio buttons is selected. Sets the state with the value. 
     * 
     * @param     {String : value}
     */
    handleRadioButtonSelection = (value) => {
        this.setState({ mindState: value });
    }

    /**
     * Called when the toggle text above the story box is clicked.
     * Sets the state to show or hide the story box.
     */
    handleStoryBoxToggle = () => {
        this.setState((prevState) => {
            return {
                shouldStoryboxShow: !prevState.shouldStoryboxShow
            };
        });
    }    

    /**
     * Constructs the story based on the current values and
     * posts our form data to the server.
     *
     * @param     {Object : newStory}
     */
    postData = (newStory) => {
        console.log('posting: ', newStory);
        fetch('/stories', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newStory)
        })
        .then((response) => {
            if (response.ok) this.addStory(newStory);
        })
        .catch((err) => {
            console.log('Error Posting: ', err);
        });
    }

    /**
     * Displays the stories, showing the newest ones first.
     */
    showNewestStories = () => {
        const newestStories = this.state.filteredStories.sort((a,b) => {
            const dateA = a.date || defaultDate;
            const dateB = b.date || defaultDate;

            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return dateB - dateA;
        });

        this.setState({ filteredStories: newestStories });
    }

    /**
     * Displays the stories, showing the oldest ones first.
     */
    showOldestStories = () => {
        const oldestStories = this.state.filteredStories.sort((a,b) => {
            const dateA = a.date || defaultDate;
            const dateB = b.date || defaultDate;

            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return dateA - dateB;
        });
        console.log('oldest clicked: ', oldestStories);

        this.setState({ filteredStories: oldestStories });
    }

    /**
     * Displays the stories, showing the lowest rated ones first.
     */
    showLowestRatedStories = () => {
        const lowestRatedStories = this.state.filteredStories.sort((a,b) => {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return a.points - b.points;
        });

        this.setState({ filteredStories: lowestRatedStories });
    }

    /**
     * Displays the stories, showing the top rated ones first.
     */
    showTopRatedStories = () => {
        const topRatedStories = this.state.filteredStories.sort((a,b) => {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return b.points - a.points;
        });

        this.setState({ filteredStories: topRatedStories });
    }

    /**
     * Called when the search term in the search box is updated.
     * updates the shown stories to match the entered term
     */
    updateSearchTerm = (e) => {
        const updatedStories = this.state.stories.filter((story) => {
            return story.story.toLowerCase().includes(e.target.value.toLowerCase());
        }); 

        this.setState({ filteredStories: updatedStories });
    }

    /**
     * Called whenever the story field is updated.
     */
    updateStory = (e) => {
        const story = e.target.value;
        const length = story.length;
        const validRegExp = new RegExp(/^[\w\-\,\.\(\)\/\!\$\?\:\;\'\"\s]+$/);
        const isValidCharacters = validRegExp.test(story);

        this.setState({
            isValidStory: length > 9 && isValidCharacters,
            shouldErrorMessageShow: length > 0 && (length <= 9 || !isValidCharacters),
            story: story
        });
    }

    /**
     * Called when an image is dropped into the uploader. Sets the state
     * with the url dropped/uploaded image.
     *
     * @param     { Object } : file
     */
    updateStoryImage = (file) => {
        this.setState({ storyImage: file });
    }

    /**
     * Makes sure that a valid story was entered.
     */
    validateStory = () => {
        let newStory = {
            date: Date.now(),
            mindState: this.state.mindState,
            points: 0,
            story: this.state.story,
            storyImageUrl: null
        };

        // Don't bother if it's not a valid story.
        if (this.state.isValidStory) {
            // Set the state to display the loading spinner.
            this.setState({ isPosting: true });

            // If there is a story image upload it before posting the story
            if (this.state.storyImage) {
                let upload = request.post(CLOUDINARY_UPLOAD_URL)
                     .field('upload_preset', UPLOAD_PRESET)
                     .field('file', this.state.storyImage);

                upload.end((err, response) => {
                    if (err) console.error(err);

                    // If we got a good response, update new story with
                    // the url for the image to be used later.
                    if (response.body.secure_url !== '')
                        newStory.storyImageUrl = response.body.secure_url;

                    this.postData(newStory);
                });

            } else {
                this.postData(newStory);
            }
        }
    }

    render() {
        return (
            <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
                <Header 
                    showNewest={this.showNewestStories}
                    showLowestRated={this.showLowestRatedStories}
                    showOldest={this.showOldestStories}
                    showTopRated={this.showTopRatedStories}
                    updateSearchTerm={this.updateSearchTerm} 
                />
                
                <Drawer />

                <main className="mdl-layout__content">
                    {this.state.isPosted && <Message />}

                    <div className='wrapper'>
                        {!this.state.isFetched && <div className="mdl-spinner mdl-js-spinner is-active"></div>}

                        {this.state.isFetched && (
                            <div>
                                {!this.state.isPosted && (
                                    <StoryBox
                                        handleRadioButtonSelection={this.handleRadioButtonSelection}
                                        handleStoryBoxToggle={this.handleStoryBoxToggle}
                                        isPosting={this.state.isPosting}
                                        isPosted={this.state.isPosted}
                                        isValidStory={this.state.isValidStory}
                                        shouldErrorMessageShow={this.state.shouldErrorMessageShow}
                                        shouldStoryBoxShow={this.state.shouldStoryboxShow}
                                        story={this.state.story}
                                        storyImage={this.state.storyImage}
                                        updateStory={this.updateStory}
                                        updateStoryImage={this.updateStoryImage}
                                        validateStory={this.validateStory}
                                    />
                                )}

                                <StoryList stories={this.state.filteredStories} />
                            </div>
                        )}
                    </div>

                    <Footer />
                </main>
            </div>
        );
    }
}
