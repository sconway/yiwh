const request = require('superagent');


/**
 * Creates a POST request to send the specified tweet.
 *
 * @param {Object} : twitterClient 
 * @param {String} : tweet 
 * @param {String} : id 
 * @param {Function} : callBack 
 */
exports.postTweet = (twitterClient, tweet, id, callBack) => {
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
exports.postTweetWithImage = (tweet, id, mindState, imageURL, twitterClient) => {
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
          else postTweet(defaultTwitterClient, newTweet, id, setTweetPosted);
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
