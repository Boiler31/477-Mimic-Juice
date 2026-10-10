// Shared validation rules: loaded by the browser (window.validateLogin)
// and by the Node server (require), so both sides enforce the same logic.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.validateLogin = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const MIN_PASSWORD_LENGTH = 8;

  function validateLogin(email, password) {
    const errors = {};
    if (typeof email !== 'string' || email.trim() === '') errors.email = 'Please provide an email address.';
    else if (!email.includes('@')) errors.email = 'Email must contain "@".';

    if (typeof password !== 'string' || password === '') errors.password = 'Please provide a password.';
    else if (password.length < MIN_PASSWORD_LENGTH) errors.password = 'Password must be at least ' + MIN_PASSWORD_LENGTH + ' characters.';

    return { valid: Object.keys(errors).length === 0, errors: errors };
  }

  return validateLogin;
});
