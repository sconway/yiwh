const express = require('express');
const webpack = require('webpack');
const path = require('path');
const helmet = require('helmet');
const requireFromString = require('require-from-string');
const MemoryFS = require('memory-fs');
const serverConfig = require('./config/server.production.js');
const sslRedirect = require('heroku-ssl-redirect');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const RateLimit = require('express-rate-limit');
const expressApp = express();
const fs = new MemoryFS();
const PORT = process.env.PORT || 1243;
let db, storyCount;

console.log('COMPILING BUNDLE...');
const serverCompiler = webpack(serverConfig);

/**
 * Used to output more detailed messages if the server confiler
 * fails.
 */
const outputErrors = (err, stats) => {
  if (err) {
    console.error(err.stack || err);

    if (err.details) console.error(err.details);

    return;
  }

  const info = stats.toJson();

  if (stats.hasErrors()) console.error(info.errors);
  if (stats.hasWarnings()) console.warn(info.warnings);
}

/**
 * Connects to the mondgo DB and listens for requests.
 */
const connectToDb = () => {
  // Use the connection string to connect to the Database and
  // setup the listener on the defined port.
  MongoClient.connect(process.env.connectionString, (err, database) => {
    if (err) {
      console.log('MONGO CONNECTION ERROR: ', err);
      return;
    }

    db = database;

    expressApp.listen(PORT, () => {
      console.log('EXPRESS SERVER IS LISTENING ON PORT: ', PORT);
    });
  });
}

/**
 * POST handler for saving comments to the various stories.
 */
const handleCommentPosts= () => {
  expressApp.post('/comments', (req, res) => {
    const validRegExp = new RegExp(/^[\w\-\,\.\(\)\/\!\$\?\:\;\'\"\s]+$/);

    // If the comment is valid, update the comments
    // array of the story that it's for.
    if (validRegExp.test(req.body.comment)) {
      db.collection('stories').update(
        { _id: ObjectID(req.body.storyID) },
        { $push: { comments: req.body } }
      );

      res.redirect('/');
    }
  });
}

/**
 * POST handler to update the points for a given story.
 */
const handlePointUpdates = () => {
  expressApp.post('/updatePoints', (req, res) => {
    // Finds the item in the collection that has the supplied
    // ID and updates its points value with the supplied value.
    db.collection('stories').update(
      { _id: ObjectID(req.body.storyID) },
      { $set: 
        { 
          'points': req.body.points
        }
      }
    );

    res.redirect('/');
  });
}

/**
 * GET handler for stories requests.
 */
const handleStoryRequests = () => {
  // Handles requests to the stories collection with the 
  // supplied start and end index. Skips to the start 
  // index and stops at the end index. 
  expressApp.get('/stories/:domain/:startIndex/:endIndex', (req, res) => {
    console.log('DOMAIN PARAMETER: ', req.params.domain);
    const startIndex = parseInt(req.params.startIndex);
    const endIndex = parseInt(req.params.endIndex);
    const domain = req.params.domain.length > 1 ? {mindState: req.params.domain} : {};

    console.log('DOMAIN: ', domain);
    console.log('START INDEX: ', startIndex);
    console.log('END INDEX: ', endIndex);

    db.collection('stories').find(domain).count().then((count) => {
      storyCount = count;
    });

    // Finds all the stories in the collection, sorts them into
    // an array and sends them back to the client.
    db.collection('stories')
      .find(domain)
      .sort({ 'points': -1 })
      .skip(startIndex)
      .limit(endIndex - startIndex)
      .toArray((err, results) => {
        console.log('RESULTS: ', results);
        res.send({stories: results, count: storyCount});
      });
  });
}

/**
 * POST handler to save stories to the mongo collection.
 */
const handleStoryUpdates = () => {
  expressApp.post('/stories', (req, res) => {
    const validRegExp = new RegExp(/^[\w\-\,\.\(\)\/\!\$\?\:\;\'\"\s]+$/);

    // If the story is valid, update the stories
    // collection with the new story.
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
}

/**
 * Sets the options for the express server, and loads the
 * rendered app into memory.
 */
const initServerOptions = () => {
  const contents = fs.readFileSync(path.resolve(serverConfig.output.path, serverConfig.output.filename), 'utf8');
  const appInMemory = requireFromString(contents, serverConfig.output.filename);
  const limiter = new RateLimit({
    windowMs: 15*60*1000, // 15 minutes 
    max: 100, // limit each IP to 100 requests per windowMs 
    delayMs: 0 // disable delaying - full speed until the max limit is reached 
  });

  expressApp.enable('trust proxy');
  expressApp.use(express.static(path.join(__dirname)));
  expressApp.use(bodyParser.json());
  expressApp.use(bodyParser.urlencoded({extended: true}));
  expressApp.use(sslRedirect());
  expressApp.use(limiter);
  expressApp.use(helmet());

  // Handles default connections.
  expressApp.get('/', appInMemory.default);
}

/**
 * Runs the webpack code that was compiled and loaded
 * into memory, then calls our server functions.
 */
serverCompiler.outputFileSystem = fs;
serverCompiler.run((err, stats) => {
  outputErrors(err, stats);
  initServerOptions();
  connectToDb();
  handleCommentPosts();
  handlePointUpdates();
  handleStoryRequests();
  handleStoryUpdates();
});
