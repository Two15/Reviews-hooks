'use strict';

const assert = require('assert');
const middleware = require('../../../lib/middlewares/action_filter');
const makeRequest = require('../../helper').makeRequest;

describe('Middleware - Action filter', function() {
  it('should reject when the event/action pair does not have an associated module', function () {
    // Works when the event is unknown
    let req = makeRequest();
    req.github = { event: 'bla' };
    req.body = { action: 'whatever' };
    let next = (value)=> assert.equal(value, false);
    let res = {
      send: (status)=> assert.equal(status, 200, 'it returns a 200')
    };
    middleware(req, res, next);

    // Works when the action is unknown
    req = makeRequest();
    req.github = { event: 'issue_comment' };
    req.body = { action: 'whatever' };
    next = (value)=> assert.equal(value, false);
    res = {
      send: (status)=> assert.equal(status, 200, 'it returns a 200')
    };
    middleware(req, res, next);
  });

  it('should pass when the event/action pair has an associated module', function () {
    // Works when the event is unknown
    let req = makeRequest();
    req.github = { event: 'issue_comment' };
    req.body = { action: 'created' };
    let next = ()=> assert.equal(arguments.length, 0);
    middleware(req, {}, next);
    assert.equal(typeof req.github.eventHandler, 'function', 'The event handler has been loaded, and is a function');
  });
});
