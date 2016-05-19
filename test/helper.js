var nock = require('nock');
var fetch = require('node-fetch');
var assert = require('assert');
var server = require('../lib/server');

function noMatch(req) {
  if (req.hostname.match('github')) {
    this._unmocked = this._unmocked || req;
  }
}

function assertAllMocked(result) {
  if (this._unmocked) {
    const _unmocked = this._unmocked;
    const protocol = _unmocked.protocol;
    const host = _unmocked.host;
    const path = _unmocked.path;
    const method = _unmocked.method.toUpperCase();
    assert.ok(false, `${method} ${protocol}://${host}${path} has not been intercepted`);
  }
  assert.ok(nock.isDone(), 'all mocked requests have been played');
  return result;
}

function emitWebhook(name, body) {
  if (typeof body === 'object') {
    body = JSON.stringify(body);
  }
  return this._fetch(this.server.url, {
    method: 'POST',
    headers: {
      "x-github-event" : name,
      'Content-Type': 'application/json'
    },
    body: body
  });
}

module.exports = {
  describe(desc, tests) {
    describe(desc, function() {

      before(function() {
        nock.emitter.on('no match', noMatch.bind(this));
        this.webhook = emitWebhook;
        this._fetch = (url, conf)=> {
          return fetch(url, conf)
          .then(
            assertAllMocked.bind(this),
            assertAllMocked.bind(this)
          );
        };
        this.ghMock = (path, cb)=> {
          nock('https://api.github.com:443').post(path)
          .query({"access_token": 'my_github_token'})
          .reply(201, function(uri, body) {
            return cb(uri, JSON.parse(body));
          });
        };
      });

      after(function() {
        nock.emitter.removeAllListeners('no match');
      });

      beforeEach(function() {
        this._unmocked = false;
        this.server = server.start(null, 'my_github_token');
        nock.cleanAll();
      });

      afterEach(function(done) {
        this.server.close(done);
      });

      tests.apply(this, arguments);
    });
  }
};
