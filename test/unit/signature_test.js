'use strict';

var assert = require('assert');
var sign = require('../../lib/signature');

describe('Signature check test', function() {
  it('should sign plain strings correctly', function () {
    assert.equal(sign('sha1', 'abcd', 'blabla'), 'ad1326a6b6c87f6910279bcf19f95dbe1d258c6c');
  });

  it('should sign unicode strings correctly', function () {
    assert.equal(sign('sha1', 'abcd', '👎'), '9dc677a07bb5a862c59bb4e47fbcbcffb7e5a124');
  });

  it('should match with Github\'s signature', function() {
    assert.equal(sign('sha1', 'd53622ca-0bfa-47c8-aac8-f24e2744827c', JSON.stringify(require('./signature_sample.json'))), '1e9547c5c5db0a62e25743d97d2a21584efdf762');
  });
});
