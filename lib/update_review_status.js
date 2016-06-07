'use strict';

module.exports = function(author, body) {
  return function(reviewers) {
    if ([':-1:', '👎'].indexOf(body.trim()) >= 0 && reviewers[author]) {
      reviewers[author].state = 'failure';
      reviewers[author].description = `@${author} rejected the pull-request`;
    }
    if ([':+1:', '👍'].indexOf(body.trim()) >= 0 && reviewers[author]) {
      reviewers[author].state = 'success';
      reviewers[author].description = `@${author} accepted the pull-request`;
    }
    return reviewers;
  };
};
