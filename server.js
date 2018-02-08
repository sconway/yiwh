const dataHandlers = require('./utils/dataHandlers');
const express = require('express');
const webpack = require('webpack');
const path = require('path');
const fileSync = require('fs');
const helmet = require('helmet');
const outputErrors = require('./utils/outputErrors');
const request = require('superagent');
const requireFromString = require('require-from-string');
const routeHandlers = require('./utils/routeHandlers');
const MemoryFS = require('memory-fs');
const serverConfig = require('./config/server.production.js');
const sslRedirect = require('heroku-ssl-redirect');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const RateLimit = require('express-rate-limit');
const Twitter = require('twitter');
const expressApp = express();
const fs = new MemoryFS();
const PORT = process.env.PORT || 1243;
const TWEET_POINT_THRESHOLD = 10;
let db, storyCount, defaultTwitterClient, drunkTwitterClient, highTwitterClient;

console.log('COMPILING BUNDLE...');
const serverCompiler = webpack(serverConfig);

/**
 * Connects to the mondgo DB and listens for requests.
 */
const connectToDb = () => {
  // Use the connection string to connect to the Database and
  // setup the listener on the defined port.
  return new Promise((resolve, reject) => {
    MongoClient.connect(process.env.CONNECTION_STRING, (error, database) => {
      if (error) reject(error);

      expressApp.listen(PORT, () => {
        console.log('EXPRESS SERVER IS LISTENING ON PORT: ', PORT);
        resolve(database);
      });
    });
  });
}

/**
 * Returns the proper twitter client for the given mindstate.
 *
 * @param {String} : mindState
 */
const getTwitterClient = (mindState) => {
  console.log('GETTING TWITTER CLIENT. MINDSTATE IS: ', mindState);
  if (mindState === 'drunk') return drunkTwitterClient;
  else if (mindState === 'high') return highTwitterClient;
  else return null;
}

/**
 * POST handler to update the points for a given story.
 */
const handlePointUpdates = () => {
  expressApp.post('/updatePoints', (req, res) => {
    const {points, story, storyID} = req.body;

    // Update the document with the new amount of points. 
    dataHandlers.setStoryPoints(db, storyID, points);

    // Find the story based on the ID and see whether of not we should post it.
    db.collection('stories')
      .find(ObjectID(storyID))
      .forEach((story) => {
        // Post the tweet if it has enough points and hasn't been posted already.
        if (!story.hasBeenPosted && points > TWEET_POINT_THRESHOLD) 
          updateTweetBeforePosting(story.story, storyID, story.mindState, 
            story.storyImageUrl, getTwitterClient(story.mindState));
      });

    res.redirect('/');
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
  expressApp.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  expressApp.use(bodyParser.json());
  expressApp.use(bodyParser.urlencoded({extended: true}));
  expressApp.use(sslRedirect());
  expressApp.use(limiter);
  expressApp.use(helmet());

  // Handles default connections.
  expressApp.get('/', appInMemory.default);
}

/**
 * Initialize our twitter object so we can update the twitter 
 * account with popular tweets.
 */
const initTwitterAPI = () => {
  defaultTwitterClient = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
  });

  drunkTwitterClient = new Twitter({
    consumer_key: process.env.DRUNK_CONSUMER_KEY,
    consumer_secret: process.env.DRUNK_CONSUMER_SECRET,
    access_token_key: process.env.DRUNK_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.DRUNK_ACCESS_TOKEN_SECRET
  });

  highTwitterClient = new Twitter({
    consumer_key: process.env.HIGH_CONSUMER_KEY,
    consumer_secret: process.env.HIGH_CONSUMER_SECRET,
    access_token_key: process.env.HIGH_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.HIGH_ACCESS_TOKEN_SECRET
  });
}

/**
 * Creates a POST request to send the specified tweet.
 *
 * @param {Object} : twitterClient 
 * @param {String} : tweet 
 * @param {String} : id 
 * @param {Function} : callBack 
 */
const postTweet = (twitterClient, tweet, id, callBack) => {
  // Make the post request, and handle the returned promise.
  twitterClient.post('statuses/update', tweet)
    .then(() => {
      console.log('SUCCESSFUL POST');
      if (callBack) callBack(id);
    })
    .catch((error) => {
      console.log('ERROR POSTING TWEET: ', error)
    });
}

/**
 * Called for tweets that contain media. Posts the tweet along with the image.
 *
 * @param {String} : tweet
 * @param {String} : id
 * @param {String} : mindState
 * @param {String} : imageURL
 * @param {Object} : twitterClient
 */
const postTweetWithImage = (tweet, id, mindState, imageURL, twitterClient) => {
  let mediaData, mediaSize, mediaType;

  // Gets the image from the third party hosting site,
  // and kicks of the process of uploading and posting it.
  request
    .get(imageURL)
    .end((error, response) => {
      mediaData = response.body;
      mediaSize = response.headers['content-length'];
      mediaType = response.headers['content-type'];

      initUpload() // Declare that you wish to upload some media
        .then(appendUpload) // Send the data for the media
        .then(finalizeUpload) // Declare that you are done uploading chunks
        .then(mediaId => {
          const newTweet = {
            status: tweet,
            media_ids: mediaId
          };

          // If there is a specified Twitter client, post using that.
          if (twitterClient) postTweet(twitterClient, newTweet);
          // Otherwise, post to the default cliend and mark the tweet as posted.
          else postTweet(defaultTwitterClient, newTweet, id, dataHandlers.setTweetPosted(db, id));
        });
    });

  /**
   * Step 1 of 3: Initialize a media upload.
   */
  const initUpload = () => {
    return makePost('media/upload', {
      command    : 'INIT',
      total_bytes: mediaSize,
      media_type : mediaType,
    }).then(data => data.media_id_string);
  }

  /*
   * Step 2 of 3: Append file chunk
   *
   * @param {String} mediaId
   */
  const appendUpload = (mediaId) => {
    return makePost('media/upload', {
      command      : 'APPEND',
      media_id     : mediaId,
      media        : mediaData,
      segment_index: 0
    }).then(data => mediaId);
  }

  /**
   * Step 3 of 3: Finalize upload
   *
   * @param {String} mediaId
   */
  const finalizeUpload = (mediaId) => {
    return makePost('media/upload', {
      command : 'FINALIZE',
      media_id: mediaId
    }).then(data => mediaId);
  }

  /**
   * (Utility function) Send a POST request to the Twitter API
   *
   * @param {String} endpoint
   * @param {Object} params 
   */
  const makePost = (endpoint, params) => {
    return new Promise((resolve, reject) => {
      const client = twitterClient || defaultTwitterClient;

      client.post(endpoint, params, (error, data, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }
}

/**
 * Creates a POST request to send the specified tweet. Decides
 * what account to post to based on the current domain.
 * 
 * @param {String} : tweet
 * @param {String} : id
 * @param {String} : mindState
 * @param {String} : imageURL
 * @param {Object} : twitterClient
 */
const updateTweetBeforePosting = (tweet, id, mindState, imageURL, twitterClient) => {
  if (mindState === 'drunk' || mindState === 'high') 
    tweet = tweet + ' #yesiwas' + mindState;

  if (imageURL) {
    // If there is a specified Twitter client, post using that.
    if (twitterClient) postTweetWithImage(tweet, id, mindState, imageURL, twitterClient);
    // Post with the default Twitter client, regardless.
    postTweetWithImage(tweet, id, mindState, imageURL);
  } else {    
    // If there is a specified Twitter client, post using that.
    if (twitterClient) postTweet(twitterClient, {status: tweet});
    // Post with the default Twitter client, regardless.
    postTweet(defaultTwitterClient, {status: tweet}, id, dataHandlers.setTweetPosted(db, id));
  }
}

/**
 * Runs the webpack code that was compiled and loaded
 * into memory, then calls our server functions.
 */
serverCompiler.outputFileSystem = fs;
serverCompiler.run((err, stats) => {
  outputErrors.outputErrors(err, stats);
  initServerOptions();
  initTwitterAPI();

  connectToDb()
    .then((database) => {
      db = database;

      routeHandlers.handleCommentPosts(expressApp, db);
      handlePointUpdates();
      routeHandlers.handleStoryRequests(expressApp, db);
      routeHandlers.handleStoryUpdates(expressApp, db);
    })
    .catch((error) => {
      console.log('ERROR CONNECTING TO THE DATABASE: ', error);
    });
});
