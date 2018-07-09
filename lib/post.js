const Twitter = require('twitter');
const messages = require('../messages/messages.json');
const emojis = require('../messages/emojis.json');
const greetings = require('../messages/greetings.json');
const random = require('./randomItem');

module.exports = function post(process/*, exit*/) {

    const client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_KEY_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });

    const hammerAndSickles = ['☭', '☭☭', '☭☭☭', '☭☭☭☭', '☭☭☭☭☭'];

    const params = {status: `${random(emojis)} ${random(greetings)} ${random(messages)} ${random(hammerAndSickles)}`};

    console.log('posting to twitter: ', params.status);

    client.post('statuses/update', params, function(error /*, tweet, response*/) {
        if (!error) {
            console.log('Successfully posted:', params.status);
        }
        else {
            console.error('Error', error);
        }
    });
};