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

  it('changes nothing if no review requests are included', function() {
    this.ghMock('GET', '/repos/Two15/trashbin/pulls/33',
      require('./samples/github_api_pull_request_33.json'));
    this.ghMock('GET',
      '/repos/Two15/trashbin/commits/e1f846155e77fc33c36f3eef247dddc4477328f5/statuses',
      []
    );
    this.ghMock('POST',
      '/repos/Two15/trashbin/statuses/e1f846155e77fc33c36f3eef247dddc4477328f5',
      (uri, data)=> assert.equal(data.context, 'Review my code', 'Recreates the generic review status')
    );
    const data = require('./samples/create_pull_request_comment_no_review.json');
    return this.webhook("issue_comment", data);
  });

  it('can add one review', function() {
    this.ghMock('GET', '/repos/Two15/trashbin/pulls/33',
      require('./samples/github_api_pull_request_33.json'));
    this.ghMock('GET',
      '/repos/Two15/trashbin/commits/e1f846155e77fc33c36f3eef247dddc4477328f5/statuses',
      []);
    this.ghMock('POST',
      '/repos/Two15/trashbin/statuses/e1f846155e77fc33c36f3eef247dddc4477328f5',
      (uri, data)=> {
        assert.equal(data.context, 'Review my code - @other_buddy', 'Creates a review status for the user');
        assert.equal(data.state, 'pending', 'The status is pending');
      }
    );
    this.ghMock('POST',
      '/repos/Two15/trashbin/statuses/e1f846155e77fc33c36f3eef247dddc4477328f5',
      (uri, data)=> assert.equal(data.context, 'Review my code', 'Recreates the generic review status'));
    const data = require('./samples/create_pull_request_comment_one_review.json');
    return this.webhook("issue_comment", data);
  });

  it('can add many reviews', function() {
    this.ghMock('GET', '/repos/Two15/trashbin/pulls/33',
      require('./samples/github_api_pull_request_33.json'));
    this.ghMock('GET',
      '/repos/Two15/trashbin/commits/e1f846155e77fc33c36f3eef247dddc4477328f5/statuses',
      []);
    this.ghMock('POST',
      '/repos/Two15/trashbin/statuses/e1f846155e77fc33c36f3eef247dddc4477328f5',
      (uri, data)=> {
        assert.equal(data.context, 'Review my code - @one_buddy', 'Creates a review status for the user');
        assert.equal(data.state, 'pending', 'The status is pending');
      }
    );
    this.ghMock('POST',
      '/repos/Two15/trashbin/statuses/e1f846155e77fc33c36f3eef247dddc4477328f5',
      (uri, data)=> {
        assert.equal(data.context, 'Review my code - @other_buddy', 'Creates a review status for the user');
        assert.equal(data.state, 'pending', 'The status is pending');
      }
    );
    // This creates the global status
    this.ghMock('POST',
      '/repos/Two15/trashbin/statuses/e1f846155e77fc33c36f3eef247dddc4477328f5');
    const data = require('./samples/create_pull_request_comment_many_reviews.json');
    return this.webhook("issue_comment", data);
  });

  it('can accept a PR', function() {
    this.ghMock('GET', '/repos/Two15/trashbin/pulls/33',
      require('./samples/github_api_pull_request_33.json'));
    this.ghMock('GET',
      '/repos/Two15/trashbin/commits/e1f846155e77fc33c36f3eef247dddc4477328f5/statuses',
      [{
        state: 'pending',
        context: 'Review my code - @buddy'
      }]);
    this.ghMock('POST',
      '/repos/Two15/trashbin/statuses/e1f846155e77fc33c36f3eef247dddc4477328f5',
      (uri, data)=> {
        assert.equal(data.context, 'Review my code - @buddy', 'Creates a review status for the user');
        assert.equal(data.state, 'success', 'The status is set as a success');
      }
    );
    // This creates the global status
    this.ghMock('POST',
      '/repos/Two15/trashbin/statuses/e1f846155e77fc33c36f3eef247dddc4477328f5');

    const data = require('./samples/create_pull_request_comment_accept.json');
    return this.webhook("issue_comment", data);
  });

  it('can reject a PR', function() {
    this.ghMock('GET', '/repos/Two15/trashbin/pulls/33',
      require('./samples/github_api_pull_request_33.json'));
    this.ghMock('GET',
      '/repos/Two15/trashbin/commits/e1f846155e77fc33c36f3eef247dddc4477328f5/statuses',
      [{
        state: 'pending',
        context: 'Review my code - @buddy'
      }]);
    this.ghMock('POST',
      '/repos/Two15/trashbin/statuses/e1f846155e77fc33c36f3eef247dddc4477328f5',
      (uri, data)=> {
        assert.equal(data.context, 'Review my code - @buddy', 'Creates a review status for the user');
        assert.equal(data.state, 'failure', 'The status is set as a failure');
      }
    );
    // This creates the global status
    this.ghMock('POST',
      '/repos/Two15/trashbin/statuses/e1f846155e77fc33c36f3eef247dddc4477328f5');

    const data = require('./samples/create_pull_request_comment_reject.json');
    return this.webhook("issue_comment", data);
  });

  it('can force a rejection on behalf of another user', function() {
    this.ghMock('GET', '/repos/Two15/trashbin/pulls/33',
      require('./samples/github_api_pull_request_33.json'));
    this.ghMock('GET',
      '/repos/Two15/trashbin/commits/e1f846155e77fc33c36f3eef247dddc4477328f5/statuses',
      [{
        state: 'pending',
        context: 'Review my code - @buddy'
      }]);
    this.ghMock('POST',
      '/repos/Two15/trashbin/statuses/e1f846155e77fc33c36f3eef247dddc4477328f5',
      (uri, data)=> {
        assert.equal(data.context, 'Review my code - @buddy', 'Creates a review status for the user');
        assert.equal(data.state, 'failure', 'The status is set as a failure');
      }
    );
    // This creates the global status
    this.ghMock('POST',
      '/repos/Two15/trashbin/statuses/e1f846155e77fc33c36f3eef247dddc4477328f5');

    const data = require('./samples/create_pull_request_comment_force_reject.json');
    return this.webhook("issue_comment", data);
  });
  it('can force a validation on behalf of another user', function() {
    this.ghMock('GET', '/repos/Two15/trashbin/pulls/33',
      require('./samples/github_api_pull_request_33.json'));
    this.ghMock('GET',
      '/repos/Two15/trashbin/commits/e1f846155e77fc33c36f3eef247dddc4477328f5/statuses',
      [{
        state: 'pending',
        context: 'Review my code - @buddy'
      }]);
    this.ghMock('POST',
      '/repos/Two15/trashbin/statuses/e1f846155e77fc33c36f3eef247dddc4477328f5',
      (uri, data)=> {
        assert.equal(data.context, 'Review my code - @buddy', 'Creates a review status for the user');
        assert.equal(data.state, 'success', 'The status is set as a failure');
      }
    );
    // This creates the global status
    this.ghMock('POST',
      '/repos/Two15/trashbin/statuses/e1f846155e77fc33c36f3eef247dddc4477328f5');

    const data = require('./samples/create_pull_request_comment_force_accept.json');
    return this.webhook("issue_comment", data);
  });
});
