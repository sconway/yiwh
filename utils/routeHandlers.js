const dataHandlers = require('./dataHandlers');

/**
 * GET handler for stories requests.
 */
const handleStoryRequests = (expressApp, db) => {
  // Handles requests to the stories collection with the 
  // supplied start and end index.
  expressApp.get('/stories/:domain/:startIndex/:endIndex', (req, res) => {
    const domain = req.params.domain.length > 1 ? {mindState: req.params.domain} : {};

    // Compute the story count so the front end knows what to expect
    dataHandlers.setStoryCount(db, domain);
    // Fetch the stories and send them to the front-end
    dataHandlers.getStories(db, req, res, domain);
  });
}

/**
 * POST handler to save stories to the mongo collection.
 */
const handleStoryUpdates = (expressApp, db) => {
  expressApp.post('/stories', (req, res) => {
    const validRegExp = new RegExp(/^[\w\-\,\.\(\)\/\!\$\?\:\;\'\"\s]+$/);

    // If the story is valid, update the stories
    // collection with the new story.
    if (validRegExp.test(req.body.story)) {
      db.collection('stories').insert(req.body, (err, result) => {
        if (err) {
          console.log('ERROR INSERTING STORY: ', err);
          return;
        }

        res.redirect('/');
      });
    }
  });
}

/**
 * POST handler for saving comments to the various stories.
 */
const handleCommentPosts = (expressApp, db) => {
  expressApp.post('/comments', (req, res) => {
    const validRegExp = new RegExp(/^[\w\-\,\.\(\)\/\!\$\?\:\;\'\"\s]+$/);

    // If the comment is valid, update the comments
    // array of the story that it's for.
    if (validRegExp.test(req.body.comment)) {
      db.collection('stories').update(
        { _id: ObjectID(req.body.storyID) },
        { $push: { comments: req.body } }
      );
    }

    res.redirect('/');
  });
}


module.exports = {
  handleCommentPosts: handleCommentPosts,
  handleStoryRequests: handleStoryRequests,
  handleStoryUpdates: handleStoryUpdates
};
