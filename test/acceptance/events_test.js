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

describe('Rejected event', function() {
  before(function() {
    this.server = server.start(null, 'my_github_token');
  });
  after(function(done) {
    this.server.close(done);
  });
  it('is handled and dropped', function () {
    return fetch(this.server.url, {
      method: 'POST',
      headers: {
        "x-github-event" : "unknown event",
        'Content-Type': 'application/json'
      },
      body: ""
    })
    .then(function(res) {
      assert.equal(res.status, 200, "The request has been handled");
    });
  });
});

describe('Unknown action', function() {
  before(function() {
    this.server = server.start(null, 'my_github_token');
  });
  after(function(done) {
    this.server.close(done);
  });
  it('is handled and dropped', function () {
    return fetch(this.server.url, {
      method: 'POST',
      headers: {
        "x-github-event" : "ping",
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: "nope" })
    })
    .then(function(res) {
      assert.equal(res.status, 200, "The request has been handled");
    });
  });
});

