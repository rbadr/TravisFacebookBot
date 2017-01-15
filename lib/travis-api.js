var request = require('request');

var travisApiRemoteHost = exports.travisApiRemoteHost = 'http://api.travis-ci.org';

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
