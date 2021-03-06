'use strict';

module.exports = function(req, res, next) {
  req.github = req.github || {};
  const event = req.github.event;
  const action = req.github.action = req.body.action || 'no_action';
  try {
    const mod = require(['..', 'events', event, action].join('/'));
    req.log.trace('Found handler for ' + event + '/' + action);
    req.github.eventHandler = mod;
  } catch(e) {
    req.log.info('Could not find or open handler for ' + event + '/' + action);
    req.log.debug(e.message);
    res.send(200);
    next(false);
    return;
  }
  next();
};
