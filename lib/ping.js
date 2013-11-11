var ping = null;
try {
    ping = require('net-ping');
}
catch (e) {
    ping = null;
}

var canPing = true;

var checkNet = function(cb) {

    var calledCallback = false;
    var pingoptions = {
        timeout: 2000,
        packetSize: 32,
        ttl: 54
    };

    try {
        var session = ping.createSession(pingoptions);

        session.pingHost ('8.8.4.4', function (error, target) {
            if (error) {
                if (!calledCallback) {
                    cb(false);
                    calledCallback = true;
                }
            }
            else {
                if (!calledCallback) {
                    cb(true);
                    calledCallback = true;
                }
            }

        });
    }
    catch(e) {
        console.log("Error while trying to ping, stopping future offline checks. Error: " + e);
        canPing = false;
        //By Default, assume we are online
        if (!calledCallback) {
            cb(true);
        }
    }
};