'use strict';

const GithubApi = require('github4');

module.exports = {
  token: null,
  client: function(token) {
    const client = new GithubApi({
      version: '3.0.0',
      timeout: 5000,
      headers: 'Review My Code'
    });

    client.authenticate({
      type: 'oauth',
      token: token || module.exports.token
    });
    return client;
  }
};
