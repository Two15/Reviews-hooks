'use strict';

var assert = require('assert');
var describeAPI = require('../helper').describeAcceptance;

describeAPI('Ping', function() {
  it('responds to pings from Github', function () {
    const data = require('./samples/ping.json');
    return this.webhook("ping", data)
    .then(function(res) {
      assert.equal(res.status, 201, 'The service responded to the ping');
    });
  });
});

