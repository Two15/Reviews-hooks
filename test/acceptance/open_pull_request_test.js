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

describe('Creation of a pull-request', function() {
  before(function() {
    server = server.start(null, 'my_github_token');
  });
  after(function(done) {
    server.close(done);
  });
  it('fails the pull-request if no reviewer is specified', function () {
    var postStatusRequest = nock('https://api.github.com:443')
      .post(
        '/repos/Two15/trashbin/statuses/90769351b748e0f5e9504afe897f95626c3a78c5'
      )
      .query({"access_token": 'my_github_token'})
      .reply(201, function(uri, body) {
        body = JSON.parse(body);
        assert.equal(body.state, "failure", "The CI status fails");
      });

    const data = require('./samples/create_pull_request.json');
    return fetch(server.url, {
      method: 'POST',
      headers: {
        "x-github-event" : "pull_request",
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(function(res) {
      assert.equal(res.status, 201);
      assert.ok(postStatusRequest.isDone());
    });
  });
});

