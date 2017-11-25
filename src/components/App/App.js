import React, { Component } from 'react';
import './App.scss';
export default class App extends Component {
    render() {
        return (
            <div className="app">
                <h1 className="app-heading">Hello World</h1>
           </div>
        );
    }
}

// import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
// // import request from 'superagent';
// import root from 'window-or-global';
// import Drawer from 'components/Drawer/Drawer';
// import Header from 'containers/Header/Header';
// import Footer from 'components/Footer/Footer';
// import Message from 'components/Message/Message';
// import ScrollButton from 'components/ScrollButton/ScrollButton';
// import Spinner from 'components/Spinner/Spinner';
// import StoryBox from 'components/StoryBox/StoryBox';
// import StoryList from 'components/StoryList/StoryList';
// import { defaultDate, throttle } from 'global/js/helpers';
// import { url, resultIncrementer, uploadPreset, uploadURL } from 'global/js/config.js';
// // import 'global/js/material';
// import 'global/scss/reset.scss';
// // import 'global/scss/material.scss';
// import './App.scss';


// export default class App extends Component {
//     constructor(props) {
//         super(props);

//         this.storyCount = 0;
        
//         this.state = {
//             filteredStories: [],
//             isFetching: false,
//             isFetched: false,
//             isPosted: false,
//             isPosting: false,
//             isValidStory: false,
//             mindState: 'neither',
//             shouldScrollButtonBeVisible: false,
//             shouldErrorMessageShow: false,
//             shouldStoryboxShow: false,
//             story: '',
//             storyIndexLower: 0,
//             storyIndexUpper: resultIncrementer,
//             stories: [],
//             storyImage: null
//         };
//     }

//     componentDidMount() {
//         const scrollContainer = document.querySelector('.mdl-layout__content');

//         this.fetchStories();
//         scrollContainer.addEventListener('scroll', this.handleScroll, false);
//     }

//     componentWillUnmount() {
//         const scrollContainer = document.querySelector('.mdl-layout__content');

//         // Remove the event listener when we leave this page/component.
//         scrollContainer.removeEventListener('scroll', this.handleScroll, false);
//     }

//     /**
//      * Called when the submit button is pressed. Updates the
//      * list of stories in our state.
//      *
//      * @param {Object} newStory
//      */
//     addStory = (newStory) => {
//         this.setState((prevState) => {
//             return {
//                 filteredStories: [newStory, ...prevState.filteredStories],
//                 isPosted: true,
//                 isPosting: false,
//                 isValidStory: false,
//                 mindState: 'neither',
//                 stories: [newStory, ...prevState.stories],
//                 story: ''
//             };
//         });
//     }

//     /**
//      * Fetches the stories from our mongo collection.
//      */
//     fetchStories = () => {
//         this.setState({ isFetching: true });

//         // Creates the request for the new list of stories.
//         fetch(`/stories/${this.state.storyIndexLower}/${this.state.storyIndexUpper}`)
//         .then((response) => {
//             if (response.ok) {
//                 return response.json()
//             }
//         })
//         .then((results) => {
//             this.storyCount = results.count;
            
//             this.setState((prevState) => {
//                 return {
//                     filteredStories: prevState.filteredStories.concat(results.stories),
//                     isFetched: true,
//                     isFetching: false,
//                     stories: prevState.stories.concat(results.stories),
//                     storyIndexLower: prevState.storyIndexLower + resultIncrementer,
//                     storyIndexUpper: prevState.storyIndexUpper + resultIncrementer
//                 };
//             });
//         })
//         .catch((err) => {
//             console.log('Error Fetching: ', err);
//         });
//     }

//     /**
//      * Called when a radio button option for the mental state
//      * radio buttons is selected. Sets the state with the value. 
//      * 
//      * @param     {String : value}
//      */
//     handleRadioButtonSelection = (value) => {
//         console.log('value: ', value);
//         this.setState({ mindState: value });
//     }

//     /**
//      * Called whenever there is a scroll event. Throttles the event and
//      * checks to see if we are at the bottom of the page before loading
//      * more stories.
//      */
//     handleScroll = throttle(() => {
//         const scrollOffset = document.querySelector('.mdl-layout__content').scrollTop;
//         const documentHeight = document.querySelector('.mdl-layout__content > .wrapper').offsetHeight;
//         const scrollDistance = scrollOffset + root.innerHeight;

//         if (scrollOffset > 100 && !this.state.shouldScrollButtonBeVisible) {
//             this.setState({ shouldScrollButtonBeVisible: true });
//         } 

//         if (scrollOffset <= 100 && this.state.shouldScrollButtonBeVisible) {
//             this.setState({ shouldScrollButtonBeVisible: false });
//         }

//         if (scrollDistance > documentHeight && !this.state.isFetching &&
//             this.state.filteredStories.length < this.storyCount) {
//             this.fetchStories();
//         }
//     }, 100);

//     /**
//      * Called when the toggle text above the story box is clicked.
//      * Sets the state to show or hide the story box.
//      */
//     handleStoryBoxToggle = () => {
//         this.setState((prevState) => {
//             return {
//                 shouldStoryboxShow: !prevState.shouldStoryboxShow
//             };
//         });
//     }    

//     /**
//      * Constructs the story based on the current values and
//      * posts our form data to the server.
//      *
//      * @param     {Object : newStory}
//      */
//     postData = (newStory) => {
//         fetch('/stories', {
//             method: 'POST',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(newStory)
//         })
//         .then((response) => {
//             if (response.ok) this.addStory(newStory);
//         })
//         .catch((err) => {
//             console.log('Error Posting: ', err);
//         });
//     }

//     /**
//      * Displays the stories, showing the newest ones first.
//      */
//     showNewestStories = () => {
//         const newestStories = this.state.filteredStories.sort((a,b) => {
//             const dateA = a.date || defaultDate;
//             const dateB = b.date || defaultDate;

//             // Turn your strings into dates, and then subtract them
//             // to get a value that is either negative, positive, or zero.
//             return dateB - dateA;
//         });

//         this.setState({ filteredStories: newestStories });
//     }

//     /**
//      * Displays the stories, showing the oldest ones first.
//      */
//     showOldestStories = () => {
//         const oldestStories = this.state.filteredStories.sort((a,b) => {
//             const dateA = a.date || defaultDate;
//             const dateB = b.date || defaultDate;

//             // Turn your strings into dates, and then subtract them
//             // to get a value that is either negative, positive, or zero.
//             return dateA - dateB;
//         });

//         this.setState({ filteredStories: oldestStories });
//     }

//     /**
//      * Displays the stories, showing the lowest rated ones first.
//      */
//     showLowestRatedStories = () => {
//         const lowestRatedStories = this.state.filteredStories.sort((a,b) => {
//             // Turn your strings into dates, and then subtract them
//             // to get a value that is either negative, positive, or zero.
//             return a.points - b.points;
//         });

//         this.setState({ filteredStories: lowestRatedStories });
//     }

//     /**
//      * Displays the stories, showing the top rated ones first.
//      */
//     showTopRatedStories = () => {
//         const topRatedStories = this.state.filteredStories.sort((a,b) => {
//             // Turn your strings into dates, and then subtract them
//             // to get a value that is either negative, positive, or zero.
//             return b.points - a.points;
//         });

//         this.setState({ filteredStories: topRatedStories });
//     }

//     /**
//      * Called when the search term in the search box is updated.
//      * updates the shown stories to match the entered term
//      */
//     updateSearchTerm = (e) => {
//         const updatedStories = this.state.stories.filter((story) => {
//             return story.story.toLowerCase().includes(e.target.value.toLowerCase());
//         }); 

//         this.setState({ filteredStories: updatedStories });
//     }

//     /**
//      * Called whenever the story field is updated.
//      */
//     updateStory = (e) => {
//         const story = e.target.value;
//         const length = story.length;
//         const validRegExp = new RegExp(/^[\w\-\,\.\(\)\/\!\$\?\:\;\'\"\s]+$/);
//         const isValidCharacters = validRegExp.test(story);

//         this.setState({
//             isValidStory: length > 9 && isValidCharacters,
//             shouldErrorMessageShow: length > 0 && (length <= 9 || !isValidCharacters),
//             story: story
//         });
//     }

//     /**
//      * Called when an image is dropped into the uploader. Sets the state
//      * with the url dropped/uploaded image.
//      *
//      * @param     { Object } : file
//      */
//     updateStoryImage = (file) => {
//         this.setState({ storyImage: file });
//     }

//     /**
//      * Called for stories that have an image uploaded with them. Uploads
//      * the image to cloudinary before posting the story to the server.
//      *
//      * @param {Object} newStory
//      */
//     uploadAndPost = (newStory) => {
//         // let upload = request.post(uploadURL)
//         //      .field('upload_preset', uploadPreset)
//         //      .field('file', this.state.storyImage);

//         // upload.end((err, response) => {
//         //     if (err) console.error(err);

//         //     // If we got a good response, update new story with
//         //     // the url for the image to be used later.
//         //     if (response.body.secure_url !== '')
//         //         newStory.storyImageUrl = response.body.secure_url;

//         //     this.postData(newStory);
//         // });


//         // fetch('/stories', {
//         //     method: 'POST',
//         //     headers: {
//         //         'Accept': 'application/json',
//         //         'Content-Type': 'application/json'
//         //     },
//         //     body: JSON.stringify(newStory)
//         // })
//         // .then((response) => {
//         //     if (response.ok) this.addStory(newStory);
//         // })
//         // .catch((err) => {
//         //     console.log('Error Posting: ', err);
//         // });
//     }

//     /**
//      * Makes sure that a valid story was entered.
//      */
//     validateStory = () => {
//         let newStory = {
//             comments: [],
//             date: Date.now(),
//             mindState: this.state.mindState,
//             points: 0,
//             story: this.state.story,
//             storyImageUrl: null
//         };

//         // Don't bother if it's not a valid story.
//         if (this.state.isValidStory) {
//             // Set the state to display the loading spinner.
//             this.setState({ isPosting: true });
//             // If there is a story image upload it before posting the story
//             this.state.storyImage ? this.uploadAndPost(newStory) : this.postData(newStory);
//         }
//     }

//     render() {
//         return (
//             <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
//                 <Header 
//                     showNewest={this.showNewestStories}
//                     showLowestRated={this.showLowestRatedStories}
//                     showOldest={this.showOldestStories}
//                     showTopRated={this.showTopRatedStories}
//                     updateSearchTerm={this.updateSearchTerm} 
//                 />
                
//                 <Drawer 
//                     showNewest={this.showNewestStories}
//                     showLowestRated={this.showLowestRatedStories}
//                     showOldest={this.showOldestStories}
//                     showTopRated={this.showTopRatedStories}
//                 />

//                 <main className="mdl-layout__content">
//                     {this.state.isPosted && <Message />}

//                     <div className='wrapper'>
//                         {!this.state.isFetched && <div className="mdl-spinner mdl-js-spinner is-active"></div>}

//                         {this.state.isFetched && (
//                             <div>
//                                 {!this.state.isPosted && (
//                                     <StoryBox
//                                         handleRadioButtonSelection={this.handleRadioButtonSelection}
//                                         handleStoryBoxToggle={this.handleStoryBoxToggle}
//                                         isPosting={this.state.isPosting}
//                                         isPosted={this.state.isPosted}
//                                         isValidStory={this.state.isValidStory}
//                                         mindState={this.state.mindState}
//                                         shouldErrorMessageShow={this.state.shouldErrorMessageShow}
//                                         shouldStoryBoxShow={this.state.shouldStoryboxShow}
//                                         story={this.state.story}
//                                         storyImage={this.state.storyImage}
//                                         updateStory={this.updateStory}
//                                         updateStoryImage={this.updateStoryImage}
//                                         validateStory={this.validateStory}
//                                     />
//                                 )}

//                                 <StoryList stories={this.state.filteredStories} />

//                                 {this.state.isFetching && <Spinner />}

//                                 <ScrollButton shouldBeVisible={this.state.shouldScrollButtonBeVisible} />
//                             </div>
//                         )}
//                     </div>

//                     <Footer />
//                 </main>
//             </div>
//         );
//     }
// }
