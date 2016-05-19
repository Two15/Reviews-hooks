'use strict';

var assert = require('assert');
var extract = require('../../lib/extract_review_requests');

describe('Extract Review Requests', function() {
  it('returns a Promise', function () {
    assert.ok(extract('') instanceof Promise);
  });
  it('resolves to an object', function () {
    const p1 = extract('').then(function(value) {
      assert.deepEqual(value, {}, 'the object is empty when no review have been supplied');
    });
    const p2 = extract('no review at all\r\nbecause we\'re doing things wrong').then(function(value) {
      assert.deepEqual(value, {}, 'the object is empty when no review have been supplied');
    });
    const p3 = extract('Hey, hello @user1 but...\n\r  review: @user2').then(function(value) {
      assert.deepEqual(value, { user2: 'pending' }, 'the status of the reviewer is pending');
    });
    const p4 = extract('Hey, hello @user1 but...\n\r  review: @user2 @user3').then(function(value) {
      assert.deepEqual(value, { user2: 'pending', user3: 'pending' }, 'the status of the reviewer is pending');
    });
    const p5 = extract('hey buddy review: @other-buddy').then(function(value) {
      assert.deepEqual(value, {}, 'it only accepts beginning of lines');
    });
    const p6 = extract('          review: @buddy').then(function(value) {
      assert.deepEqual(value, { buddy: 'pending' }, 'empty spaces are trimmed');
    });
    return Promise.all([p1, p2, p3, p4, p5, p6]);
  });
});
