var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function(req, res) {
    res.send('This is the CI Notifier Server, a facebook messeger bot that let you interact with Travis CI.');
});

// Facebook Webhook
app.get('/webhook', function(req, res) {
    if (req.query['hub.verify_token'] === process.env.WEBHOOK_TOKEN) {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

// The main generic function sending messages
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.8/me/messages',
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
function userInfoRequest(userId) {
    return new Promise((resolve, reject) => {
        request({
                method: 'GET',
                uri: "https://graph.facebook.com/v2.8/" + userId + "?fields=first_name,last_name&access_token=" + process.env.PAGE_ACCESS_TOKEN
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



// handler receiving messages
app.post('/webhook', function(req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            var values = event.message.text.split(' ');
            if (values.indexOf("Hello") >= 0) {
                sendMessage(event.sender.id, { text: "Hello, How may I help you ?" });
            } else if (values.indexOf("build") >= 0 && values.indexOf("project") >= 0 && values.indexOf("informations") >= 0) {
                sendMessage(event.sender.id, { text: "Yes for sure, I'll just need your repo's name as followed repoOwner : repoName" });
            } else if (values.indexOf(":") >= 0) {
                sendMessage(event.sender.id, { text: "The last build status for this project is : Passed." });
            } else if (values.indexOf("build") >= 0 && values.indexOf("id") >= 0) {
                sendMessage(event.sender.id, { text: "The build id is : 22555277" });
            } else if (values.indexOf("build") >= 0 && values.indexOf("number") >= 0) {
                sendMessage(event.sender.id, { text: "The build number is : 784" });
            } else if (values.indexOf("who") >= 0 && values.indexOf("commited") >= 0) {
                sendMessage(event.sender.id, { text: "The last person to commit and trigger the build is : Rahal Badr" });
            } else if (values.indexOf("commit") >= 0 && values.indexOf("id") >= 0) {
                sendMessage(event.sender.id, { text: "The commit id of this build is : 6534711" });
            } else if (values.indexOf("build") >= 0 && values.indexOf("started") >= 0) {
                sendMessage(event.sender.id, { text: "The time the build was started : 2014-04-08T19:37:44Z" });
            } else if (values.indexOf("build") >= 0 && values.indexOf("finished") >= 0) {
                sendMessage(event.sender.id, { text: "The time the build finished : 2014-04-08T19:52:56Z" });
            } else if (values.indexOf("duration") >= 0) {
                sendMessage(event.sender.id, { text: "The build duration was : 2648" });
            } else if (values.indexOf("pull") >= 0 && values.indexOf("request") >= 0) {
                sendMessage(event.sender.id, { text: "True" });
            } else if (values.indexOf("pull") >= 0 && values.indexOf("request") >= 0 && values.indexOf("title") >= 0) {
                sendMessage(event.sender.id, { text: "Example PR" });
            } else if (values.indexOf("pull") >= 0 && values.indexOf("request") >= 0 && values.indexOf("number") >= 0) {
                sendMessage(event.sender.id, { text: "The PR number is : 1912" });
            } else if (values.indexOf("Thanks") >= 0) {
                sendMessage(event.sender.id, { text: "You're welcome ;)" });
            } else {
                sendMessage(event.sender.id, { text: "Sorry I didn't undersant what you meant :( Try me again !" });
            }
        } else if (event.postback) {
            console.log("Postback received: " + JSON.stringify(event.postback));
        }
    }
    res.sendStatus(200);
});
