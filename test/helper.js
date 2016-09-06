var get = require('object-path').get;
var nock = require('nock');
var fetch = require('node-fetch');
var assert = require('assert');
var crypto = require('crypto');
var server = require('../lib/server');
var signMessage = require('../lib/signature');
var repositoryUUID = require('../lib/signature_check').repositoryUUID;

function noMatch(req) {
  if (req.hostname && req.hostname.match('github')) {
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
  const repository = get(body, 'repository.name');
  const owner = get(body, 'repository.owner.login');
  if (typeof body === 'object') {
    body = JSON.stringify(body);
  }
  return repositoryUUID(owner, repository)
  .catch(()=> "")
  .then((uuid)=> {
    return this._fetch(this.server.url, {
      method: 'POST',
      headers: {
        "x-github-event" : name,
        "x-hub-signature": "sha1=" + signMessage('sha1', uuid, body),
        'Content-Type': 'application/json'
      },
      body: body
    }).then(res => {
      if (res.status > 300) {
        return res.json()
          .then(json => {
            console.log(json.stack);
            assert.ok(false, `The request failed: ${json.message}`);
          });
      }
      return res;
    });
  });
}

var statuses = {
  post: 201,
  get: 200,
  put: 201,
  'delete': 204
};

module.exports = {
  makeRequest() {
    return {
      headers: {},
      log: {
        debug() {},
        log() {},
        info() {},
        error() {}
      }
    };
  },
  describeAcceptance(desc, tests) {
    describe(desc, function() {

      before(function() {
        nock.emitter.on('no match', noMatch.bind(this));
        this.webhook = emitWebhook;
        this._fetch = (url, conf)=> {
          return fetch(url, conf)
          .then(
            assertAllMocked.bind(this),
            assertAllMocked.bind(this)
          ).then((ret)=> {
            this._mockAssertions.forEach(cb => cb());
            return ret;
          });
        };
        this.ghMock = (method, path, ret, cb)=> {
          if (typeof ret === 'function') {
            cb = ret;
            ret = undefined;
          }
          method = method.toLowerCase();
          var statusCode = statuses[method];
          nock('https://api.github.com:443')
          [method](path)
          .query({"access_token": 'my_github_token'})
          .reply(statusCode, (uri, body)=> {
            try {
              body = JSON.parse(body);
            } catch (e) {}
            if (cb) {
              this._mockAssertions.push(cb.bind(undefined, uri, body));
            }
            return ret;
          });
        };
      });

      after(function() {
        nock.emitter.removeAllListeners('no match');
      });

      beforeEach(function() {
        this._unmocked = false;
        this._mockAssertions = [];
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
