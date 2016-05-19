'use strict';

const validEvents = ['ping', 'pull_request', 'issue_comment'];

module.exports = function (req, res, next) {
  var eventName = req.headers['x-github-event'];
  if (validEvents.indexOf(eventName) !== -1) {
    req.githubEvent = eventName;
    next();
  } else {
    this.log.info('rejecting event ' + eventName);
    res.send(200);
    next(false);
  }
};
