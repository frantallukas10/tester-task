export const validCredentials = {
  username: 'admin',
  password: 'Password123.',
}

export const invalidCredentials = [
  // Empty values
  { username: '', password: '' },
  { username: 'admin', password: '' },
  { username: '', password: 'Password123.' },
  {},

  // Invalid data types
  { username: {}, password: 'Password123.' },
  { username: [], password: [] },
  { username: 12345, password: 12345 },
  { username: true, password: false },
  { username: null, password: null },
  { username: undefined, password: undefined },

  // Excessively long values
  { username: 'a'.repeat(256), password: 'Password123.' }, // Username too long
  { username: 'admin', password: 'a'.repeat(256) }, // Password too long

  // Special characters and attacks
  { username: "' OR 1=1; --", password: 'Password123.' }, // SQL Injection
  { username: '<script>alert(1)</script>', password: 'Password123.' }, // XSS attack
  { username: 'admin\\', password: 'Password123.' }, // Backslash in username
  { username: 'admin;', password: 'Password123.' }, // Semicolon in username

  // Invalid formats
  { username: '    ', password: '    ' }, // Whitespace-only values
  { username: 'admin@localhost', password: 'Password123.' }, // Email as username (if unsupported)
  { username: 'admin', password: '12345' }, // Too simple password
  { username: 'admin', password: 'password' }, // Common weak password

  // Prohibited values
  { username: 'root', password: 'Password123.' }, // Restricted username
  { username: 'admin', password: 'admin' }, // Username and password the same
  { username: 'admin', password: 'qwerty' }, // Common default password

  // Combined invalid values
  { username: "' OR 1=1; --", password: '' }, // SQL Injection with empty password
  { username: '', password: "' OR 1=1; --" }, // SQL Injection in password
  { username: '<script>alert(1)</script>', password: '' }, // XSS attack with empty password
]
