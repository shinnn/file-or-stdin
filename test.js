'use strict';

const fileOrStdin = require('.');
const {test} = require('tape');

test('fileOrStdin', async t => {
	t.ok(
		(await fileOrStdin(null)).equals(Buffer.alloc(0)),
		'should be resolve with an emtpty buffer when no data is passed to stdin.'
	);

	t.equal(
		await fileOrStdin(null, 'ucs2'),
		'',
		'should be resolve with an emtpty string when no data is passed to stdin and encoding is specified.'
	);

	t.equal(
		await fileOrStdin('.gitattributes', 'utf8'),
		'* text=auto\n',
		'should read a given file.'
	);

	const fail = t.fail.bind(t, 'Unexpectedly succeeded.');

	try {
		await fileOrStdin('__this/file/does/not/exist__', {});
		fail();
	} catch ({code}) {
		t.equal(
			code,
			'ENOENT',
			'should fail when it cannot read a given file.'
		);
	}

	try {
		await fileOrStdin('file_path', 0);
		fail();
	} catch ({message}) {
		t.equal(
			message,
			'Expected an object or a string, but got 0 (number).',
			'should fail when the second argument is neither an object nor a string.'
		);
	}

	try {
		await fileOrStdin('_', '');
		fail();
	} catch ({message}) {
		t.equal(
			message,
			'Expected a valid encoding (for example `utf8` and `base64`), but got \'\' (empty string).',
			'should fail when the second argument is an empty string.'
		);
	}

	try {
		await fileOrStdin();
		fail();
	} catch (err) {
		t.equal(
			err.toString(),
			'RangeError: Expected 1 or 2 arguments (<string|Buffer|URL>[, <Object|string>]), but got no arguments.',
			'should fail when it takes no arguments.'
		);
	}

	try {
		await fileOrStdin('_', '_', '_');
		fail();
	} catch (err) {
		t.equal(
			err.toString(),
			'RangeError: Expected 1 or 2 arguments (<string|Buffer|URL>[, <Object|string>]), but got 3 arguments.',
			'should fail when it takes too many arguments.'
		);
	}

	t.end();
});
