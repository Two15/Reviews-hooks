#!/usr/bin/env node
'use strict';

var server = require('./lib/server');

server.start(process.env.PORT, process.env.GITHUB_TOKEN);
