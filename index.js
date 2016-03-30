#!/usr/bin/env node
'use strict';

const restify = require('restify');
const eventFilter = require('./lib/event_filter');
const actionFilter = require('./lib/action_filter');

function handlerPOST(req, res, next) {
  const event = req.headers['x-github-event'];
  eventFilter(event)
  .then(function(eventName) {
    return actionFilter(eventName, req.body.action);
  })
  .then(function(fn) {
    return fn(req.body);
  })
  .then(function() {
    console.log('Action handled!');
    res.send(201, 'OK');
  }, function(reason) {
    console.log('Something went wrong:', reason);
    res.send(422, reason);
  }).finally(function() {
    next();
  });
}

const server = restify.createServer();
server.use(restify.bodyParser( { mapParams: false } ));

server.post('/handler', handlerPOST);

const port = process.env.PORT || 8080;
server.listen(port, function() {
  console.log(
    '%s listening at %s',
    server.name,
    server.url
  );
});
