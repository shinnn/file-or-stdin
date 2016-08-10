'use strict';

const util = require('util');

const fs = require('graceful-fs');
const getStdin = require('get-stdin');

module.exports = function fileOrStdin(filePath, options) {
  if (options !== undefined && typeof options !== 'object' && typeof options !== 'string') {
    return Promise.reject(new TypeError(
      'Expected an object or a string, but got ' +
      util.inspect(options) +
      ` (${typeof options}).`
    ));
  }

  if (options === '') {
    return Promise.reject(new Error(
      'Expected a valid encoding (for example `utf8` and `base64`), but got an empty string.'
    ));
  }

  if (filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, options, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(data);
      });
    });
  }

  const encoding = typeof options === 'string' ? options : (options || {}).encoding;
  const promise = getStdin.buffer();

  if (encoding) {
    return promise.then(buf => buf.toString(encoding));
  }

  return promise;
};
