#!/usr/bin/env node
'use strict';

var restify = require('restify');
var writeJSON = require('jsonfile').writeFileSync;
require('shelljs/global');



var count = 0;
var dest = './samples/' + (new Date()).getTime();
mkdir('-p', dest);

function makeFileName (event) {
  return dest + '/' + count++ + '_' + event + '.json';
}



function handlerPOST(req, res, next) {
  console.log('writing event', req.headers['x-github-event']);
  writeJSON(makeFileName(req.headers['x-github-event']), req.body, { spaces: 2 });
  res.send(201, 'OK');
  next();
}

var server = restify.createServer();
server.use(restify.bodyParser( { mapParams: false } ));

server.post('/handler', handlerPOST);

server.listen(8080, function() {
  console.log(
    '%s listening at %s to record',
    server.name,
    server.url
  );
});
