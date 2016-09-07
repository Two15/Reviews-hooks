'use strict';

module.exports = function(author, body) {
  const authorKey = author.toLowerCase();
  return function(reviewers) {
    if (!reviewers[authorKey]) {
      return reviewers;
    }
    if ([':-1:', '👎'].indexOf(body.trim()) >= 0) {
      reviewers[authorKey].state = 'failure';
      reviewers[authorKey].description = `@${author} rejected the pull-request`;
    }
    if ([':+1:', '👍'].indexOf(body.trim()) >= 0) {
      reviewers[authorKey].state = 'success';
      reviewers[authorKey].description = `@${author} accepted the pull-request`;
    }
    return reviewers;
  };
};
