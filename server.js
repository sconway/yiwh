const express = require('express');
const path = require('path');
const fileSync = require('fs');
const helmet = require('helmet');
const outputErrors = require('./utils/outputErrors');
const requireFromString = require('require-from-string');
const routeHandlers = require('./utils/routeHandlers');
const MemoryFS = require('memory-fs');
const serverConfig = require('./config/server.production.js');
const sslRedirect = require('heroku-ssl-redirect');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const RateLimit = require('express-rate-limit');
const expressApp = express();
const fs = new MemoryFS();
const PORT = process.env.PORT || 1243;
const twitterHandlers = require('./utils/twitterHandlers');
const webpack = require('webpack');
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
 * Runs the webpack code that was compiled and loaded
 * into memory, then calls our server functions.
 */
serverCompiler.outputFileSystem = fs;
serverCompiler.run((err, stats) => {
  outputErrors.outputErrors(err, stats);
  initServerOptions();
  twitterHandlers.initTwitterAPI();

  connectToDb()
    .then((database) => {
      routeHandlers.handleCommentPosts(expressApp, database);
      routeHandlers.handleStoryRequests(expressApp, database);
      routeHandlers.handleStoryUpdates(expressApp, database);
      twitterHandlers.handlePointUpdates(expressApp, database);
    })
    .catch((error) => {
      console.log('ERROR CONNECTING TO THE DATABASE: ', error);
    });
});
