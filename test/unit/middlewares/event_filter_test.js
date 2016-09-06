'use strict';

const assert = require('assert');
const middleware = require('../../../lib/middlewares/event_filter');
const makeRequest = require('../../helper').makeRequest;

describe('Middleware - Event filter', function() {
  it('should reject when the X-Github-Event is absent', function () {
    const next = (value)=> assert.equal(value, false);
    const res = { send: (status)=> assert.equal(status, 200, 'it returns a 200') };
    middleware(makeRequest(), res, next);
  });

  it('should reject when the X-Github-Event is not accepted', function () {
    const next = (value)=> assert.equal(value, false);
    const res = { send: (status)=> assert.equal(status, 200, 'it returns a 200') };
    const req = makeRequest();
    req.headers['x-github-event'] = 'plop';
    middleware(req, res, next);
  });

  it('should accept a valid event type', function () {
    const next = ()=> assert.equal(arguments.length, 0, 'next is called to continue');
    const req = makeRequest();
    req.headers['x-github-event'] = 'issue_comment';
    middleware(req, {}, next);
    assert.equal(req.github.event, 'issue_comment');
  });

  it('should only accept certain types', function () {
    assert.equal(middleware.validEvents().sort().join(','), ['issue_comment', 'ping', 'pull_request'].join(','));
  });
});
