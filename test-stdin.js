'use strict';

const fileOrStdin = require('.');
const {strictEqual} = require('assert');
require('loud-rejection/register');

fileOrStdin(null, {encoding: 'base64'}).then(data => {
  strictEqual(data, Buffer.from('* text=auto\n').toString('base64'), 'should respect encoding option.');
});
