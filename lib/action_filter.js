'use strict';

module.exports = function(req, res, next) {
  var event = req.githubEvent;
  var action = req.githubAction = req.body.action || 'no_action';
  try {
    var mod = require(['.', 'events', event, action].join('/'));
    this.log.trace('Found handler for ' + event + '/' + action);
    req.githubEventHandler = mod;
  } catch(e) {
    this.log.info('Could not find or open handler for ' + event + '/' + action);
    this.log.debug(e.message);
    res.send(200);
    next(false);
    return;
  }
  next();
};
