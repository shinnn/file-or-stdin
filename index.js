'use strict';

const {readFile} = require('graceful-fs');
const getStdin = require('get-stdin');
const inspectWithKind = require('inspect-with-kind');

module.exports = function fileOrStdin(...args) {
	const argLen = args.length;

	if (argLen !== 1 && argLen !== 2) {
		return Promise.reject(new RangeError(`Expected 1 or 2 arguments (<string|Buffer|URL>[, <Object|string>]), but got ${
			argLen === 0 ? 'no' : argLen
		} arguments.`));
	}

	const [filePath, options] = args;

	if (options !== undefined && typeof options !== 'object' && typeof options !== 'string') {
		return Promise.reject(new TypeError(`Expected an object or a string, but got ${
			inspectWithKind(options)
		}.`));
	}

	if (options === '') {
		return Promise.reject(new Error('Expected a valid encoding (for example `utf8` and `base64`), but got \'\' (empty string).'));
	}

	if (filePath) {
		return new Promise((resolve, reject) => {
			readFile(filePath, options, (err, data) => {
				if (err) {
					reject(err);
					return;
				}

				resolve(data);
			});
		});
	}

	const encoding = typeof options === 'string' ? options : (options || {}).encoding;

	if (/^utf-?8$/i.test(encoding)) {
		return getStdin();
	}

	const promise = getStdin.buffer();

	if (encoding) {
		return promise.then(buf => buf.toString(encoding));
	}

	return promise;
};
