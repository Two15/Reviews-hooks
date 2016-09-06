'use strict';

var assert = require('assert');
var describeAPI = require('../helper').describeAcceptance;

describeAPI('Creation of a pull-request', function() {
  it('adds a "failed" status if no reviewer is specified', function () {
    this.ghMock(
      'POST',
      '/repos/Two15/trashbin/statuses/90769351b748e0f5e9504afe897f95626c3a78c5',
      (uri, body)=> {
        assert.equal(body.state, "failure", "The CI status fails");
      }
    );

    const data = require('./samples/create_pull_request_no_review.json');
    return this.webhook("pull_request", data)
    .then(function(res) {
      assert.equal(res.status, 201);
    });
  });

  it('creates one event if a reviewer is specified', function () {
    this.ghMock(
      'POST',
      '/repos/Two15/trashbin/statuses/90769351b748e0f5e9504afe897f95626c3a78c5',
      (uri, body)=> {
        assert.equal(body.state, "pending", "A review is expected");
        assert.ok(body.context.match("@user1"), "The review is assigned to a user");
      }
    );
    this.ghMock(
      'POST',
      '/repos/Two15/trashbin/statuses/90769351b748e0f5e9504afe897f95626c3a78c5',
      (uri, body)=> {
        assert.equal(body.state, "success", "Reviews have been defined");
        assert.equal(body.description, "Reviews have been required", "Success because at least one review has been assigned");
      }
    );

    const data = require('./samples/create_pull_request_one_review.json');
    return this.webhook("pull_request", data)
    .then(function(res) {
      assert.equal(res.status, 201);
    });
  });

  it('creates one event per reviewer', function () {
    this.ghMock(
      'POST',
      '/repos/Two15/trashbin/statuses/90769351b748e0f5e9504afe897f95626c3a78c5',
      (uri, body)=> {
        assert.equal(body.state, "pending", "A review is expected");
        assert.ok(body.context.match("@user1"), "The review is assigned to a user");
      }
    );
    this.ghMock(
      'POST',
      '/repos/Two15/trashbin/statuses/90769351b748e0f5e9504afe897f95626c3a78c5',
      (uri, body)=> {
        assert.equal(body.state, "pending", "A review is expected");
        assert.ok(body.context.match("@user2"), "The review is assigned to a user");
      }
    );
    this.ghMock(
      'POST',
      '/repos/Two15/trashbin/statuses/90769351b748e0f5e9504afe897f95626c3a78c5',
      (uri, body)=> {
        assert.equal(body.state, "success", "Reviews have been defined");
        assert.equal(body.description, "Reviews have been required", "Success because at least one review has been assigned");
      }
    );

    const data = require('./samples/create_pull_request_many_reviews.json');
    return this.webhook("pull_request", data)
    .then(function(res) {
      assert.equal(res.status, 201);
    });
  });
});
