# mimic_juice

A basic HTML + JavaScript login form that mimics the login page of [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/), with validation on both the client and the server.

## What it does

- Email and password fields in a Juice Shop-style dark card.
- **Client-side validation** (`public/app.js`): empty submissions are blocked, and no request is sent until the input passes.
- **Validation function** (`public/validate.js`): the email must contain `@` and the password must be at least 8 characters.
- **Server-side validation** (`server.js`): the same function runs again on `POST /api/login`, because client checks can be bypassed. Invalid input gets a `400` with per-field errors.
- **Credential check:** a demo account is verified with a salted `scrypt` hash and a constant-time comparison. Wrong credentials get a generic `401`.

The server uses only Node's built-in modules and has no dependencies. There is no database and no SQL, so there is nothing to inject into.

## How to run

Requires [Node.js](https://nodejs.org/) 18 or newer.

```bash
git clone <this-repo-url>
cd mimic_juice
npm start
```

Open http://localhost:3000. To use another port, set the `PORT` environment variable.

Demo login: `demo@juice-sh.op` / `demo12345`

## Tests

```bash
npm test
```

## Project structure

```
public/index.html   login page
public/style.css    styling
public/app.js       client-side validation + form submit
public/validate.js  validation rules shared by browser and server
server.js           static file server + POST /api/login
test/               unit tests for the validation rules
```

## Notes

This is a learning project. It has no sessions, HTTPS or rate limiting, so it is not production-ready.
