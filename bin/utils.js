var Q = require('q');
var _ = require('lodash');

var url = require('url');
var cp = require('child_process');


// Get the remote of a given repo
function gitURL(path) {
    var d = Q.defer();

    cp.exec("git config --get remote.origin.url", {
        cwd: path,
        env: process.env,
    }, function(err, stdout, stderr) {
        if(err) {
            return d.reject(err);
        }

        return d.resolve(stdout);
    });

    return d.promise
    .then(function(output) {
        return output.replace(/(\r\n|\n|\r)/gm, "");
    });
}

// Poorman's parsing
// Parse a git URL to a github ID : username/reponame
function githubID(_url) {
    // Detect HTTPS repos
    var parsed = url.parse(_url);
    if(parsed.protocol === 'https:' && parsed.host === 'github.com') {
        return parsed.path.slice(1, -4);
    }

    // Detect SSH repos
    if(_url.indexOf('git@') === 0) {
        return _url.split(':', 2)[1].slice(0, -4);
    }

    // None found
    return null;
}

function titleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}


// Exports
module.exports = {
    gitURL: gitURL,
    githubID: githubID,
    titleCase: titleCase,
};