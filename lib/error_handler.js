var raven = require('raven');

// The client is configured with the SENTRY_DSN environment variable
var client = new raven.Client();

client.patchGlobal();

module.exports = {
  client: client,
  requestHandler: raven.middleware.express.requestHandler(client),
  errorHandler:raven.middleware.express.errorHandler(client),
  fallbackError: function(err, req, res, next) {
    res.statusCode = 500;
    res.end(res.sentry + '\n');
  }
};
