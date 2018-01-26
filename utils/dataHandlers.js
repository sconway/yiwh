const ObjectID = require('mongodb').ObjectID;
let storyCount;

/**
 * Uses the supplied request parameters to query the database
 * for a set of user stories.
 *
 * @param {Object} : req
 * @param {Object} : res
 * @param {Object} : domain
 */
const getStories = (db, req, res, domain) => {
  const startIndex = parseInt(req.params.startIndex);
  const endIndex = parseInt(req.params.endIndex);

  // Finds the subset of stories specified by the start and end index,
  // sorts them into an array and sends them back to the client.
  db.collection('stories')
    .find(domain)
    .sort({ 'points': -1 })
    .skip(startIndex)
    .limit(endIndex - startIndex)
    .toArray((err, results) => {
      res.send({stories: results, count: storyCount});
    });
};

/**
 * Computes the number of stories in our database, of the given domain.
 *
 * @param {Object} : domain
 */
const setStoryCount = (db, domain) => {
  db.collection('stories')
    .find(domain)
    .count()
    .then((count) => {
      storyCount = count;
    });
};

/**
 * Finds the document in the collection that has the supplied
 * ID and updates its points value with the supplied value.
 *
 * @param {String} : id
 * @param {Integer} : points
 */
const setStoryPoints = (db, id, points) => {
  db.collection('stories')
    .update(
      { _id: ObjectID(id) },
      { $set: { 'points': points } }
    );
}

/**
 * Sets the 'hasBeenPosted' field for the specified story to true.
 * 
 * @param {String} : id
 */
const setTweetPosted = (db, id) => {
  db.collection('stories')
    .update(
      { _id: ObjectID(id) },
      { $set: { 'hasBeenPosted': true } }
    );
}

module.exports = {
  getStories: getStories,
  setStoryCount: setStoryCount,
  setStoryPoints: setStoryPoints,
  setTweetPosted: setTweetPosted
};