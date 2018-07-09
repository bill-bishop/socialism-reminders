const Twitter = require('twitter');
const messages = require('../messages/messages.json');
const emojis = require('../messages/emojis.json');
const greetings = require('../messages/greetings.json');
const suffixes = require('../messages/suffixes.json');
const random = require('./randomItem');

module.exports = async function post(process/*, exit*/) {
    console.log('posting to twitter');

    const client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_KEY_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });

    const tweet = `${random(emojis)} ${random(greetings)} ${random(messages)} ${random(suffixes)}`;

    // Split tweet by 260 char increments
    const tweets = tweet.match(/.{1,260}/g);

    // Map tweets to a list of Promises which posts it (split if necessary)
    const postPromises = tweets.map((tweet, i) => {
        let prefix = tweets.length > 1 ? `(${i+1}/${tweets.length}) ` : '';
        const params = {status: `${prefix} ${tweet}`};

        return new Promise((resolve, reject) => {
            client.post('statuses/update', params, function(error /*, tweet, response*/) {
                if (error) {
                    return reject(error);
                }
                else {
                    return resolve(params.status);
                }
            });
        });
    });

    for (let postProm of postPromises) {
        try {
            const postResult = await postProm;
            console.log('Posted:', postResult);
        }
        catch (e) {
            console.error('Error', e);
        }
    }
};