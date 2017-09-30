import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Drawer from 'components/Drawer/Drawer';
import Header from 'containers/Header/Header';
import Footer from 'components/Footer/Footer';
import StoryBox from 'components/StoryBox/StoryBox';
import StoryList from 'components/StoryList/StoryList';
import { defaultDate } from 'global/js/helpers';
import 'global/js/material';
import 'global/scss/reset.scss';
import 'global/scss/material.scss';
import './App.scss';

export default class App extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            filteredStories: [],
            storyImageUrl: null,
            isFetched: false,
            isPosted: false,
            isValidStory: false,
            shouldErrorMessageShow: false,
            story: '',
            stories: []
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
                storyImageUrl: null,
                isPosted: true,
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
     * Constructs the story based on the current values and
     * posts our form data to the server.
     */
    postData = () => {
        const newStory = {
            date: Date.now(),
            storyImageUrl: this.state.storyImageUrl,
            points: 0,
            story: this.state.story
        };

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
        const validRegExp = new RegExp(/^[\w\-\,\.\(\)\/\!\$\?\'\"\s]+$/);
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
     * @param     { String url }
     */
    updateStoryImage = (url) => {
        this.setState({
            storyImageUrl: url
        });
    }

    /**
     * Makes sure that a valid story was entered.
     */
    validateStory = () => {
        if (this.state.isValidStory) this.postData();
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
                    <div className='wrapper'>
                        {!this.state.isFetched && <div className="mdl-spinner mdl-js-spinner is-active"></div>}

                        {this.state.isFetched && (
                            <div>
                                <StoryBox
                                    isValidStory={this.state.isValidStory}
                                    shouldErrorMessageShow={this.state.shouldErrorMessageShow}
                                    story={this.state.story}
                                    updateStory={this.updateStory}
                                    updateStoryImage={this.updateStoryImage}
                                    validateStory={this.validateStory}
                                />

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
