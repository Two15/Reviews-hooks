'use strict';

const restify = require('restify');
const eventFilter = require('./event_filter');
const actionFilter = require('./action_filter');

const server = restify.createServer();
server.use(restify.bodyParser( { mapParams: false } ));

function requestAction(req) {
  return req.body.action || 'no_action'
}

function handlerPOST(req, res, next) {
  const event = req.headers['x-github-event'];
  eventFilter(event)
  .then(function(eventName) {
    return actionFilter.call(server, eventName, requestAction(req));
  })
  .then(function(fn) {
    return fn(req.body);
  })
  .then(function() {
    res.send(201, 'OK');
    next();
  }, function(reason) {
    server.log.error('Something went wrong:', reason);
    res.send(200, reason);
    next();
  });
}

server.post('/handler', handlerPOST);
server.post('/', handlerPOST);


module.exports = {
  start: function(port) {
    server.listen(port || 8080, function() {
      server.log.info( '%s listening at %s', server.name, server.url);
    });
    return server;
  }
};
