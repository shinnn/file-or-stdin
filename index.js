'use strict';

const {promisify} = require('util');
const {readFile} = require('fs');

const inspectWithKind = require('inspect-with-kind');
const isPlainObj = require('is-plain-obj');

const promisifiedReadFile = promisify(readFile);

module.exports = async function fileOrStdin(...args) {
	const argLen = args.length;

	if (argLen !== 1 && argLen !== 2) {
		throw new RangeError(`Expected 1 or 2 arguments (<string|Buffer|URL>[, <Object|string>]), but got ${
			argLen === 0 ? 'no' : argLen
		} arguments.`);
	}

	const [filePath, options = {}] = args;

	if (argLen === 2) {
		if (typeof options !== 'string' && !isPlainObj(options)) {
			const error = new TypeError(`Expected an <Object> specifying fs.readFile() options or a <string> of a file encoding, but got ${
				inspectWithKind(options)
			}.`);

			error.code = 'ERR_INVALID_OPT_VALUE';
			throw error;
		}
	}

	const encoding = typeof options === 'string' ? options : options.encoding;

	if (encoding === '') {
		const error = new TypeError('Expected a valid encoding (for example `utf8` and `base64`), but got \'\' (empty string).');

		error.code = 'ERR_INVALID_OPT_VALUE_ENCODING';
		throw error;
	}

	try {
		return await promisifiedReadFile(filePath || 0, options);
	} catch (err) {
		if (err.code === 'EAGAIN') {
			if (encoding) {
				return '';
			}

			return Buffer.alloc(0);
		}

		throw err;
	}
};
