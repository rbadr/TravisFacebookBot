var Travis = require('travis-ci');

var request = require('request');

var travisApiRemoteHost = exports.travisApiRemoteHost = 'http://api.travis-ci.org';
// To set custom headers
var fs = require("fs");
var travis = new Travis({
    version: '2.0.0',
    headers: {
        'user-agent': 'MyClient/1.0.0'
    }
});
travis.auth.github.post({
    github_token: "538747f5a5f080de293284690addcb5d7a91d75f"
}, function(err, res) {
    travis.authenticate({
        access_token: res.access_token
    }, function(err) {

    });
});

// get information about the latest build on a given branch.
exports.getLatestBuild = function(repoOwner, repoName, branch) {
    request({
        method: 'GET',
        url: travisApiRemoteHost + '/repos/' + repoOwner + '/' + repoName + '/branches/' + branch
    }, function(error, response) {
        if (error) {
            console.error('Error while getLastBuild request: ', error);
            return error;
        } else {
            console.log('Last build result: ', response.body);
            return response.body;
        };
    });
}

// get information about all the builds.
exports.getAllBuilds = function(repoOwner, repoName) {
    request({
        method: 'GET',
        url: travisApiRemoteHost + '/repos/' + repoOwner + '/' + repoName + '/builds'
    }, function(error, response) {
        if (error) {
            console.error('Error while getAllBuilds request: ', error);
            return error;
        } else {
            console.log('Last build result: ', response.body);
            return response.body;
        };
    });
}

// get information about a specific build.
exports.getBuild = function(repoOwner, repoName, buildId) {
    request({
        method: 'GET',
        url: travisApiRemoteHost + '/repos/' + repoOwner + '/' + repoName + '/builds/' + buildId
    }, function(error, response) {
        if (error) {
            console.error('Error while getBuild request: ', error);
            return error;
        } else {
            console.log('Last build result: ', response.body);
            return response.body;
        };
    });
}

// restart a specific build. This request always needs to be authenticated.
exports.restartBuild = function(buildId, travisAccessToken) {
    request({
        method: 'POST',
        qs: { access_token: travisAccessToken },
        url: travisApiRemoteHost + '/builds/' + buildId + '/restart'
    }, function(error, response) {
        if (error) {
            console.error('Error while restartBuild request: ', error);
            return error;
        } else {
            console.log('Restart build result: ', response.body);
            return response.body;
        };
    });
}

// cancel a specific build. This request always needs to be authenticated.
exports.cancelBuild = function(buildId, travisAccessToken) {
    request({
        method: 'POST',
        qs: { access_token: travisAccessToken },
        url: travisApiRemoteHost + '/builds/' + buildId + '/cancel'
    }, function(error, response) {
        if (error) {
            console.error('Error while canceluild request: ', error);
            return error;
        } else {
            console.log('Cancel build result: ', response.body);
            return response.body;
        };
    });
}



exports.affichageInformationBuild = function(element) {
    obj = "----------------------------------\n" +
        "Nom du Projet: " + ifNull(element["slug"]) + "\n" +
        "description :" + ifNull(element["description"]) + "\n" +
        "ID du Dernier Build: " + ifNull(element["last_build_id"]) + "\n" +
        "Numero du Dernier Build :  " + ifNull(element["last_build_number"]) + "\n" +
        "Langage du Projet : " + ifNull(element["last_build_language"]) + "\n" +
        "Debut du Dernier build : " + ifNull(element["last_build_started_at"]) + "\n" +
        "Fin du Dernier build : " + ifNull(element["last_build"]) + "\n" +
        "Etat du dernier Build : " + ifNull(element["last_build_state"]) + "\n"
    return obj;
}

exports.affichageInformationGeneral = function(element) {
    obj = "----------------------------------\n" +
        "Nom du Projet: " + ifNull(element["slug"]) + "\n" +
        "description :" + ifNull(element["description"]) + "\n";
    if (element["active"] == null)
        element["active"] = false
    obj = obj + "Prise en charge de l'Integration continue ? : " + element["active"] + "\n"
    return obj;
}

exports.affichageEtatBuilds = function(element) {

    obj = "--------------------------------------\n" + "id du Build :" + ifNull(element["id"]) + "\n" +
        "Build Numero " + ifNull(element["number"]) + "\n" +
        "Etat :" + ifNull(element["state"]) + "\n"
    "Debut du Build : " + ifNull(element["started_at"]) + "\n" +
        "Fin du Build : " + ifNull(element["finished_at"]) + "\n"
    "Durée du Build : " + ifNull(element["duration"]) + "\n"
    return obj;
}

exports.affichageEtatUnBuilds = function(build, commit) {
    obj = "--------------------------------------\n" + "id du Build :" + ifNull(build["id"]) + "\n" +
        "Build Numero " + ifNull(build["number"]) + "\n" +
        "Etat :" + ifNull(build["state"]) + "\n" +
        "Debut du Build : " + ifNull(build["started_at"]) + "\n" +
        "Fin du Build : " + ifNull(build["finished_at"]) + "\n" +
        "Durée du Build : " + ifNull(build["duration"]) + "s\n" +
        "Id du Commit : " + ifNull(commit["id"]) + "\n" +
        "Branch :" + ifNull(commit["branch"]) + "\n" +
        "Message :" + ifNull(commit["message"]) + "\n" +
        "Auteur du Commit :" + ifNull(commit["committer_name"]) + "\n" +
        "Mail de l'auteur :" + ifNull(commit["committer_email"]) + "\n" +
        "Date du Commit :" + ifNull(commit["committed_at"]) + "\n"
    return obj


}

exports.affichageCommit = function(commit) {
    obj = "----------------------------------------\n" +
        "Id du Commit : " + ifNull(commit["id"]) + "\n" +
        "Branch :" + ifNull(commit["branch"]) + "\n" +
        "Message :" + ifNull(commit["message"]) + "\n" +
        "Auteur du Commit :" + ifNull(commit["committer_name"]) + "\n" +
        "Mail de l'auteur :" + ifNull(commit["committer_email"]) + "\n" +
        "Date du Commit :" + ifNull(commit["committed_at"]) + "\n"
    return obj
}

function ifNull(element) {
    if (element == null || element == "") {
        return "Pas d'information "
    } else
        return element;
}
