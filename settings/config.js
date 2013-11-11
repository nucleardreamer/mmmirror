var path = require('path');
var os = require('os');

//Append to log file in: Home dir if OSX/Linux, C:/ directory if Windows
function getLogFilePath() {
    //return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
    return (process.platform == 'win32') ? 'C:/' : process.env['HOME'];
}

// globs
var serverDebug = true;

var settings = {
    'siteName' : 'mmmirror',
    'sessionSecret' : 'guesswedontreallyneedthis',
    'uri' : 'http://localhost',
    'port' : process.env.PORT || 3001,
    'debug' : serverDebug,
    'profile' : 0,
    'logProjectName':'mmmirror',
    'kioskID': os.hostname(),
    //'errorLogFilename': path.resolve(getLogFilePath(), (serverDebug ? "./mmmirror-nodejs-errors-debug.log" : "./mmmirror-nodejs-errors.log")),
    //'sessionLogFilename': path.resolve(getLogFilePath(), (serverDebug ? "./mmmirror-webclient-events-debug.log":  "./mmmirror-webclient-events.log")),
    'offline': false
};

module.exports = function(app, express, env) {
    if ('development' == env) {
        require("./development")(app, express);
    }
    if ('production' == env) {
        require("./production")(app, express);
    }
};

module.exports.settings = settings;