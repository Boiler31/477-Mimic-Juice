const test = require('node:test');
const assert = require('node:assert');
const validateLogin = require('../public/validate');

test('rejects empty input', () => {
  const r = validateLogin('', '');
  assert.strictEqual(r.valid, false);
  assert.ok(r.errors.email && r.errors.password);
});
test('rejects email without @', () => assert.ok(validateLogin('abc', 'password1').errors.email));
test('rejects short password', () => assert.ok(validateLogin('a@b.c', 'short').errors.password));
test('accepts valid input', () => assert.strictEqual(validateLogin('a@b.c', 'password1').valid, true));
test('rejects non-string input', () => assert.strictEqual(validateLogin(null, 123).valid, false));
