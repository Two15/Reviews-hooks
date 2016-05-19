'use strict';

var assert = require('assert');
var describeAPI = require('../helper').describe;

describeAPI('Rejected event', function() {
  it('is handled and dropped', function () {
    return this.webhook("unknown event", "")
    .then(function(res) {
      assert.equal(res.status, 200, "The request has been handled");
    });
  });
});

describeAPI('Unknown action', function() {
  it('is handled and dropped', function () {
    return this.webhook("ping", { action: "nope" })
    .then(function(res) {
      assert.equal(res.status, 200, "The request has been handled");
    });
  });
});

