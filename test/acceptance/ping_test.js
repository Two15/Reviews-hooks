'use strict';

var assert = require('assert');
var nock = require('nock');
var fetch = require('node-fetch');

var server = require('../../lib/server');

nock.emitter.on('no match', function(req) {
  if (req.hostname.match('github')) {
    assert.ok(false, 'A request has not been intercepted');
  }
});

describe('Ping', function() {
  before(function() {
    server = server.start();
  });
  after(function(done) {
    server.close(done);
  });
  it('responds to pings from Github', function () {
    const data = require('./samples/ping.json');
    return fetch(server.url, {
      method: 'POST',
      headers: {
        "x-github-event" : "ping",
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(function(res) {
      assert.equal(res.status, 201, 'The service responded to the ping');
    });
  });
});

