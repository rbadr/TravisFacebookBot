var express = require('express');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

const facebook = require('./lib/graph-api');
const travis = require('./lib/travis-api');
const helper = require('./lib/helper');
const ai = require('./lib/nlp');

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

// handler receiving messages
app.post('/webhook', function(req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            var receivedMessage = event.message.text.toLowerCase();
            var values = receivedMessage.split(' ');
            ai.processMessage(values, event.sender.id);
        } else if (event.postback) {
            console.log("Postback received: " + JSON.stringify(event.postback));
        }
    }
    res.sendStatus(200);
});
