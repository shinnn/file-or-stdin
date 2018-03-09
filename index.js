'use strict';

const {promisify} = require('util');

const {readFile} = require('graceful-fs');
const getStdin = require('get-stdin');
const inspectWithKind = require('inspect-with-kind');

const promisifiedReadFile = promisify(readFile);

module.exports = async function fileOrStdin(...args) {
	const argLen = args.length;

	if (argLen !== 1 && argLen !== 2) {
		throw new RangeError(`Expected 1 or 2 arguments (<string|Buffer|URL>[, <Object|string>]), but got ${
			argLen === 0 ? 'no' : argLen
		} arguments.`);
	}

	const [filePath, options] = args;

	if (options !== undefined && typeof options !== 'object' && typeof options !== 'string') {
		throw new TypeError(`Expected an object or a string, but got ${
			inspectWithKind(options)
		}.`);
	}

	if (options === '') {
		throw new Error('Expected a valid encoding (for example `utf8` and `base64`), but got \'\' (empty string).');
	}

	if (filePath) {
		return promisifiedReadFile(...args);
	}

	const encoding = typeof options === 'string' ? options : (options || {}).encoding;

	if (/^utf-?8$/i.test(encoding)) {
		return getStdin();
	}

	const buf = await getStdin.buffer();

	if (encoding) {
		return buf.toString(encoding);
	}

	return buf;
};
