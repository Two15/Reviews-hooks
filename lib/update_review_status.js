'use strict';

module.exports = function(author, body) {
  return function(reviewers) {
    if (body.trim() === ':-1:' && reviewers[author]) {
      reviewers[author].state = 'failure';
      reviewers[author].description = `@${author} rejected the pull-request`;
    }
    if (body.trim() === ':+1:' && reviewers[author]) {
      reviewers[author].state = 'success';
      reviewers[author].description = `@${author} accepted the pull-request`;
    }
    return reviewers;
  };
};
