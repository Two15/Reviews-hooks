'use strict';

const restify = require('restify');
const signatureCheck = require('./signature_check');
const eventFilter = require('./event_filter');
const actionParser = require('./action_filter');
const gh = require('./github');
const sentry = require('./error_handler');

const server = restify.createServer({
  name: 'Review My Code - Hooks',
  log: require('./logger')(process.env.NODE_ENV)
});
server.use(restify.requestLogger());
server.use(sentry.requestHandler);
server.use(restify.bodyParser( { mapParams: false } ));

server.use(eventFilter);
server.use(actionParser);
server.use(signatureCheck);

function handlerPOST(req, res, next) {
  req.githubEventHandler.call({ log: req.log }, req.body)
  .then(function() {
    res.send(201, 'OK');
    next();
  }, function(reason) {
    server.log.debug(reason);
    if (reason instanceof Error) {
      sentry.client.captureException(reason);
      res.send(500);
      req.log.error(reason);
    } else {
      sentry.client.captureMessage(reason);
      req.log.error({ message: reason });
      res.send(200);
    }
    next();
  });
}

server.post('/handler', handlerPOST);
server.post('/', handlerPOST);

server.use(sentry.errorHandler);
server.use(sentry.fallbackError);

server.on('after', restify.auditLogger({
  log: require('./logger')(process.env.NODE_ENV, 'audit'),
  body: true
}));

module.exports = {
  start: function(port, token) {
    gh.token = token;
    server.listen(port || 8080, function() {
      server.log.info( '%s listening at %s', server.name, server.url);
      console.log('GITHUB_TOKEN', process.env.GITHUB_TOKEN, token);
    });
    return server;
  }
};
