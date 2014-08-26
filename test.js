#!/usr/bin/env node

'use strict';

var express = require('express');
var spawns = require('spawns');

var app = express();
app.use(express.static(__dirname));
app.listen(8030, function () {
  spawns('sh test.sh', {
    stdio: 'inherit'

  }).on('close', function (code) {
    process.exit(code);
  });
});