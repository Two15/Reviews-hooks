'use strict';

var assert = require('assert');
var dropMerged = require('../../lib/drop_merged');

describe('Drop filter', function() {
  it('drops merged pull requests', function() {
    return dropMerged({ merged: true })
      .then(
        ()=> assert.ok(false, 'it should not pass'),
        ()=> assert.ok(true, 'it has been dropped'));
  });
  it('passes open pull requests', function() {
    return dropMerged({  })
      .then(
        ()=> assert.ok(true, 'it has passed'),
        ()=> assert.ok(false, 'it should have been dropped'));
  });
});
