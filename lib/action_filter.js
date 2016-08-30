'use strict';

module.exports = function(req, res, next) {
  var event = req.githubEvent;
  var action = req.githubAction = req.body.action || 'no_action';
  try {
    var mod = require(['.', 'events', event, action].join('/'));
    req.log.trace('Found handler for ' + event + '/' + action);
    req.githubEventHandler = mod;
  } catch(e) {
    req.log.info('Could not find or open handler for ' + event + '/' + action);
    req.log.debug(e.message);
    res.send(200);
    next(false);
    return;
  }
  next();
};
