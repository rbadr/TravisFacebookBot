var request = require('request');
var facebookGraphApiRemoteHost = exports.facebookGraphApiRemoteHost = 'https://graph.facebook.com/v2.8';

// The main generic function sending messages
exports.sendMessage = function(recipientId, message) {
    request({
        url: facebookGraphApiRemoteHost + '/me/messages',
        qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: recipientId },
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

// Get the user first name and last name using his id 
exports.getUserInfo = function(userId) {
    return new Promise((resolve, reject) => {
        request({
                method: 'GET',
                uri: facebookGraphApiRemoteHost + "/" + userId + "?fields=first_name,last_name&access_token=" + process.env.PAGE_ACCESS_TOKEN
            },
            function(error, response) {
                if (error) {
                    console.error('Error while userInfoRequest: ', error);
                    reject(error);
                } else {
                    console.log('userInfoRequest result: ', response.body);
                    resolve(response.body);
                }
            });
    });
};
