const form = document.getElementById('login-form');
const banner = document.getElementById('form-message');

function showErrors(errors) {
  ['email', 'password'].forEach(function (field) {
    document.getElementById(field + '-error').textContent = errors[field] || '';
    document.getElementById(field).classList.toggle('invalid', Boolean(errors[field]));
  });
}

function showBanner(text, ok) {
  banner.textContent = text;
  banner.className = 'banner ' + (ok ? 'success' : 'failure');
  banner.hidden = false;
}

form.addEventListener('submit', async function (event) {
  event.preventDefault();
  banner.hidden = true;

  const email = form.email.value;
  const password = form.password.value;

  // Client-side validation: stop here if the input is invalid (no request is sent).
  const result = validateLogin(email, password);
  showErrors(result.errors);
  if (!result.valid) return;

  // The server validates again; the client alone is never trusted.
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password })
    });
    const data = await res.json();
    if (res.ok) showBanner(data.message, true);
    else {
      showErrors(data.errors || {});
      showBanner(data.message || 'Login failed.', false);
    }
  } catch (err) {
    showBanner('Could not reach the server.', false);
  }
});
