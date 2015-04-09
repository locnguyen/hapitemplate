var PORT = process.env.PORT || 8000;
var ENV = process.env.NODE_ENV || 'development';
var config = require ('../config/server.config')[ENV];

var server = Hapi.Server({
    app: config
});

server.connection({
    port: PORT
});

server.app.knex = require('./db/knex');
server.app.logger = require('./logger')(config.log);

server.on('start', function () {
   console.log('Application started at %s', server.info.uri);
});

server.on('request-error', function (request, err) {
    logger.error(err, 'Encountered an error forcing 500 response');
});

// Create child log for each HTTP request so we can identify by the request id
server.ext('onRequest', function (req, reply) {
    req.logger = logger.child({ request_id: req.id });
    reply.continue();
});
