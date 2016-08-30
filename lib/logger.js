'use strict';

const bunyan = require('bunyan');

const Bunyan2Loggly = require('bunyan-loggly');
const config = {
  token: process.env.LOGGLY_TOKEN,
  subdomain: process.env.LOGGLY_SUBDOMAIN
};

module.exports = function(env, type) {
  if (process.env.CI) {
    return bunyan.createLogger({
      name: 'zero log',
      stream: process.stdout,
      level: Infinity
    });
  }
  if (env === 'development') {
    let name = ['stdout logger'];
    if (type) {
      name.push(type);
    }
    return bunyan.createLogger({
      name: name.join(' - '),
      stream: process.stdout,
      level: 'debug'
    });
  }
  if (env === 'production') {
    let name = ['Review My Code - hooks'];
    if (type) {
      name.push(type);
    }
    return bunyan.createLogger({
      name: name.join(' - '),
      streams: [
        { type: 'raw', stream: new Bunyan2Loggly(config) }
      ]
    });
  }
};
