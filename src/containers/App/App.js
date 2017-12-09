import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import request from 'superagent';
import Drawer from 'components/Drawer/Drawer';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import Message from 'components/Message/Message';
import ScrollButton from 'components/ScrollButton/ScrollButton';
import Spinner from 'components/Spinner/Spinner';
import StoryBox from 'components/StoryBox/StoryBox';
import StoryList from 'components/StoryList/StoryList';
import { defaultDate, throttle } from 'global/js/helpers';
import { RESULT_INCREMENTER, UPLOAD_PRESET, UPLOAD_URL } from 'global/js/config.js';
import 'global/scss/reset.scss';
import './App.scss';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.storyCount = 0;
        this.domain = 'a';
        
        this.state = {
            filteredStories: [],
            isFetching: false,
            isFetched: false,
            isPosted: false,
            isPosting: false,
            isValidStory: false,
            mindState: 'neither',
            shouldScrollButtonBeVisible: false,
            shouldErrorMessageShow: false,
            shouldStoryboxShow: false,
            story: '',
            storyIndexLower: 0,
            storyIndexUpper: RESULT_INCREMENTER,
            stories: [],
            storyImage: null
        };
    }

    componentDidMount() {
        const scrollContainer = document.querySelector('.mdl-layout__content');

        this.fetchStories();
        scrollContainer.addEventListener('scroll', this.handleScroll, false);
    }

    componentWillUnmount() {
        const scrollContainer = document.querySelector('.mdl-layout__content');

        // Remove the event listener when we leave this page/component.
        scrollContainer.removeEventListener('scroll', this.handleScroll, false);
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
                filteredStories: [newStory, ...prevState.filteredStories],
                isPosted: true,
                isPosting: false,
                isValidStory: false,
                mindState: 'neither',
                stories: [newStory, ...prevState.stories],
                story: ''
            };
        });
    }

    /**
     * Fetches the stories from our mongo collection.
     */
    fetchStories = () => {
        this.setState({ isFetching: true });

        // Creates the request for the new list of stories.
        fetch(`/stories/${this.domain}/${this.state.storyIndexLower}/${this.state.storyIndexUpper}`)
        .then((response) => {
            if (response.ok) {
                return response.json()
            }
        })
        .then((results) => {
            this.storyCount = results.count;
            
            this.setState((prevState) => {
                return {
                    filteredStories: prevState.filteredStories.concat(results.stories),
                    isFetched: true,
                    isFetching: false,
                    stories: prevState.stories.concat(results.stories),
                    storyIndexLower: prevState.storyIndexLower + RESULT_INCREMENTER,
                    storyIndexUpper: prevState.storyIndexUpper + RESULT_INCREMENTER
                };
            });
        })
        .catch((err) => {
            console.log('Error Fetching: ', err);
        });
    }

    /**
     * Filters the stories by date, in ascending or decending
     * order depending on the supplied arguments.
     * 
     * @param     {Integer} : order
     */
    filterStoriesByDate = (order) => {
        const newStories = this.state.filteredStories.sort((a,b) => {
            const dateA = a.date || defaultDate;
            const dateB = b.date || defaultDate;

            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return order > 0 ? dateB - dateA : dateA - dateB;
        });

        this.setState({ filteredStories: newStories });
    }

    /**
     * Filters the stories based on the supplied argument
     * (-1 acending, 1 decending).
     *
     * @param {Integer} : order
     */
    filterStoriesByRating = (order) => {
        const newStories = this.state.filteredStories.sort((a,b) => {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return order > 0 ?  b.points - a.points : a.points - b.points;
        });

        this.setState({ filteredStories: newStories });
    }

    /**
     * Called on component mount. Checks the origin and sets the 
     * class variable if it is one of the special origins.
     */
    getDomain = () => {
        // Make sure location is defined since we render server side
        const location = location || {origin: ''};      
        const origin = location.origin;

        if (origin.includes('drunk')) this.domain = 'drunk';
        if (origin.includes('high')) this.domain = 'high';
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
     * Called whenever there is a scroll event. Throttles the event and
     * checks to see if we are at the bottom of the page before loading
     * more stories.
     */
    handleScroll = throttle(() => {
        const scrollOffset = document.querySelector('.mdl-layout__content').scrollTop;
        const documentHeight = document.querySelector('.mdl-layout__content > .wrapper').offsetHeight;
        const scrollDistance = scrollOffset + window.innerHeight;

        if (scrollOffset > 100 && !this.state.shouldScrollButtonBeVisible) {
            this.setState({ shouldScrollButtonBeVisible: true });
        } 

        if (scrollOffset <= 100 && this.state.shouldScrollButtonBeVisible) {
            this.setState({ shouldScrollButtonBeVisible: false });
        }

        if (scrollDistance > documentHeight && !this.state.isFetching &&
            this.state.filteredStories.length < this.storyCount) {
            this.fetchStories();
        }
    }, 100);

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
     * @param     {Object} : newStory
     */
    postData = (newStory) => {
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
     * Called for stories that have an image uploaded with them. Uploads
     * the image to cloudinary before posting the story to the server.
     *
     * @param {Object} newStory
     */
    uploadAndPost = (newStory) => {
        let upload = request.post(UPLOAD_URL)
             .field('upload_preset', UPLOAD_PRESET)
             .field('file', this.state.storyImage);

        consle.log('upload: ', upload);

        upload.end((err, response) => {
            if (err) console.error(err);

            // If we got a good response, update new story with
            // the url for the image to be used later.
            if (response.body.secure_url !== '')
                newStory.storyImageUrl = response.body.secure_url;

            this.postData(newStory);
        });
    }

    /**
     * Makes sure that a valid story was entered before sending it off
     * to be posted. 
     */
    validateStory = () => {
        let newStory = {
            comments: [],
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
            this.state.storyImage ? this.uploadAndPost(newStory) : this.postData(newStory);
        }
    }

    render() {
        this.getDomain();

        return (
            <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
                <Header
                    domain={this.domain} 
                    filterByDate={this.filterStoriesByDate}
                    filterByRating={this.filterStoriesByRating}
                    updateSearchTerm={this.updateSearchTerm} 
                />
                
                <Drawer
                    domain={this.domain}
                    filterByDate={this.filterStoriesByDate}
                    filterByRating={this.filterStoriesByRating}
                />

                <main className="mdl-layout__content">
                    {this.state.isPosted && <Message />}

                    <div className='wrapper'>
                        {!this.state.isFetched && <Spinner />}

                        {this.state.isFetched && (
                            <div>
                                {!this.state.isPosted && (
                                    <StoryBox
                                        domain={this.domain}
                                        handleRadioButtonSelection={this.handleRadioButtonSelection}
                                        handleStoryBoxToggle={this.handleStoryBoxToggle}
                                        isPosting={this.state.isPosting}
                                        isPosted={this.state.isPosted}
                                        isValidStory={this.state.isValidStory}
                                        mindState={this.state.mindState}
                                        shouldErrorMessageShow={this.state.shouldErrorMessageShow}
                                        shouldStoryBoxShow={this.state.shouldStoryboxShow}
                                        storyImage={this.state.storyImage}
                                        updateStory={this.updateStory}
                                        updateStoryImage={this.updateStoryImage}
                                        validateStory={this.validateStory}
                                    />
                                )}

                                <StoryList stories={this.state.filteredStories} />

                                {this.state.isFetching && <Spinner />}

                                <ScrollButton shouldBeVisible={this.state.shouldScrollButtonBeVisible} />
                            </div>
                        )}
                    </div>

                    <Footer domain={this.domain} />
                </main>
            </div>
        );
    }
}
