
var connectAssets   = require('connect-assets');

module.exports = function(app, express) {

	// express logging
    //app.use(express.logger('dev'));

    // dependency based asset loading
    app.use(connectAssets({
        src : __dirname + "/../public"
    }));

    app.use(express.errorHandler({ 
        dumpExceptions: true, 
        showStack: true 
    }));

}