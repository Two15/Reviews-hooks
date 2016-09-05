'use strict';

module.exports = function(author, body) {
  return function(reviewers) {
    if ([':-1:', '👎'].indexOf(body.trim()) >= 0 && reviewers[author]) {
      reviewers[author.toLowerCase()].state = 'failure';
      reviewers[author.toLowerCase()].description = `@${author} rejected the pull-request`;
    }
    if ([':+1:', '👍'].indexOf(body.trim()) >= 0 && reviewers[author]) {
      reviewers[author.toLowerCase()].state = 'success';
      reviewers[author.toLowerCase()].description = `@${author} accepted the pull-request`;
    }
    return reviewers;
  };
};
