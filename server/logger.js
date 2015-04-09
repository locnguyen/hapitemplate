var bunyan = require('bunyan');
var config = require('././config')[process.env.NODE_ENV];

var requestSerializer = function (req) {
    return {
        request_correlation_id: req.request_id,
        method: req.method,
        url: req.path,
        headers: req.headers,
        payload: req.payload
    };
};

var responseSerializer = function (res) {
    return {
        request_correlation_id: res.request_id,
        url: res.path,
        headers: res.headers,
        payload: res.payload
    }
};



module.exports = function (config) {
    return bunyan.createLogger({
        name: 'ABAgency',
        serializers: {
            req: requestSerializer,
            res: responseSerializer
        },
        streams: [
            {
                stream: process.stdout,
                level: config.level
            },
            {
                path: config.path,
                level: config.level
            }
        ]
    });
};