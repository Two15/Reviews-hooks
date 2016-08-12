'use strict';

const restify = require('restify');
const signatureCheck = require('./signature_check');
const eventFilter = require('./event_filter');
const actionParser = require('./action_filter');
const gh = require('./github');

const server = restify.createServer();
server.use(restify.bodyParser( { mapParams: false } ));

server.use(eventFilter);
server.use(actionParser);
server.use(signatureCheck);

function handlerPOST(req, res, next) {
  req.githubEventHandler.call({ log: server.log }, req.body)
  .then(function() {
    res.send(201, 'OK');
    next();
  }, function(reason) {
    server.log.error(reason.message || reason.msg || reason);
    server.log.debug(reason);
    if (reason instanceof Error) {
      reason = {
        message: reason.message,
        stack: reason.stack
      };
      res.send(500, reason);
    } else {
      res.send(200, reason);
    }
    next();
  });
}

server.post('/handler', handlerPOST);
server.post('/', handlerPOST);

module.exports = {
  start: function(port, token) {
    gh.token = token;
    if (process.env.CI) {
      server.log.level(Infinity); // Disables logging
    }
    server.listen(port || 8080, function() {
      server.log.info( '%s listening at %s', server.name, server.url);
    });
    return server;
  }
};
