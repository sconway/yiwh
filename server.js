const config = require('./config.js');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const helmet = require('helmet');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const path = require('path');
const ReactEngine = require('express-react-engine');
const PORT = process.env.PORT || 1243;
var db;


/**
 * Middleware to allow us to set a base directory and read
 * data being sent over in the req/res parameters.
 */
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(helmet());


/**
 * Connects to the mondgo DB and listens for requests.
 */
MongoClient.connect(config.connectionString, (err, database) => {
  if (err) {
    console.log('MONGO CONNECTION ERROR: ', err);
    return;
  }

  db = database;

  app.listen(PORT, () => {
    console.log('EXPRESS SERVER IS LISTENING');
  });
});

/**
 * GET handler for requests to the root.
 */
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

/**
 * GET handler for stories requests.
 */
app.get('/stories', (req, res) => {
  // Finds all the stories in the collection, sorts them into
  // an array and sends them back to the client.
  db.collection('stories')
    .find()
    .sort({ 'points': -1 })
    .toArray((err, results) => {
      res.send(results);
    });
});

/**
 * POST handler to save stories to the mongo collection.
 */
app.post('/stories', (req, res) => {
  const validRegExp = new RegExp(/^[\w\-\,\.\(\)\/\!\$\'\"\s]+$/);

  // Adds the new story to the collection if it meets the RegEx requirements.
  if (validRegExp.test(req.body.story)) {
    db.collection('stories').insert(req.body, (err, result) => {
      if (err) {
        console.log('ERROR POSTING: ', err);
        return;
      }

      res.redirect('/');
    });
  }
});

/**
 * POST handler to update the points for a given story.
 */
app.post('/updatePoints', (req, res) => {
  // Finds the item in the collection that has the supplied
  // ID and updates its points value with the supplied value.
  db.collection('stories').update(
    { _id: ObjectId(req.body.storyID) },
    { $set: 
      { 
        'points': req.body.points
      }
    }
  );

  res.redirect('/');
});



