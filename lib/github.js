'use strict';

const GithubApi = require('github4');
const client = new GithubApi({
  version: '3.0.0',
  timeout: 5000,
  headers: 'MyPeopleDoc Deploy Agent'
});

client.authenticate({
  type: 'oauth',
  token: process.env.GITHUB_TOKEN
});

module.exports = client;
