'use strict';

var assert = require('assert');
var describeAPI = require('../helper').describe;

// This ensure that no other request has been played
describeAPI('Adding a comment to a pull request', function() {
  it('ignores comments from issues (ie, not from a pull-request)', function() {
    const data = require('./samples/create_issue_comment.json');
    return this.webhook("issue_comment", data)
    .then(function(res) {
      assert.equal(res.status, 200, 'The request has not been handled');
    });
  });

  // it('does nothing if no review requests are included', function() {
  //   const data = require('./samples/create_pull_request_comment_no_review.json');
  //   return this.webhook("issue_comment", data);
  // });
  //
  // it('can add one review', function() {
  //   const data = require('./samples/create_pull_request_comment_one_review.json');
  //   return this.webhook("issue_comment", data);
  // });

  it('can add many reviews');
  it('can accept a PR');
  it('can reject a PR');
  it('can force a rejection on behalf of another user');
  it('can force a validation on behalf of another user');
});
