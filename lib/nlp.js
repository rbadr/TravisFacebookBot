var nlp = require('nlp_compromise');
//NN (noun), VB (verb), JJ (adjective), RB (adverb) and IN (preposition).

const facebook = require('./lib/graph-api');
const travis = require('./lib/travis-api');

// Random response sets
var no_response = ["*scratch my head* :(", "How do I respond to that... :O", "I can be not-so-smart from time to time... :(", "Err... you know I'm not human, right? :O"];
var error = ["Sorry I've got a little bit sick. BRB in 2 min :(", "Oops... 404 My Witty Mind Not Found :O", "Oops... My brain went MIA in the cloud, BRB in 2 :(", "Hmm... How should I respond to that... :O"];
var looking_replies = ["Sure, give me a few seconds... B-)", "Scanning the world... :D", "Zoom zoom zoom...", "Going into the Food Cerebro... B-)", "Believe me, I'm a foodie, not an engineer... B-)"];
// END random response sets

//enleve la ponctuation 
function removePunctuation(inp_str) {
    var punctuationless = inp_str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    var finalString = punctuationless.replace(/\s{2,}/g, " ");
    return finalString;
}

//Info bot
function isAskingBotInformation(sentence) {
    var m = nlp.search('what *+ your name', sentence);
    if (len(m) > 0) {
        return True;
    } else return False;
}

//Si Debut de la conversation
function isGreetings(inp_str) {
    string = inp_str.lower().split(" ");
    if (len(string) > 3) {
        return False;
    }

    var greetings = ['hi', 'hey', 'hello', 'greetings', 'good morning', 'good afternoon', 'good evening'];
    for (word in greetings) {
        if (word == string) {
            return True;
        }
        return False;
    }
}

//Si c'est goodbye
function isGoodbye(inp_str) {
    string = inp_str.lower().split(" ");

    byes = ['bye', 'see you'];
    for (word in byes) {
        if (word == string) {
            return True;
        }

        return False;
    }
}

//Si c'est remerciement
function isThanks(inp_str) {
    string = inp_str.lower().split(" ");

    tks = ['thanks', 'thank you'];
    for (word in tks) {
        if (word == string) {
            return True;
        }

        return False;
    }
}


//parser nlp_compromise permet de trouver le verbe VP: phrase verbale , VB: verbe
function findVerb(sentence) {
    var result = [];
    for (chunk in nlp.chunks(sentence)) {
        if (chunk.type == ['VP']) {
            for (w in chunk.words) {
                if (w.type == 'VB') {
                    return w;
                }
            }
        }
        result.push(w);
        return result;
    }
}

//parser nlp_compromise permet de trouver le nom NP: phrase nominal , NNP : nom 
function findProperNoun(sentence) {
    var result = [];
    for (chunk in nlp.chunks(sentence)) {
        if (chunk.type == ['NP']) {
            for (w in chunk.words) {
                if (w.type == 'NNP') {
                    return w;
                }
            }
        }
        result.push(w);
        return result;
    }
}


exports.processIncoming = function(values, user) {
    if (isGreetings) {
        facebook.sendMessage(event.sender.id, { text: "Hello, How may I help you ?" });
    } else if (isAskingBotInformation) {
        facebook.sendMessage(event.sender.id, { text: "My name is CI Notifier, and my creator is Badr Rahal & Jihad El Fakawy" });
    } else if (findVerb(values).contains("give") && (findProperNoun(values).contains("project") || findProperNoun(values).contains("build") || findProperNoun(values).contains("informations"))) {
        facebook.sendMessage(event.sender.id, { text: "Yes for sure, I'll just need your repo's name as followed repoOwner : repoName" });
    } else if (values.indexOf(":") >= 0) {
        var repoOwner = values[values.indexOf(":") - 1];
        var repoName = values[values.indexOf(":") + 1];
        var buildStatus = travis.affichageEtatUnBuilds(repoOwner, repoName).BuildStatus;
        facebook.sendMessage(event.sender.id, { text: "The last build status for " + repoOwner + "/" + repoName + " is : " + buildStatus });
    } else if (findProperNoun(values).contains("id")) {
        var buildId = travis.affichageEtatUnBuilds(repoOwner, repoName).BuildId;
        facebook.sendMessage(event.sender.id, { text: "The build id is : " + buildId });
    } else if (findProperNoun(values).contains("number")) {
        var buildNumber = travis.affichageEtatUnBuilds(repoOwner, repoName).BuildNumber;
        facebook.sendMessage(event.sender.id, { text: "The build number is : " + buildNumber });
    } else if (findProperNoun(values).contains("who") >= 0 && findVerb(values).contains("commited")) {
        var authorName = travis.affichageEtatUnBuilds(repoOwner, repoName).AuthorName;
        facebook.sendMessage(event.sender.id, { text: "The last person to commit and trigger the build is : " + authorName });
    } else if (findProperNoun(values).contains("commit") && findProperNoun(values).contains("id")) {
        var commitId = travis.affichageEtatUnBuilds(repoOwner, repoName).CommitId;
        facebook.sendMessage(event.sender.id, { text: "The commit id of this build is : " + commitId });
    } else if (findProperNoun(values).contains("build") && findProperNoun(values).contains("started")) {
        var startedAt = travis.affichageEtatUnBuilds(repoOwner, repoName).StartedAt;
        facebook.sendMessage(event.sender.id, { text: "The time the build was started : " + startedAt });
    } else if (findProperNoun(values).contains("build") && findProperNoun(values).contains("finished")) {
        var finishedAt = travis.affichageEtatUnBuilds(repoOwner, repoName).FinishedAt;
        facebook.sendMessage(event.sender.id, { text: "The time the build finished : " + finishedAt });
    } else if (findProperNoun(values).contains("duration")) {
        var buildDuration = travis.affichageEtatUnBuilds(repoOwner, repoName).BuildDuration;
        facebook.sendMessage(event.sender.id, { text: "The build duration was : " + buildDuration });
    } else if (findProperNoun(values).contains("pullrequest") && findProperNoun(values).contains("title")) {
        var pullRequestTitle = travis.affichageEtatUnBuilds(repoOwner, repoName).PRTitle;
        facebook.sendMessage(event.sender.id, { text: pullRequestTitle });
    } else if (findProperNoun(values).contains("pullrequest") && findProperNoun(values).contains("number")) {
        var pullRequestNumber = travis.affichageEtatUnBuilds(repoOwner, repoName).PRNumber;
        facebook.sendMessage(event.sender.id, { text: "The PR number is : " + pullRequestNumber });
    } else if (findProperNoun(values).contains("pullrequest")) {
        var isPullRequest = travis.affichageEtatUnBuilds(repoOwner, repoName).PR;
        facebook.sendMessage(event.sender.id, { text: isPullRequest });
    } else if (isThanks) {
        facebook.sendMessage(event.sender.id, { text: "You're welcome ;)" });
    } else if (findProperNoun(values).contains("email")) {
        facebook.sendMessage(event.sender.id, { text: "Hang tight ! Sending you email to Badr" });
        var committer_email = travis.affichageEtatUnBuilds();
        var senderEmail = committer_email;
        var sender = facebook.getUserInfo(event.sender.id);
        var subject = 'CI Notification From' + sender;
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
        facebook.sendMessage(event.sender.id, { text: error[0] });
    }
}
