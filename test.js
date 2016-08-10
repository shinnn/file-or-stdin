'use strong';

const fileOrStdin = require('.');
const {test} = require('tape');

test('fileOrStdin', t => {
  t.plan(6);

  fileOrStdin(null).then(data => {
    t.ok(
      data.equals(new Buffer(0)),
      'should be resolve with an emtpty buffer when no data is passed to stdin.'
    );
  }).catch(t.fail);

  fileOrStdin(null, 'ucs2').then(data => {
    t.strictEqual(
      data,
      '',
      'should be resolve with an emtpty string when no data is passed to stdin and encoding is specified.'
    );
  }).catch(t.fail);

  fileOrStdin('.gitattributes', 'utf8').then(data => {
    t.strictEqual(
      data,
      '* text=auto\n',
      'should read a given file.'
    );
  }).catch(t.fail);

  fileOrStdin('__this/file/does/not/exist__', {}).then(t.fail, err => {
    t.strictEqual(
      err.code,
      'ENOENT',
      'should fail when it cannot read a given file.'
    );
  }).catch(t.fail);

  fileOrStdin('file_path', 0).then(t.fail, err => {
    t.strictEqual(
      err.message,
      'Expected an object or a string, but got 0 (number).',
      'should fail when the second argument is neither an object nor a string.'
    );
  }).catch(t.fail);

  fileOrStdin('file_path', '').then(t.fail, err => {
    t.strictEqual(
      err.message,
      'Expected a valid encoding (for example `utf8` and `base64`), but got an empty string.',
      'should fail when the second argument is an empty string.'
    );
  }).catch(t.fail);
});
