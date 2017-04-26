'use strict';

const fileOrStdin = require('.');
const {strictEqual} = require('assert');

require('loud-rejection/register');

(async () => {
  strictEqual(
    await fileOrStdin(null, {encoding: 'base64'}),
    Buffer.from('* text=auto\n').toString('base64'),
    'should respect encoding option.'
  );

  process.stdin.removeAllListeners('readable');
  process.stdin.removeAllListeners('end');

  strictEqual(
    await fileOrStdin(null, {encoding: 'UTF-8'}),
    '* text=auto\n',
    'should respect encoding option.'
  );
})();
