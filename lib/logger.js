'use strict';

const bunyan = require('bunyan');

const Bunyan2Loggly = require('bunyan-loggly');
const config = {
  token: process.env.LOGGLY_TOKEN,
  subdomain: process.env.LOGGLY_SUBDOMAIN
};
const logglyStream = new Bunyan2Loggly(config);

module.exports = function(env) {
  if (process.env.CI) {
    return bunyan.createLogger({
      name: 'zero log',
      stream: process.stdout,
      level: Infinity
    });
  }
  if (env === 'development') {
    return bunyan.createLogger({
      name: 'stdout logger',
      stream: process.stdout,
      level: 'debug'
    });
  }
  if (env === 'production') {
    return bunyan.createLogger({
      name: 'Review My Code - hooks',
      streams: [
        { type: 'raw', stream: logglyStream }
      ]
    });
  }
};
