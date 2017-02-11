var nlp = require('natural');

const facebook = require('./lib/graph-api');
const travis = require('./lib/travis-api');

exports.launchNaturalLanguageProcessor = function(values, user) {
    if (values.indexOf("hello") >= 0) {
        facebook.sendMessage(event.sender.id, { text: "Hello, How may I help you ?" });
    } else if (values.indexOf("build") >= 0 && values.indexOf("project") >= 0 && values.indexOf("informations") >= 0) {
        facebook.sendMessage(event.sender.id, { text: "Yes for sure, I'll just need your repo's name as followed repoOwner : repoName" });
    } else if (values.indexOf(":") >= 0) {
        var repoOwner = values[values.indexOf(":") - 1];
        var repoName = values[values.indexOf(":") + 1];
        var buildStatus = "Passed";
        facebook.sendMessage(event.sender.id, { text: "The last build status for " + repoOwner + "/" + repoName + " is : " + buildStatus });
    } else if (values.indexOf("build") >= 0 && values.indexOf("id") >= 0) {
        var buildId = "22555277";
        facebook.sendMessage(event.sender.id, { text: "The build id is : " + buildId });
    } else if (values.indexOf("build") >= 0 && values.indexOf("number") >= 0) {
        var buildNumber = "784";
        facebook.sendMessage(event.sender.id, { text: "The build number is : " + buildNumber });
    } else if (values.indexOf("who") >= 0 && values.indexOf("commited") >= 0) {
        var authorName = "Rahal Badr";
        facebook.sendMessage(event.sender.id, { text: "The last person to commit and trigger the build is : " + authorName });
    } else if (values.indexOf("commit") >= 0 && values.indexOf("id") >= 0) {
        var commitId = "6534711";
        facebook.sendMessage(event.sender.id, { text: "The commit id of this build is : " + commitId });
    } else if (values.indexOf("build") >= 0 && values.indexOf("started") >= 0) {
        var startedAt = "2014-04-08T19:37:44Z";
        facebook.sendMessage(event.sender.id, { text: "The time the build was started : " + startedAt });
    } else if (values.indexOf("build") >= 0 && values.indexOf("finished") >= 0) {
        var finishedAt = "2014-04-08T19:37:44Z";
        facebook.sendMessage(event.sender.id, { text: "The time the build finished : " + finishedAt });
    } else if (values.indexOf("duration") >= 0) {
        var buildDuration = "2648";
        facebook.sendMessage(event.sender.id, { text: "The build duration was : " + buildDuration });
    } else if (values.indexOf("pull") >= 0 && values.indexOf("request") >= 0 && values.indexOf("title") >= 0) {
        var pullRequestTitle = "Example PR";
        facebook.sendMessage(event.sender.id, { text: pullRequestTitle });
    } else if (values.indexOf("pull") >= 0 && values.indexOf("request") >= 0 && values.indexOf("number") >= 0) {
        var pullRequestNumber = "1912";
        facebook.sendMessage(event.sender.id, { text: "The PR number is : " + pullRequestNumber });
    } else if (values.indexOf("pull") >= 0 && values.indexOf("request") >= 0) {
        var isPullRequest = "True";
        facebook.sendMessage(event.sender.id, { text: isPullRequest });
    } else if (values.indexOf("thanks") >= 0) {
        facebook.sendMessage(event.sender.id, { text: "You're welcome ;)" });
    } else if (values.indexOf("email") >= 0) {
        facebook.sendMessage(event.sender.id, { text: "Hang tight ! Sending you email to Badr" });
        var senderEmail = 'rahal.badr@gmail.com';
        var subject = 'CI Notification From Rahal Badr';
        var mapObj = {
            he: " you",
            his: " your"
        };
        var content = receivedMessage.replace(/\she\s|\shis\s/gi, function(matched) {
            return mapObj[matched.replace(/\s/g, '')];
        });
        var emailContent = content.split(/ tell him (that){0,1}/);
        var emailText = emailContent[emailContent.length - 1].toString();
        emailText = helper.toUp(emailText);
        helper.sendEmailTo(senderEmail, subject, emailText);
        setTimeout(function() { facebook.sendMessage(event.sender.id, { text: "Your email was sent ! " }); }, 5000);
    } else {
        facebook.sendMessage(event.sender.id, { text: "Sorry I didn't undersant what you meant :( Try me again !" });
    }
}
