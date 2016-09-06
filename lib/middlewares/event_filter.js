'use strict';

module.exports = function (req, res, next) {
  req.github = req.github || {};
  const eventName = req.headers['x-github-event'];
  if (module.exports.validEvents().indexOf(eventName) !== -1) {
    req.github.event = eventName;
    next();
  } else {
    req.log.info('rejecting event ' + eventName);
    res.send(200);
    next(false);
  }
};

module.exports.validEvents = function() {
  return ['ping', 'pull_request', 'issue_comment'];
};
